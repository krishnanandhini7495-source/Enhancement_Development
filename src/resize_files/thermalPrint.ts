// Thermal bill printing utility

export interface ThermalBillData {
  salonName: string;
  salonAddress: string;
  salonPhone: string;
  salonEmail: string;
  invoiceNumber: string;
  customerName: string;
  customerPhone: string;
  services: Array<{
    name: string;
    quantity: number;
    originalPrice: number;
    discountedPrice: number;
    subtotal: number;
  }>;
  subtotal: number;
  cgst: number;
  sgst: number;
  totalDiscount: number;
  totalAmount: number;
  payments: Array<{ mode: string; amount: number }>;
  amountReceived: number;
  balanceAmount: number;
}

export const generateAndPrintThermalBill = (data: ThermalBillData): void => {
  const printWindow = window.open("", "_blank", "width=300,height=600");
  if (!printWindow) {
    console.error("Failed to open print window");
    return;
  }

  const currentDate = new Date().toLocaleDateString("en-IN");
  const currentTime = new Date().toLocaleTimeString("en-IN");

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice - ${data.invoiceNumber}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Courier New', monospace;
          font-size: 12px;
          width: 80mm;
          padding: 5mm;
        }
        .center { text-align: center; }
        .right { text-align: right; }
        .bold { font-weight: bold; }
        .line { border-top: 1px dashed #000; margin: 5px 0; }
        .double-line { border-top: 2px solid #000; margin: 5px 0; }
        .row { display: flex; justify-content: space-between; }
        .salon-name { font-size: 16px; font-weight: bold; }
        .item-row { display: flex; justify-content: space-between; margin: 2px 0; }
        .total-row { font-size: 14px; font-weight: bold; }
        @media print {
          body { width: 80mm; }
        }
      </style>
    </head>
    <body>
      <div class="center">
        <div class="salon-name">${data.salonName}</div>
        <div>${data.salonAddress}</div>
        ${data.salonPhone ? `<div>Tel: ${data.salonPhone}</div>` : ""}
      </div>
      
      <div class="double-line"></div>
      
      <div class="row">
        <span>Invoice: ${data.invoiceNumber}</span>
      </div>
      <div class="row">
        <span>Date: ${currentDate}</span>
        <span>Time: ${currentTime}</span>
      </div>
      <div>Customer: ${data.customerName}</div>
      ${data.customerPhone ? `<div>Phone: ${data.customerPhone}</div>` : ""}
      
      <div class="line"></div>
      
      ${data.services.map(item => `
        <div class="item-row">
          <span>${item.name} x${item.quantity}</span>
          <span>₹${item.subtotal.toFixed(2)}</span>
        </div>
      `).join("")}
      
      <div class="line"></div>
      
      <div class="item-row">
        <span>Subtotal:</span>
        <span>₹${data.subtotal.toFixed(2)}</span>
      </div>
      <div class="item-row">
        <span>CGST (2.5%):</span>
        <span>₹${data.cgst.toFixed(2)}</span>
      </div>
      <div class="item-row">
        <span>SGST (2.5%):</span>
        <span>₹${data.sgst.toFixed(2)}</span>
      </div>
      ${data.totalDiscount > 0 ? `
        <div class="item-row">
          <span>Discount:</span>
          <span>-₹${data.totalDiscount.toFixed(2)}</span>
        </div>
      ` : ""}
      
      <div class="double-line"></div>
      
      <div class="item-row total-row">
        <span>TOTAL:</span>
        <span>₹${data.totalAmount.toFixed(2)}</span>
      </div>
      
      <div class="line"></div>
      
      <div class="bold">Payment:</div>
      ${data.payments.map(p => `
        <div class="item-row">
          <span>${p.mode}:</span>
          <span>₹${p.amount.toFixed(2)}</span>
        </div>
      `).join("")}
      
      <div class="double-line"></div>
      
      <div class="center" style="margin-top: 10px;">
        <div>Thank you for your visit!</div>
        <div>Please come again</div>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
  
  printWindow.onload = () => {
    printWindow.print();
    printWindow.close();
  };
};
