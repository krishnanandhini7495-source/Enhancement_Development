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
// import { useAuth } from "@/contexts/AuthContext";
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
  // const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [salonSettings, setSalonSettings] = useState<SalonSettings | null>(null);

  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [customerSuggestions, setCustomerSuggestions] = useState<CustomerSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedBranch, setSelectedBranch] = useState<string>("");  const [serviceLines, setServiceLines] = useState<ServiceLine[]>([]);
  const [productLines, setProductLines] = useState<ProductLine[]>([]);
  const [payments, setPayments] = useState<PaymentMode[]>([{ mode: "Cash", amount: 0 }]);
  
  const [showInvoice, setShowInvoice] = useState(false);
  const [generatedInvoiceId, setGeneratedInvoiceId] = useState<string | null>(null);
  const [generatedInvoiceData, setGeneratedInvoiceData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMasterData();
    
    // Reload settings when window regains focus (user returns from Settings page)
    const handleFocus = () => {
      fetchSalonSettings();
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
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
      
      // Load salon settings separately with error handling
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
      
      // Set default branch to main address if not already set
      if (settingsData && !selectedBranch) {
        setSelectedBranch(settingsData.mainAddress);
      }
    } catch (settingsError) {
      console.error("Error fetching salon settings:", settingsError);
      // Continue without settings - branch selector will be optional
    }
  };

  // Customer search function
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
      {
        tempId: Date.now().toString(),
        serviceId: "",
        serviceName: "",
        basePrice: 0,
        discountPercent: 0,
        finalPrice: 0,
        staffId: "",
      },
    ]);
  };

  const addProductLine = () => {
    setProductLines([
      ...productLines,
      {
        tempId: Date.now().toString(),
        productId: "",
        productName: "",
        quantity: 1,
        unitPrice: 0,
        totalPrice: 0,
      },
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

  const removeServiceLine = (tempId: string) => {
    setServiceLines(serviceLines.filter((line) => line.tempId !== tempId));
  };

  const removeProductLine = (tempId: string) => {
    setProductLines(productLines.filter((line) => line.tempId !== tempId));
  };

  // const addPaymentMode = () => {
  //   setPayments([...payments, { mode: "Cash", amount: 0 }]);
  // };

  const updatePayment = (index: number, field: string, value: any) => {
    setPayments(
      payments.map((payment, i) =>
        i === index ? { ...payment, [field]: value } : payment
      )
    );
  };

  // const removePayment = (index: number) => {
  //   setPayments(payments.filter((_, i) => i !== index));
  // };

  const calculateSubtotal = () => {
    const servicesTotal = serviceLines.reduce((sum, line) => sum + Number(line.finalPrice), 0);
    const productsTotal = productLines.reduce((sum, line) => sum + Number(line.totalPrice), 0);
    return servicesTotal + productsTotal;
  };

  const calculateCGST = () => {
    return calculateSubtotal() * 0.025; // 2.5%
  };

  const calculateSGST = () => {
    return calculateSubtotal() * 0.025; // 2.5%
  };

  const calculateGrandTotal = () => {
    return calculateSubtotal() + calculateCGST() + calculateSGST();
  };

  const calculateTotal = () => {
    return calculateGrandTotal();
  };

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
      // Create invoice using backend API
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
      
      // Generate thermal bill data with salon settings
      const thermalBillData = {
        salonName: salonSettings?.salonName || "Cheap&Best Salon",
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
      
      // Auto-print thermal bill
      setTimeout(() => {
        generateAndPrintThermalBill(thermalBillData);
      }, 500);
      
      // Store invoice data for reprint
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
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl text-green-600">
              Invoice Generated Successfully!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Receipt className="h-16 w-16 text-green-600" />
              </div>
              <p className="text-lg font-semibold">Invoice Number: {generatedInvoiceId}</p>
              {generatedInvoiceData && (
                <>
                  <p className="text-muted-foreground">
                    Customer Name: {generatedInvoiceData.customerName}
                  </p>
                  {generatedInvoiceData.customerPhone && (
                    <p className="text-muted-foreground">
                      Phone: {generatedInvoiceData.customerPhone}
                    </p>
                  )}
                  <p className="text-muted-foreground">
                    Total Amount: ₹{generatedInvoiceData.totalAmount.toFixed(2)}
                  </p>
                  {generatedInvoiceData.totalDiscount > 0 && (
                    <p className="text-muted-foreground">
                      Discount Applied: ₹{generatedInvoiceData.totalDiscount.toFixed(2)}
                    </p>
                  )}
                  <p className="text-muted-foreground">
                    Payment Type: {generatedInvoiceData.payments.map((p: any) => p.mode).join(' + ')}
                  </p>
                </>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => {
                  if (generatedInvoiceData) {
                    try {
                      generateAndPrintThermalBill(generatedInvoiceData);
                      toast.success("Printing thermal bill...");
                    } catch (error) {
                      console.error("Print error:", error);
                      toast.error("Failed to print bill. Please try again.");
                    }
                  }
                }}
                className="gap-2"
                disabled={!generatedInvoiceData}
              >
                <Printer className="h-4 w-4" />
                Print Again
              </Button>
              <Button
                onClick={resetForm}
                variant="outline"
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                New Invoice
              </Button>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-center text-muted-foreground">
                The thermal bill has been automatically printed. Use "Print Again" if you need another copy.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalAmount = calculateTotal();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display mb-2">New Invoice</h1>
          <p className="text-muted-foreground">Create a new billing invoice</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card className="shadow-soft overflow-visible">
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-4 gap-4 overflow-visible">
            <div className="space-y-2 relative md:col-span-1">
              <Label htmlFor="clientName">Customer Name *</Label>
              <Input
                id="clientName"
                value={clientName}
                onChange={(e) => {
                  setClientName(e.target.value);
                  searchCustomers(e.target.value);
                }}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onFocus={() => clientName.length >= 3 && setShowSuggestions(true)}
                placeholder="Enter customer name"
              />
              {showSuggestions && customerSuggestions.length > 0 && (
                <div className="absolute z-[9999] w-full mt-1 bg-white border border-gray-300 rounded-md shadow-xl max-h-60 overflow-y-auto">
                  {customerSuggestions.map((customer, index) => (
                    <div
                      key={index}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        selectCustomer(customer);
                      }}
                      className="px-3 py-2 hover:bg-blue-50 cursor-pointer border-b last:border-b-0"
                    >
                      <div className="font-medium text-gray-900">{customer.customerName}</div>
                      <div className="text-sm text-gray-600">
                        {customer.phone} • {customer.totalVisits} visits
                      </div>
                      <div className="text-xs text-gray-500">
                        Last visit: {new Date(customer.lastVisitDate).toLocaleDateString('en-IN')} • 
                        ₹{customer.lastInvoiceTotal.toFixed(2)} • {customer.lastPaymentMode}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-2 md:col-span-1">
              <Label htmlFor="clientPhone">Phone Number *</Label>
              <Input
                id="clientPhone"
                value={clientPhone}
                onChange={(e) => {
                  setClientPhone(e.target.value);
                  searchCustomers(e.target.value);
                }}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onFocus={() => clientPhone.length >= 3 && setShowSuggestions(true)}
                placeholder="+91 9876543210"
              />
            </div>
            <div className="space-y-2 md:col-span-1">
              <Label htmlFor="invoiceDate">Invoice Date</Label>
              <Input
                id="invoiceDate"
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
              />
            </div>
            {salonSettings && salonSettings.mainAddress && (
              <div className="space-y-2 md:col-span-1">
                <Label htmlFor="branch">Branch Location</Label>
                <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                  <SelectTrigger id="branch">
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={salonSettings.mainAddress}>
                      Main Branch
                    </SelectItem>
                    {salonSettings.branchAddresses && salonSettings.branchAddresses.length > 0 && salonSettings.branchAddresses.map((branch, index) => (
                      <SelectItem key={index} value={branch.address}>
                        {branch.branchName || `Branch ${index + 1}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Services</CardTitle>
            <Button onClick={addServiceLine} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {serviceLines.map((line) => (
              <div key={line.tempId} className="grid grid-cols-12 gap-2 items-end p-3 bg-muted/50 rounded-lg">
                <div className="col-span-3 space-y-2">
                  <Label>Service</Label>
                  <Select
                    value={line.serviceId}
                    onValueChange={(value) => updateServiceLine(line.tempId, "serviceId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Base Price</Label>
                  <Input
                    type="number"
                    value={line.basePrice}
                    onChange={(e) => updateServiceLine(line.tempId, "basePrice", e.target.value)}
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Discount %</Label>
                  <Input
                    type="number"
                    value={line.discountPercent}
                    onChange={(e) => updateServiceLine(line.tempId, "discountPercent", e.target.value)}
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Final Price</Label>
                  <Input
                    type="number"
                    value={line.finalPrice}
                    onChange={(e) => updateServiceLine(line.tempId, "finalPrice", e.target.value)}
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Staff</Label>
                  <Select
                    value={line.staffId}
                    onValueChange={(value) => updateServiceLine(line.tempId, "staffId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {staff.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeServiceLine(line.tempId)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
            {serviceLines.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                No services added yet
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Products</CardTitle>
            <Button onClick={addProductLine} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </CardHeader>
        <CardContent className="space-y-4">
          {productLines.map((line) => (
            <div key={line.tempId} className="grid grid-cols-12 gap-2 items-end p-3 bg-muted/50 rounded-lg">
              <div className="col-span-4 space-y-2">
                <Label>Product</Label>
                <Select
                  value={line.productId}
                  onValueChange={(value) => updateProductLine(line.tempId, "productId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  min="1"
                  value={line.quantity}
                  onChange={(e) => updateProductLine(line.tempId, "quantity", e.target.value)}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Unit Price</Label>
                <Input
                  type="number"
                  value={line.unitPrice}
                  onChange={(e) => updateProductLine(line.tempId, "unitPrice", e.target.value)}
                />
              </div>
              <div className="col-span-3 space-y-2">
                <Label>Total</Label>
                <Input type="number" value={line.totalPrice} readOnly className="bg-muted" />
              </div>
              <div className="col-span-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeProductLine(line.tempId)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
          {productLines.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              No products added yet
            </p>
          )}
        </CardContent>
      </Card>
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Payment Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2 mb-4">
            {[
              { mode: "Cash", icon: "💵" },
              { mode: "GPay", icon: "📱" },
              { mode: "Debit Card", icon: "💳" },
              { mode: "Credit Card", icon: "💳" },
              { mode: "PhonePe", icon: "📱" },
              { mode: "Paytm", icon: "📱" },
              { mode: "UPI", icon: "🔗" },
              { mode: "Bank Transfer", icon: "🏦" }
            ].map((paymentOption) => {
              const isSelected = payments.some(p => p.mode === paymentOption.mode);
              return (
                <div
                  key={paymentOption.mode}
                  onClick={() => {
                    if (isSelected) {
                      // Deselect - remove this payment mode
                      setPayments(payments.filter(p => p.mode !== paymentOption.mode));
                    } else {
                      // Select - add this payment mode
                      setPayments([...payments, { mode: paymentOption.mode, amount: 0 }]);
                    }
                  }}
                  className={`p-2 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                    isSelected 
                      ? 'border-primary bg-primary/10' 
                      : 'border-muted bg-muted/50 hover:border-primary/50'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-xl mb-0.5">{paymentOption.icon}</div>
                    <div className="text-xs font-medium">{paymentOption.mode}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {payments.length > 0 && (
            <div className="space-y-3 mt-4 pt-4 border-t">
              <div className="font-medium text-sm text-muted-foreground mb-3">Enter Payment Amounts</div>
              {payments.map((payment, index) => (
                <div key={index} className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between gap-3">
                    <Label className="font-medium min-w-[120px]">{payment.mode} Amount</Label>
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-muted-foreground">₹</span>
                      <Input
                        type="number"
                        value={payment.amount}
                        onChange={(e) => updatePayment(index, "amount", e.target.value)}
                        placeholder="0.00"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <div className="p-3 bg-primary/10 rounded-lg border-2 border-primary/20">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Total Received</span>
                  <span className="text-xl font-bold text-primary">
                    ₹{payments.reduce((sum, p) => sum + Number(p.amount || 0), 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {payments.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              Select payment methods above
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Invoice Summary</CardTitle>
        </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Services Total:</span>
                <span className="font-medium">
                  ₹{serviceLines.reduce((sum, line) => sum + Number(line.finalPrice), 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Products Total:</span>
                <span className="font-medium">
                  ₹{productLines.reduce((sum, line) => sum + Number(line.totalPrice), 0).toFixed(2)}
                </span>
              </div>
              <div className="border-t pt-2 flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-medium">₹{calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">CGST (2.5%):</span>
                <span className="font-medium">₹{calculateCGST().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">SGST (2.5%):</span>
                <span className="font-medium">₹{calculateSGST().toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between text-lg font-bold">
                <span>Grand Total:</span>
                <span className="text-primary">₹{totalAmount.toFixed(2)}</span>
              </div>
              
              {/* Payment Breakdown */}
              <div className="border-t pt-2 space-y-1">
                <div className="text-sm font-medium text-muted-foreground mb-2">Payment Breakdown:</div>
                {payments.map((payment, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{payment.mode}:</span>
                    <span className="font-medium">₹{Number(payment.amount || 0).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-semibold border-t pt-1 mt-1">
                  <span>Total Received:</span>
                  <span className="text-green-600">
                    ₹{payments.reduce((sum, p) => sum + Number(p.amount || 0), 0).toFixed(2)}
                  </span>
                </div>
                {(() => {
                  const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
                  const balance = totalPaid - totalAmount;
                  if (balance !== 0) {
                    return (
                      <div className={`flex justify-between text-sm font-semibold ${balance < 0 ? 'text-red-600' : 'text-blue-600'}`}>
                        <span>{balance < 0 ? 'Balance Due:' : 'Change:'}</span>
                        <span>₹{Math.abs(balance).toFixed(2)}</span>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            </div>

            <Button
              onClick={handleGenerateInvoice}
              disabled={loading}
              className="w-full gradient-primary hover:opacity-90 transition-smooth"
            >
              <Receipt className="h-4 w-4 mr-2" />
              {loading ? "Generating..." : "Generate Invoice"}
            </Button>
          </CardContent>
        </Card>
    </div>
  );
};

export default Billing;
