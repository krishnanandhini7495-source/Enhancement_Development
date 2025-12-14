import { useState, useEffect } from "react";
import { invoicesAPI, servicesAPI, productsAPI, staffAPI, customerAPI } from "@/services/api";
import { settingsAPI, type SalonSettings } from "@/services/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Receipt, Printer } from "lucide-react";
import { toast } from "sonner";
import { generateAndPrintThermalBill } from "@/utils/thermalPrint";

interface Service {
  id: string;
  name: string;
  basePrice: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
}

interface Staff {
  id: string;
  name: string;
}

interface ServiceLine {
  tempId: string;
  serviceId: string;
  serviceName: string;
  basePrice: number;
  discountPercent: number;
  finalPrice: number;
  staffId: string;
}

interface ProductLine {
  tempId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface PaymentMode {
  mode: string;
  amount: number;
}

interface CustomerSuggestion {
  customerName: string;
  phone: string;
  lastVisitDate: string;
  lastInvoiceTotal: number;
  totalVisits: number;
  lastPaymentMode: string;
}

const Billing = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [salonSettings, setSalonSettings] = useState<SalonSettings | null>(null);

  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [customerSuggestions, setCustomerSuggestions] = useState<CustomerSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [serviceLines, setServiceLines] = useState<ServiceLine[]>([]);
  const [productLines, setProductLines] = useState<ProductLine[]>([]);
  const [payments, setPayments] = useState<PaymentMode[]>([{ mode: "Cash", amount: 0 }]);
  
