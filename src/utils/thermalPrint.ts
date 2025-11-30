// Utility function to format date to IST
const formatToIST = (date: Date): string => {
  return date.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).replace(',', ' |') + ' (IST)';
};

// Utility function to generate thermal bill HTML and print
export const generateAndPrintThermalBill = (invoiceData: {
  salonName: string;
  salonAddress: string;
  salonPhone: string;
  salonEmail?: string;
  invoiceNumber: string;
  billingDate?: string;
  customerName: string;
  customerPhone?: string;
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
  payments: Array<{
    mode: string;
    amount: number;
  }>;
  amountReceived: number;
  balanceAmount: number;
}) => {
  try {
    // Validate required fields
    if (!invoiceData) {
      console.error('Invoice data is null or undefined');
      throw new Error('Invoice data is required');
    }
    
    if (!invoiceData.salonName || !invoiceData.customerName) {
      console.error('Missing required invoice data', invoiceData);
      throw new Error('Missing salon name or customer name');
    }

    if (!invoiceData.payments || invoiceData.payments.length === 0) {
      console.error('Missing payment information', invoiceData);
      throw new Error('Payment information is required');
    }

    if (!invoiceData.services || invoiceData.services.length === 0) {
      console.error('No services/products in invoice', invoiceData);
      throw new Error('Invoice must have at least one service or product');
    }

    const servicesHTML = invoiceData.services
    .map(
      (service) => `
    <tr style="border-bottom: 1px dashed #ccc;">
      <td style="text-align: left; padding: 4px 2px; font-size: 10px;">${service.name}</td>
      <td style="text-align: center; padding: 4px 2px; font-size: 10px;">${service.quantity}</td>
      <td style="text-align: right; padding: 4px 2px; font-size: 10px;">
        ${
          service.originalPrice !== service.discountedPrice
            ? `<span style="text-decoration: line-through; color: #888; font-size: 9px;">₹${service.originalPrice.toFixed(2)}</span><br/>₹${service.discountedPrice.toFixed(2)}`
            : `₹${service.discountedPrice.toFixed(2)}`
        }
      </td>
      <td style="text-align: right; padding: 4px 2px; font-size: 10px;">₹${service.subtotal.toFixed(2)}</td>
    </tr>
  `
    )
    .join('');

  // Format current date-time to IST if not provided
  const istDateTime = invoiceData.billingDate || formatToIST(new Date());
  
  // Format payment breakdown with safety check
  const paymentBreakdownHTML = (invoiceData.payments || [])
    .filter(p => p && p.mode && typeof p.amount === 'number')
    .map(p => `<div class="row"><span>${p.mode}:</span><span>₹${p.amount.toFixed(2)}</span></div>`)
    .join('');

  // Ensure all numeric values are valid
  const totalAmount = typeof invoiceData.totalAmount === 'number' ? invoiceData.totalAmount : 0;
  const totalDiscount = typeof invoiceData.totalDiscount === 'number' ? invoiceData.totalDiscount : 0;
  const amountReceived = typeof invoiceData.amountReceived === 'number' ? invoiceData.amountReceived : 0;
  const balanceAmount = typeof invoiceData.balanceAmount === 'number' ? invoiceData.balanceAmount : 0;

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice - ${invoiceData.invoiceNumber}</title>
  <style>
    @media print {
      @page {
        size: 80mm auto;
        margin: 0;
      }
      body {
        margin: 0;
        padding: 0;
      }
    }
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      width: 80mm;
      max-width: 80mm;
      margin: 0 auto;
      padding: 5mm;
      font-family: Arial, sans-serif;
      font-size: 11px;
      line-height: 1.4;
      color: #000;
      background-color: #fff;
    }
    .header {
      text-align: center;
      margin-bottom: 8px;
    }
    .salon-name {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 4px;
      text-transform: uppercase;
    }
    .text {
      font-size: 10px;
      margin-bottom: 2px;
    }
    .dashed-border {
      border-top: 1px dashed #000;
      margin: 8px 0;
    }
    .row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 3px;
    }
    .bold {
      font-weight: bold;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 8px;
    }
    th {
      border-bottom: 1px solid #000;
      padding: 4px 2px;
      font-size: 10px;
      font-weight: bold;
    }
    .total-row {
      font-size: 13px;
      margin-top: 5px;
      padding-top: 5px;
      border-top: 1px solid #000;
    }
    .discount-text {
      color: #d00;
    }
    .footer {
      text-align: center;
      margin-top: 10px;
    }
    .thank-you {
      font-size: 11px;
      font-weight: bold;
      margin-bottom: 3px;
    }
  </style>
