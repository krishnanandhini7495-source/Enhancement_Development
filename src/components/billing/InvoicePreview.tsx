import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Printer } from "lucide-react";

interface InvoiceData {
  invoice_number: string;
  client_name: string;
  client_phone: string;
  invoice_date: string;
  total_amount: number;
  services: Array<{
    service_name: string;
    base_price: number;
    discount_percent: number;
    final_price: number;
    staff_name: string | null;
  }>;
  products: Array<{
    product_name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
  }>;
  payments: Array<{
    payment_mode: string;
    amount: number;
  }>;
  salon_name: string;
  branch_address: string;
}

interface InvoicePreviewProps {
  invoiceId: string;
  onClose: () => void;
}

export const InvoicePreview = ({ invoiceId, onClose }: InvoicePreviewProps) => {
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoiceData();
  }, [invoiceId]);

  const fetchInvoiceData = async () => {
    try {
      // Fetch invoice
      const { data: invoiceData, error: invoiceError } = await supabase
        .from("invoices")
        .select("*")
        .eq("id", invoiceId)
        .single();

      if (invoiceError) throw invoiceError;

      // Fetch services with staff names
      const { data: servicesData } = await supabase
        .from("invoice_services")
        .select(`
          *,
          services (name),
          staff (name)
        `)
        .eq("invoice_id", invoiceId);

      // Fetch products with names
      const { data: productsData } = await supabase
        .from("invoice_products")
        .select(`
          *,
          products (name)
        `)
        .eq("invoice_id", invoiceId);

      // Fetch payments
      const { data: paymentsData } = await supabase
        .from("payments")
        .select("*")
        .eq("invoice_id", invoiceId);

      // Fetch salon settings
      const { data: salonData } = await supabase
        .from("salon_settings")
        .select("*")
        .limit(1)
        .single();

      setInvoice({
        invoice_number: invoiceData.invoice_number,
        client_name: invoiceData.client_name,
        client_phone: invoiceData.client_phone,
        invoice_date: invoiceData.invoice_date,
        total_amount: invoiceData.total_amount,
        services: servicesData?.map((s: any) => ({
          service_name: s.services.name,
          base_price: s.base_price,
          discount_percent: s.discount_percent,
          final_price: s.final_price,
          staff_name: s.staff?.name || null,
        })) || [],
        products: productsData?.map((p: any) => ({
          product_name: p.products.name,
          quantity: p.quantity,
          unit_price: p.unit_price,
          total_price: p.total_price,
        })) || [],
        payments: paymentsData || [],
        salon_name: salonData?.salon_name || "Elegant Salon",
        branch_address: salonData?.branch_address || "123 Beauty Street",
      });
    } catch (error) {
      console.error("Error fetching invoice:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading || !invoice) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between print:hidden">
        <h1 className="text-2xl font-display">Invoice Preview</h1>
        <div className="flex gap-2">
          <Button onClick={handlePrint} variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button onClick={onClose} variant="ghost" size="icon">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="p-8 max-w-4xl mx-auto shadow-elevated">
        {/* Header */}
        <div className="text-center border-b-2 border-primary pb-4 mb-6">
          <h1 className="text-3xl font-display text-primary mb-1">{invoice.salon_name}</h1>
          <p className="text-sm text-muted-foreground">{invoice.branch_address}</p>
        </div>

        {/* Invoice Info */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-muted-foreground">Invoice Number</p>
            <p className="font-semibold">{invoice.invoice_number}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Date</p>
            <p className="font-semibold">{new Date(invoice.invoice_date).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Client Name</p>
            <p className="font-semibold">{invoice.client_name}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Phone</p>
            <p className="font-semibold">{invoice.client_phone}</p>
          </div>
        </div>

        {/* Services */}
        {invoice.services.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-primary">Services</h3>
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-2">Service</th>
                  <th className="text-right p-2">Base Price</th>
                  <th className="text-right p-2">Discount %</th>
                  <th className="text-right p-2">Final Price</th>
                  <th className="text-left p-2">Staff</th>
                </tr>
              </thead>
              <tbody>
                {invoice.services.map((service, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{service.service_name}</td>
                    <td className="text-right p-2">₹{Number(service.base_price).toFixed(2)}</td>
                    <td className="text-right p-2">{service.discount_percent}%</td>
                    <td className="text-right p-2">₹{Number(service.final_price).toFixed(2)}</td>
                    <td className="p-2">{service.staff_name || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Products */}
        {invoice.products.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-primary">Products</h3>
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-2">Product</th>
                  <th className="text-right p-2">Quantity</th>
                  <th className="text-right p-2">Unit Price</th>
                  <th className="text-right p-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.products.map((product, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{product.product_name}</td>
                    <td className="text-right p-2">{product.quantity}</td>
                    <td className="text-right p-2">₹{Number(product.unit_price).toFixed(2)}</td>
                    <td className="text-right p-2">₹{Number(product.total_price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Payments */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-primary">Payment Details</h3>
          <div className="space-y-2">
            {invoice.payments.map((payment, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{payment.payment_mode}:</span>
                <span className="font-medium">₹{Number(payment.amount).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="border-t-2 border-primary pt-4 mt-6">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold">Grand Total</span>
            <span className="text-2xl font-bold text-primary">
              ₹{Number(invoice.total_amount).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 pt-4 border-t text-sm text-muted-foreground">
          <p>Thank you for your business!</p>
        </div>
      </Card>
    </div>
  );
};