  const [showInvoice, setShowInvoice] = useState(false);
  const [generatedInvoiceId, setGeneratedInvoiceId] = useState<string | null>(null);
  const [generatedInvoiceData, setGeneratedInvoiceData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMasterData();
    const handleFocus = () => fetchSalonSettings();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const fetchMasterData = async () => {
    try {
      const [servicesData, productsData, staffData] = await Promise.all([
        servicesAPI.getAll(),
        productsAPI.getAll(),
        staffAPI.getAll(),
      ]);
      setServices(servicesData.filter((s: any) => s.active) || []);
      setProducts(productsData.filter((p: any) => p.active) || []);
      setStaff(staffData.filter((s: any) => s.active) || []);
      await fetchSalonSettings();
    } catch (error) {
      console.error("Error fetching master data:", error);
      toast.error("Failed to load data");
    }
  };

  const fetchSalonSettings = async () => {
    try {
      const settingsData = await settingsAPI.get();
      setSalonSettings(settingsData);
      if (settingsData && !selectedBranch) {
        setSelectedBranch(settingsData.mainAddress);
      }
    } catch (settingsError) {
      console.error("Error fetching salon settings:", settingsError);
    }
  };

  const searchCustomers = async (query: string) => {
    if (query.length < 3) {
      setCustomerSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    try {
      const results = await customerAPI.search(query);
      setCustomerSuggestions(results);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error searching customers:", error);
    }
  };

  const selectCustomer = (customer: CustomerSuggestion) => {
    setClientName(customer.customerName);
    setClientPhone(customer.phone);
    setShowSuggestions(false);
    setCustomerSuggestions([]);
  };

  const addServiceLine = () => {
    setServiceLines([
      ...serviceLines,
      { tempId: Date.now().toString(), serviceId: "", serviceName: "", basePrice: 0, discountPercent: 0, finalPrice: 0, staffId: "" },
    ]);
  };

  const addProductLine = () => {
    setProductLines([
      ...productLines,
      { tempId: Date.now().toString(), productId: "", productName: "", quantity: 1, unitPrice: 0, totalPrice: 0 },
    ]);
  };

  const updateServiceLine = (tempId: string, field: string, value: any) => {
    setServiceLines(
      serviceLines.map((line) => {
        if (line.tempId !== tempId) return line;
        const updated = { ...line, [field]: value };
        if (field === "serviceId") {
          const service = services.find((s) => s.id === value);
          if (service) {
            updated.serviceName = service.name;
            updated.basePrice = Number(service.basePrice);
            updated.finalPrice = Number(service.basePrice);
          }
        }
        if (field === "discountPercent" || field === "basePrice") {
          const discount = Number(updated.discountPercent) || 0;
          const base = Number(updated.basePrice) || 0;
          updated.finalPrice = base - (base * discount) / 100;
        }
        return updated;
      })
    );
  };

  const updateProductLine = (tempId: string, field: string, value: any) => {
    setProductLines(
      productLines.map((line) => {
        if (line.tempId !== tempId) return line;
        const updated = { ...line, [field]: value };
        if (field === "productId") {
          const product = products.find((p) => p.id === value);
          if (product) {
            updated.productName = product.name;
            updated.unitPrice = Number(product.price);
            updated.totalPrice = Number(product.price) * updated.quantity;
          }
        }
        if (field === "quantity" || field === "unitPrice") {
          updated.totalPrice = Number(updated.quantity) * Number(updated.unitPrice);
        }
        return updated;
      })
    );
  };

  const removeServiceLine = (tempId: string) => setServiceLines(serviceLines.filter((line) => line.tempId !== tempId));
  const removeProductLine = (tempId: string) => setProductLines(productLines.filter((line) => line.tempId !== tempId));

  const updatePayment = (index: number, field: string, value: any) => {
    setPayments(payments.map((payment, i) => (i === index ? { ...payment, [field]: value } : payment)));
  };

  const calculateSubtotal = () => {
    const servicesTotal = serviceLines.reduce((sum, line) => sum + Number(line.finalPrice), 0);
    const productsTotal = productLines.reduce((sum, line) => sum + Number(line.totalPrice), 0);
    return servicesTotal + productsTotal;
  };

  const calculateCGST = () => calculateSubtotal() * 0.025;
  const calculateSGST = () => calculateSubtotal() * 0.025;
  const calculateGrandTotal = () => calculateSubtotal() + calculateCGST() + calculateSGST();
  const calculateTotal = () => calculateGrandTotal();

  const handleGenerateInvoice = async () => {
    if (!clientName.trim() || !clientPhone.trim()) {
      toast.error("Please enter client name and phone");
      return;
    }
    if (serviceLines.length === 0 && productLines.length === 0) {
      toast.error("Please add at least one service or product");
      return;
    }
    const total = calculateTotal();
    const totalPayments = payments.reduce((sum, p) => sum + Number(p.amount), 0);
    if (Math.abs(total - totalPayments) > 0.01) {
      toast.error(`Payment mismatch! Total: ₹${total.toFixed(2)}, Paid: ₹${totalPayments.toFixed(2)}`);
      return;
    }

    setLoading(true);
    try {
      const invoiceData = {
        clientName,
        clientPhone,
        invoiceDate,
        services: serviceLines.map((line) => ({
          serviceId: line.serviceId,
          staffId: line.staffId || null,
          basePrice: line.basePrice,
          discountPercent: line.discountPercent,
          finalPrice: line.finalPrice,
        })),
        products: productLines.map((line) => ({
          productId: line.productId,
          quantity: line.quantity,
          unitPrice: line.unitPrice,
          totalPrice: line.totalPrice,
        })),
        payments: payments.map((payment) => ({
          paymentMode: payment.mode,
          amount: payment.amount,
        })),
      };

      const invoice = await invoicesAPI.create(invoiceData);
      toast.success(`Invoice ${invoice.invoiceNumber} generated successfully!`);
      setGeneratedInvoiceId(invoice.invoiceNumber);
      
      const thermalBillData = {
        salonName: salonSettings?.salonName || "Salon",
        salonAddress: selectedBranch || salonSettings?.mainAddress || "",
        salonPhone: salonSettings?.phone || "",
        salonEmail: salonSettings?.email || "",
        invoiceNumber: invoice.invoiceNumber || `INV-${invoice.id.substring(0, 8)}`,
        customerName: clientName,
        customerPhone: clientPhone,
        services: [
          ...serviceLines.map(line => ({
            name: line.serviceName,
            quantity: 1,
            originalPrice: line.basePrice,
            discountedPrice: line.finalPrice,
            subtotal: line.finalPrice,
          })),
          ...productLines.map(line => ({
            name: line.productName,
            quantity: line.quantity,
            originalPrice: line.unitPrice,
            discountedPrice: line.unitPrice,
            subtotal: line.totalPrice,
          })),
        ],
        subtotal: calculateSubtotal(),
        cgst: calculateCGST(),
        sgst: calculateSGST(),
        totalDiscount: serviceLines.reduce((sum, line) => sum + (line.basePrice - line.finalPrice), 0),
        totalAmount: total,
        payments: payments.map(p => ({ mode: p.mode, amount: Number(p.amount) })),
        amountReceived: totalPayments,
        balanceAmount: totalPayments - total,
      };
      
      setTimeout(() => generateAndPrintThermalBill(thermalBillData), 500);
      setGeneratedInvoiceData(thermalBillData);
      setShowInvoice(true);
    } catch (error: any) {
      console.error("Error generating invoice:", error);
      toast.error(error.message || "Failed to generate invoice");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setClientName("");
    setClientPhone("");
    setInvoiceDate(new Date().toISOString().split("T")[0]);
    setServiceLines([]);
    setProductLines([]);
    setPayments([{ mode: "Cash", amount: 0 }]);
    setShowInvoice(false);
    setGeneratedInvoiceId(null);
  };

  if (showInvoice && generatedInvoiceId) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-center text-xl text-green-600">Invoice Generated!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <Receipt className="h-12 w-12 text-green-600 mx-auto" />
              <p className="font-semibold">Invoice: {generatedInvoiceId}</p>
              {generatedInvoiceData && (
                <p className="text-sm text-muted-foreground">
                  {generatedInvoiceData.customerName} • ₹{generatedInvoiceData.totalAmount.toFixed(2)}
                </p>
              )}
            </div>
            <div className="flex gap-2 justify-center">
              <Button
                size="sm"
                onClick={() => {
                  if (generatedInvoiceData) {
                    generateAndPrintThermalBill(generatedInvoiceData);
                    toast.success("Printing...");
                  }
                }}
                disabled={!generatedInvoiceData}
              >
                <Printer className="h-4 w-4 mr-1" />
                Print
              </Button>
              <Button size="sm" onClick={resetForm} variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                New
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalAmount = calculateTotal();
  const paymentOptions = [
    { mode: "Cash", icon: "💵" },
    { mode: "GPay", icon: "📱" },
    { mode: "Card", icon: "💳" },
    { mode: "PhonePe", icon: "📲" },
    { mode: "Paytm", icon: "💰" },
    { mode: "UPI", icon: "🔗" },
  ];

  return (
    <div className="h-screen overflow-hidden flex flex-col p-3">
      {/* Header - Compact */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl font-bold">New Invoice</h1>
        <span className="text-sm text-muted-foreground">{invoiceDate}</span>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="flex gap-3 flex-1 min-h-0">
        {/* Left Column - Form */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {/* Client Info - Compact */}
          <Card className="shadow-sm">
            <CardContent className="p-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div className="relative">
                  <Label className="text-xs">Name *</Label>
                  <Input
                    value={clientName}
                    onChange={(e) => { setClientName(e.target.value); searchCustomers(e.target.value); }}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    onFocus={() => clientName.length >= 3 && setShowSuggestions(true)}
                    placeholder="Customer"
                    className="h-8 text-sm"
                  />
                  {showSuggestions && customerSuggestions.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg max-h-40 overflow-y-auto">
                      {customerSuggestions.map((customer, index) => (
                        <div
                          key={index}
                          onMouseDown={(e) => { e.preventDefault(); selectCustomer(customer); }}
                          className="px-2 py-1.5 hover:bg-muted cursor-pointer text-sm"
                        >
                          <div className="font-medium">{customer.customerName}</div>
                          <div className="text-xs text-muted-foreground">{customer.phone}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <Label className="text-xs">Phone *</Label>
                  <Input
                    value={clientPhone}
                    onChange={(e) => { setClientPhone(e.target.value); searchCustomers(e.target.value); }}
                    placeholder="+91..."
                    className="h-8 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs">Date</Label>
                  <Input
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    max={new Date().toISOString().split("T")[0]}
                    className="h-8 text-sm"
                  />
                </div>
                {salonSettings?.mainAddress && (
                  <div>
                    <Label className="text-xs">Branch</Label>
                    <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue placeholder="Branch" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={salonSettings.mainAddress}>Main</SelectItem>
                        {salonSettings.branchAddresses?.map((branch, idx) => (
                          <SelectItem key={idx} value={branch.address}>{branch.branchName || `Branch ${idx + 1}`}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Services & Products - Side by Side Compact */}
          <div className="grid md:grid-cols-2 gap-2">
            {/* Services */}
            <Card className="shadow-sm">
              <CardHeader className="p-2 pb-1 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium">Services</CardTitle>
                <Button onClick={addServiceLine} size="sm" variant="ghost" className="h-6 px-2 text-xs">
                  <Plus className="h-3 w-3 mr-1" />Add
                </Button>
              </CardHeader>
              <CardContent className="p-2 pt-0 space-y-1.5 max-h-32 overflow-y-auto">
                {serviceLines.map((line) => (
                  <div key={line.tempId} className="grid grid-cols-12 gap-1 items-center bg-muted/30 p-1.5 rounded text-xs">
                    <Select value={line.serviceId} onValueChange={(v) => updateServiceLine(line.tempId, "serviceId", v)}>
                      <SelectTrigger className="col-span-4 h-7 text-xs"><SelectValue placeholder="Service" /></SelectTrigger>
                      <SelectContent>{services.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                    </Select>
                    <Input type="number" value={line.basePrice} onChange={(e) => updateServiceLine(line.tempId, "basePrice", e.target.value)} className="col-span-2 h-7 text-xs" placeholder="Price" />
                    <Input type="number" value={line.discountPercent} onChange={(e) => updateServiceLine(line.tempId, "discountPercent", e.target.value)} className="col-span-2 h-7 text-xs" placeholder="Disc%" />
                    <Select value={line.staffId} onValueChange={(v) => updateServiceLine(line.tempId, "staffId", v)}>
                      <SelectTrigger className="col-span-3 h-7 text-xs"><SelectValue placeholder="Staff" /></SelectTrigger>
                      <SelectContent>{staff.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon" onClick={() => removeServiceLine(line.tempId)} className="col-span-1 h-6 w-6">
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                ))}
                {serviceLines.length === 0 && <p className="text-xs text-muted-foreground text-center py-3">No services</p>}
              </CardContent>
            </Card>

            {/* Products */}
            <Card className="shadow-sm">
              <CardHeader className="p-2 pb-1 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium">Products</CardTitle>
                <Button onClick={addProductLine} size="sm" variant="ghost" className="h-6 px-2 text-xs">
                  <Plus className="h-3 w-3 mr-1" />Add
                </Button>
              </CardHeader>
              <CardContent className="p-2 pt-0 space-y-1.5 max-h-32 overflow-y-auto">
                {productLines.map((line) => (
                  <div key={line.tempId} className="grid grid-cols-12 gap-1 items-center bg-muted/30 p-1.5 rounded text-xs">
                    <Select value={line.productId} onValueChange={(v) => updateProductLine(line.tempId, "productId", v)}>
                      <SelectTrigger className="col-span-5 h-7 text-xs"><SelectValue placeholder="Product" /></SelectTrigger>
                      <SelectContent>{products.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                    </Select>
                    <Input type="number" min="1" value={line.quantity} onChange={(e) => updateProductLine(line.tempId, "quantity", e.target.value)} className="col-span-2 h-7 text-xs" placeholder="Qty" />
                    <Input type="number" value={line.unitPrice} onChange={(e) => updateProductLine(line.tempId, "unitPrice", e.target.value)} className="col-span-2 h-7 text-xs" placeholder="Price" />
                    <span className="col-span-2 text-xs font-medium text-right">₹{line.totalPrice}</span>
                    <Button variant="ghost" size="icon" onClick={() => removeProductLine(line.tempId)} className="col-span-1 h-6 w-6">
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                ))}
                {productLines.length === 0 && <p className="text-xs text-muted-foreground text-center py-3">No products</p>}
              </CardContent>
            </Card>
          </div>

          {/* Payment Type - Compact */}
          <Card className="shadow-sm">
            <CardHeader className="p-2 pb-1">
              <CardTitle className="text-sm font-medium">Payment</CardTitle>
            </CardHeader>
            <CardContent className="p-2 pt-0">
              {/* Payment Icons - Smaller */}
              <div className="grid grid-cols-6 gap-1.5 mb-2">
                {paymentOptions.map((opt) => {
                  const isSelected = payments.some(p => p.mode === opt.mode);
                  return (
                    <div
                      key={opt.mode}
                      onClick={() => {
                        if (isSelected) setPayments(payments.filter(p => p.mode !== opt.mode));
                        else setPayments([...payments, { mode: opt.mode, amount: 0 }]);
                      }}
                      className={`p-1.5 rounded border cursor-pointer transition-all text-center ${
                        isSelected ? 'border-primary bg-primary/10' : 'border-muted hover:border-primary/50'
                      }`}
                    >
                      <div className="text-sm">{opt.icon}</div>
                      <div className="text-[10px] font-medium truncate">{opt.mode}</div>
                    </div>
                  );
                })}
              </div>

              {/* Payment Amounts - Inline Compact */}
              {payments.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5">
                  {payments.map((payment, idx) => (
                    <div key={idx} className="flex items-center gap-1 bg-muted/30 rounded px-2 py-1">
                      <span className="text-xs font-medium w-12 truncate">{payment.mode}</span>
                      <span className="text-xs text-muted-foreground">₹</span>
                      <Input
                        type="number"
                        value={payment.amount}
                        onChange={(e) => updatePayment(idx, "amount", e.target.value)}
                        className="h-6 text-xs flex-1"
                        placeholder="0"
                      />
                    </div>
                  ))}
                </div>
              )}
              {payments.length === 0 && <p className="text-xs text-muted-foreground text-center py-2">Select payment method</p>}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sticky Invoice Summary */}
        <div className="w-64 flex-shrink-0">
          <Card className="shadow-sm sticky top-0 h-fit">
            <CardHeader className="p-2 pb-1">
              <CardTitle className="text-sm font-medium">Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-2 pt-0 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Services:</span>
                <span>₹{serviceLines.reduce((sum, l) => sum + Number(l.finalPrice), 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Products:</span>
                <span>₹{productLines.reduce((sum, l) => sum + Number(l.totalPrice), 0).toFixed(2)}</span>
              </div>
              <div className="border-t pt-1 flex justify-between">
                <span className="text-muted-foreground">Subtotal:</span>
                <span>₹{calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">CGST (2.5%):</span>
                <span>₹{calculateCGST().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">SGST (2.5%):</span>
                <span>₹{calculateSGST().toFixed(2)}</span>
              </div>
              <div className="border-t pt-1 flex justify-between text-sm font-bold">
                <span>Total:</span>
                <span className="text-primary">₹{totalAmount.toFixed(2)}</span>
              </div>

              {/* Payment Breakdown */}
              <div className="border-t pt-1.5 space-y-0.5">
                <span className="text-muted-foreground text-[10px] uppercase">Payments</span>
                {payments.map((p, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-muted-foreground">{p.mode}:</span>
                    <span>₹{Number(p.amount || 0).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-medium text-green-600">
                  <span>Received:</span>
                  <span>₹{payments.reduce((sum, p) => sum + Number(p.amount || 0), 0).toFixed(2)}</span>
                </div>
                {(() => {
                  const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
                  const balance = totalPaid - totalAmount;
                  if (Math.abs(balance) > 0.01) {
                    return (
                      <div className={`flex justify-between font-medium ${balance < 0 ? 'text-red-600' : 'text-blue-600'}`}>
                        <span>{balance < 0 ? 'Due:' : 'Change:'}</span>
                        <span>₹{Math.abs(balance).toFixed(2)}</span>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>

              <Button
                onClick={handleGenerateInvoice}
                disabled={loading}
                className="w-full mt-2 h-8 text-sm"
              >
                <Receipt className="h-3 w-3 mr-1" />
                {loading ? "..." : "Generate"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Billing;