</head>
<body>
  <!-- Header Section -->
  <div class="header">
    <div class="salon-name">${invoiceData.salonName}</div>
    <div class="text">${invoiceData.salonAddress}</div>
    <div class="text">Ph: ${invoiceData.salonPhone}</div>
  </div>

  <div class="dashed-border"></div>

  <!-- Invoice Details -->
  <div style="margin-bottom: 8px;">
    <div class="row">
      <span>Invoice No:</span>
      <span class="bold">${invoiceData.invoiceNumber}</span>
    </div>
    <div class="row">
      <span>Date:</span>
      <span>${istDateTime}</span>
    </div>
    <div class="row">
      <span>Customer Name:</span>
      <span class="bold">${invoiceData.customerName}</span>
    </div>
    ${invoiceData.customerPhone ? `<div class="row"><span>Phone:</span><span>${invoiceData.customerPhone}</span></div>` : ''}
  </div>

  <div class="dashed-border"></div>

  <!-- Services Table -->
  <table>
    <thead>
      <tr>
        <th style="text-align: left;">Service</th>
        <th style="text-align: center; width: 30px;">Qty</th>
        <th style="text-align: right; width: 60px;">Price</th>
        <th style="text-align: right; width: 60px;">Total</th>
      </tr>
    </thead>
    <tbody>
      ${servicesHTML}
    </tbody>
  </table>

  <div class="dashed-border"></div>

  <!-- Totals Section -->
  <div style="margin-bottom: 8px;">
    <div class="row">
      <span>Subtotal:</span>
      <span>₹${(typeof invoiceData.subtotal === 'number' ? invoiceData.subtotal : 0).toFixed(2)}</span>
    </div>
    ${
      totalDiscount > 0
        ? `<div class="row"><span>Discount:</span><span class="discount-text">-₹${totalDiscount.toFixed(2)}</span></div>`
        : ''
    }
    <div class="row">
      <span>CGST (2.5%):</span>
      <span>₹${(typeof invoiceData.cgst === 'number' ? invoiceData.cgst : 0).toFixed(2)}</span>
    </div>
    <div class="row">
      <span>SGST (2.5%):</span>
      <span>₹${(typeof invoiceData.sgst === 'number' ? invoiceData.sgst : 0).toFixed(2)}</span>
    </div>
    <div class="row total-row">
      <span class="bold">GRAND TOTAL:</span>
      <span class="bold">₹${totalAmount.toFixed(2)}</span>
    </div>
  </div>

  <div class="dashed-border"></div>

  <!-- Payment Details -->
  <div style="margin-bottom: 8px;">
    <div class="row">
      <span>Payment Type:</span>
      <span class="bold">${invoiceData.payments.map(p => p.mode).join(' + ')}</span>
    </div>
    ${paymentBreakdownHTML}
    <div class="row">
      <span>Total Received:</span>
      <span class="bold">₹${amountReceived.toFixed(2)}</span>
    </div>
    ${
      balanceAmount !== 0
        ? `<div class="row"><span>${balanceAmount > 0 ? 'Balance Due:' : 'Change:'}</span><span class="bold">₹${Math.abs(balanceAmount).toFixed(2)}</span></div>`
        : ''
    }
  </div>

  <div class="dashed-border"></div>

  <!-- Footer Section -->
  <div class="footer">
    <div class="thank-you">Thank you for visiting!</div>
    <div class="thank-you">Please visit again!</div>
    ${invoiceData.salonEmail ? `<div class="text">${invoiceData.salonEmail}</div>` : ''}
  </div>
</body>
</html>
  `;

  // Open print window
  const printWindow = window.open('', '_blank', 'width=800,height=600');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load, then print
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      // Optionally close after printing
      // printWindow.close();
    };
  } else {
    alert('Please allow pop-ups to print the invoice');
  }
  } catch (error) {
    console.error('Error generating thermal bill:', error);
    throw error;
  }
};
