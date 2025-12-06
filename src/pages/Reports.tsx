import { useState, useEffect } from "react";
import { invoicesAPI } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileText, Search, Eye, Calendar, Download } from "lucide-react";
import { toast } from "sonner";

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientPhone: string;
  subtotal: number;
  totalAmount: number;
  invoiceDate: string;
  createdAt: string;
  createdBy: string;
  services: Array<{
    serviceName: string;
    staffName?: string;
    basePrice: number;
    discountPercent: number;
    finalPrice: number;
  }>;
  products: Array<{
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  payments: Array<{
    paymentMode: string;
    amount: number;
  }>;
}

const Reports = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchInvoices();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, startDate, endDate, invoices]);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const data = await invoicesAPI.getAll();
      setInvoices(data);
      setFilteredInvoices(data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      toast.error("Failed to load billing reports");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...invoices];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (invoice) =>
          invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.clientPhone.includes(searchTerm)
      );
    }

    // Date range filter
    if (startDate) {
      filtered = filtered.filter(
        (invoice) => new Date(invoice.invoiceDate) >= new Date(startDate)
      );
    }
    if (endDate) {
      filtered = filtered.filter(
        (invoice) => new Date(invoice.invoiceDate) <= new Date(endDate)
      );
    }

    setFilteredInvoices(filtered);
  };

  const viewInvoiceDetails = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowDetails(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toFixed(2)}`;
  };

  const getTotalRevenue = () => {
    return filteredInvoices.reduce((sum, invoice) => sum + invoice.totalAmount, 0);
  };

  const getTotalGST = () => {
    return filteredInvoices.reduce((sum, invoice) => {
      const gst = invoice.subtotal * 0.05; // CGST 2.5% + SGST 2.5% = 5%
      return sum + gst;
    }, 0);
  };

  const getTotalReceived = () => {
    return filteredInvoices.reduce((sum, invoice) => {
      const received = invoice.payments.reduce((pSum, p) => pSum + p.amount, 0);
      return sum + received;
    }, 0);
  };

  const getTotalPending = () => {
    return filteredInvoices.reduce((sum, invoice) => {
      const received = invoice.payments.reduce((pSum, p) => pSum + p.amount, 0);
      const balance = received - invoice.totalAmount;
      return sum + (balance < 0 ? Math.abs(balance) : 0);
    }, 0);
  };

  const exportToCSV = async () => {
    try {
      // Get the blob from API
      const blob = await invoicesAPI.exportToCsv(startDate, endDate, searchTerm);
      
      // Create a download link and trigger it
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Invoices_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('CSV exported successfully');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      toast.error('Failed to export CSV');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display mb-2">Billing Reports</h1>
          <p className="text-muted-foreground">View and analyze all billing transactions</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-5">
        <Card className="shadow-soft">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Invoices</p>
              <p className="text-2xl font-bold">{filteredInvoices.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold text-primary">{formatCurrency(getTotalRevenue())}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total GST</p>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(getTotalGST())}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Amount Received</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(getTotalReceived())}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Pending Balance</p>
              <p className="text-2xl font-bold text-orange-600">{formatCurrency(getTotalPending())}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-soft">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Filters</CardTitle>
            <Button onClick={exportToCSV} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export to CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Invoice #, Customer Name, Phone"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>All Invoices ({filteredInvoices.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : filteredInvoices.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No invoices found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                    <TableHead className="text-right">CGST (2.5%)</TableHead>
                    <TableHead className="text-right">SGST (2.5%)</TableHead>
                    <TableHead className="text-right">Total Amount</TableHead>
                    <TableHead className="text-right">Received</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => {
                    const amountReceived = invoice.payments.reduce((sum, p) => sum + p.amount, 0);
                    const balanceAmount = amountReceived - invoice.totalAmount;
                    const cgst = invoice.subtotal * 0.025;
                    const sgst = invoice.subtotal * 0.025;
                    
                    return (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                        <TableCell>{formatDate(invoice.invoiceDate)}</TableCell>
                        <TableCell>{invoice.clientName}</TableCell>
                        <TableCell>{invoice.clientPhone}</TableCell>
                        <TableCell className="text-right">{formatCurrency(invoice.subtotal)}</TableCell>
                        <TableCell className="text-right text-blue-600">{formatCurrency(cgst)}</TableCell>
                        <TableCell className="text-right text-blue-600">{formatCurrency(sgst)}</TableCell>
                        <TableCell className="text-right font-semibold">{formatCurrency(invoice.totalAmount)}</TableCell>
                        <TableCell className="text-right text-green-600">
                          {formatCurrency(amountReceived)}
                        </TableCell>
                        <TableCell className="text-right text-orange-600">
                          {formatCurrency(balanceAmount < 0 ? Math.abs(balanceAmount) : 0)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => viewInvoiceDetails(invoice)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invoice Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Invoice Details - {selectedInvoice?.invoiceNumber}</DialogTitle>
          </DialogHeader>
          {selectedInvoice && (() => {
            const amountReceived = selectedInvoice.payments.reduce((sum, p) => sum + p.amount, 0);
            const balanceAmount = amountReceived - selectedInvoice.totalAmount;
            
            return (
            <div className="space-y-6">
              {/* Customer Information */}
              <div>
                <h3 className="font-semibold mb-3">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Name:</span>
                    <p className="font-medium">{selectedInvoice.clientName}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Phone:</span>
                    <p className="font-medium">{selectedInvoice.clientPhone}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Invoice Date:</span>
                    <p className="font-medium">{formatDate(selectedInvoice.invoiceDate)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Created At:</span>
                    <p className="font-medium">{formatDate(selectedInvoice.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Services */}
              {selectedInvoice.services && selectedInvoice.services.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Services</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Service</TableHead>
                        <TableHead>Staff</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedInvoice.services.map((service, index) => (
                        <TableRow key={index}>
                          <TableCell>{service.serviceName}</TableCell>
                          <TableCell>{service.staffName || 'N/A'}</TableCell>
                          <TableCell className="text-right">{formatCurrency(service.finalPrice)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Products */}
              {selectedInvoice.products && selectedInvoice.products.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Products</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-center">Quantity</TableHead>
                        <TableHead className="text-right">Unit Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedInvoice.products.map((product, index) => (
                        <TableRow key={index}>
                          <TableCell>{product.productName}</TableCell>
                          <TableCell className="text-center">{product.quantity}</TableCell>
                          <TableCell className="text-right">{formatCurrency(product.unitPrice)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(product.totalPrice)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Payment Information */}
              <div>
                <h3 className="font-semibold mb-3">Payment Information</h3>
                <div className="space-y-2">
                  {selectedInvoice.payments && selectedInvoice.payments.length > 0 && (
                    <div className="space-y-1">
                      {selectedInvoice.payments.map((payment, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{payment.paymentMode}:</span>
                          <span className="font-medium">{formatCurrency(payment.amount)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span>{formatCurrency(selectedInvoice.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-blue-600">
                      <span>CGST (2.5%):</span>
                      <span>{formatCurrency(selectedInvoice.subtotal * 0.025)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-blue-600">
                      <span>SGST (2.5%):</span>
                      <span>{formatCurrency(selectedInvoice.subtotal * 0.025)}</span>
                    </div>
                    <div className="flex justify-between font-semibold border-t pt-2 mt-2">
                      <span>Total Amount:</span>
                      <span>{formatCurrency(selectedInvoice.totalAmount)}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Amount Received:</span>
                      <span>{formatCurrency(amountReceived)}</span>
                    </div>
                    {balanceAmount !== 0 && (
                      <div className={`flex justify-between ${balanceAmount < 0 ? 'text-orange-600' : 'text-blue-600'}`}>
                        <span>{balanceAmount < 0 ? "Balance Due:" : "Change:"}</span>
                        <span>{formatCurrency(Math.abs(balanceAmount))}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reports;
