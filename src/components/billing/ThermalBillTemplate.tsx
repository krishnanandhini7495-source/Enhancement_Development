import React from 'react';

interface BillService {
  name: string;
  quantity: number;
  originalPrice: number;
  discountedPrice: number;
  subtotal: number;
}

interface BillProps {
  salonName: string;
  address: string;
  branchAddress: string;
  phone: string;
  invoiceNumber: string;
  billingDate: string;
  customerName: string;
  customerPhone?: string;
  preBookingRef?: string;
  services: BillService[];
  totalDiscount: number;
  totalAmount: number;
  paymentMode: string;
  amountReceived: number;
  balanceAmount: number;
  thankYouNote?: string;
  website?: string;
}

export const ThermalBillTemplate: React.FC<BillProps> = ({
  salonName,
  address,
  branchAddress,
  phone,
  invoiceNumber,
  billingDate,
  customerName,
  customerPhone,
  preBookingRef,
  services,
  totalDiscount,
  totalAmount,
  paymentMode,
  amountReceived,
  balanceAmount,
  thankYouNote,
  website,
}) => {
  return (
    <div style={styles.container}>
      <style>
        {`
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
        `}
      </style>

      {/* Header Section */}
      <div style={styles.header}>
        <div style={styles.salonName}>{salonName}</div>
        <div style={styles.text}>{address}</div>
        <div style={styles.text}>{branchAddress}</div>
        <div style={styles.text}>Ph: {phone}</div>
        {preBookingRef && (
          <div style={styles.text}>Booking Ref: {preBookingRef}</div>
        )}
      </div>

      <div style={styles.dashedBorder}></div>

      {/* Invoice Details */}
      <div style={styles.invoiceDetails}>
        <div style={styles.row}>
          <span>Invoice No:</span>
          <span style={styles.bold}>{invoiceNumber}</span>
        </div>
        <div style={styles.row}>
          <span>Date:</span>
          <span>{billingDate}</span>
        </div>
        <div style={styles.row}>
          <span>Customer:</span>
          <span style={styles.bold}>{customerName}</span>
        </div>
        {customerPhone && (
          <div style={styles.row}>
            <span>Phone:</span>
            <span>{customerPhone}</span>
          </div>
        )}
      </div>

      <div style={styles.dashedBorder}></div>

      {/* Services Table */}
      <table style={styles.table}>
        <thead>
          <tr style={styles.tableHeader}>
            <th style={styles.thLeft}>Service</th>
            <th style={styles.thCenter}>Qty</th>
            <th style={styles.thRight}>Price</th>
            <th style={styles.thRight}>Total</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service, index) => (
            <tr key={index} style={styles.tableRow}>
              <td style={styles.tdLeft}>{service.name}</td>
              <td style={styles.tdCenter}>{service.quantity}</td>
              <td style={styles.tdRight}>
                {service.originalPrice !== service.discountedPrice ? (
                  <>
                    <span style={styles.strikethrough}>₹{service.originalPrice.toFixed(2)}</span>
                    <br />
                    <span>₹{service.discountedPrice.toFixed(2)}</span>
                  </>
                ) : (
                  <span>₹{service.discountedPrice.toFixed(2)}</span>
                )}
              </td>
              <td style={styles.tdRight}>₹{service.subtotal.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={styles.dashedBorder}></div>

      {/* Totals Section */}
      <div style={styles.totals}>
        <div style={styles.row}>
          <span>Subtotal:</span>
          <span>₹{(totalAmount + totalDiscount).toFixed(2)}</span>
        </div>
        {totalDiscount > 0 && (
          <div style={styles.row}>
            <span>Discount:</span>
            <span style={styles.discountText}>-₹{totalDiscount.toFixed(2)}</span>
          </div>
        )}
        <div style={{ ...styles.row, ...styles.totalRow }}>
          <span style={styles.bold}>TOTAL:</span>
          <span style={styles.bold}>₹{totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <div style={styles.dashedBorder}></div>

      {/* Payment Details */}
      <div style={styles.payment}>
        <div style={styles.row}>
          <span>Payment Mode:</span>
          <span style={styles.bold}>{paymentMode}</span>
        </div>
        <div style={styles.row}>
          <span>Amount Received:</span>
          <span>₹{amountReceived.toFixed(2)}</span>
        </div>
        {balanceAmount !== 0 && (
          <div style={styles.row}>
            <span>{balanceAmount > 0 ? 'Balance Due:' : 'Change:'}</span>
            <span style={styles.bold}>
              ₹{Math.abs(balanceAmount).toFixed(2)}
            </span>
          </div>
        )}
      </div>

      <div style={styles.dashedBorder}></div>

      {/* Footer Section */}
      <div style={styles.footer}>
        <div style={styles.thankYou}>
          {thankYouNote || 'Thank you for visiting!'}
        </div>
        <div style={styles.thankYou}>Please visit again!</div>
        {website && <div style={styles.text}>{website}</div>}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: '80mm',
    maxWidth: '80mm',
    margin: '0 auto',
    padding: '5mm',
    fontFamily: 'Arial, sans-serif',
    fontSize: '11px',
    lineHeight: '1.4',
    color: '#000',
    backgroundColor: '#fff',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '8px',
  },
  salonName: {
    fontSize: '18px',
    fontWeight: 'bold' as const,
    marginBottom: '4px',
    textTransform: 'uppercase' as const,
  },
  text: {
    fontSize: '10px',
    marginBottom: '2px',
  },
  dashedBorder: {
    borderTop: '1px dashed #000',
    margin: '8px 0',
  },
  invoiceDetails: {
    marginBottom: '8px',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '3px',
  },
  bold: {
    fontWeight: 'bold' as const,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    marginBottom: '8px',
  },
  tableHeader: {
    borderBottom: '1px solid #000',
  },
  thLeft: {
    textAlign: 'left' as const,
    padding: '4px 2px',
    fontSize: '10px',
    fontWeight: 'bold' as const,
  },
  thCenter: {
    textAlign: 'center' as const,
    padding: '4px 2px',
    fontSize: '10px',
    fontWeight: 'bold' as const,
    width: '30px',
  },
  thRight: {
    textAlign: 'right' as const,
    padding: '4px 2px',
    fontSize: '10px',
    fontWeight: 'bold' as const,
    width: '60px',
  },
  tableRow: {
    borderBottom: '1px dashed #ccc',
  },
  tdLeft: {
    textAlign: 'left' as const,
    padding: '4px 2px',
    fontSize: '10px',
  },
  tdCenter: {
    textAlign: 'center' as const,
    padding: '4px 2px',
    fontSize: '10px',
  },
  tdRight: {
    textAlign: 'right' as const,
    padding: '4px 2px',
    fontSize: '10px',
  },
  strikethrough: {
    textDecoration: 'line-through',
    color: '#888',
    fontSize: '9px',
  },
  totals: {
    marginBottom: '8px',
  },
  totalRow: {
    fontSize: '13px',
    marginTop: '5px',
    paddingTop: '5px',
    borderTop: '1px solid #000',
  },
  discountText: {
    color: '#d00',
  },
  payment: {
    marginBottom: '8px',
  },
  footer: {
    textAlign: 'center' as const,
    marginTop: '10px',
  },
  thankYou: {
    fontSize: '11px',
    fontWeight: 'bold' as const,
    marginBottom: '3px',
  },
};

// Utility function to generate print-ready HTML
export const generatePrintableHTML = (props: BillProps): string => {
  const servicesHTML = props.services
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

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice - ${props.invoiceNumber}</title>
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
    <div class="salon-name">${props.salonName}</div>
    <div class="text">${props.address}</div>
    <div class="text">${props.branchAddress}</div>
    <div class="text">Ph: ${props.phone}</div>
    ${props.preBookingRef ? `<div class="text">Booking Ref: ${props.preBookingRef}</div>` : ''}
  </div>

  <div class="dashed-border"></div>

  <!-- Invoice Details -->
  <div style="margin-bottom: 8px;">
    <div class="row">
      <span>Invoice No:</span>
      <span class="bold">${props.invoiceNumber}</span>
    </div>
    <div class="row">
      <span>Date:</span>
      <span>${props.billingDate}</span>
    </div>
    <div class="row">
      <span>Customer:</span>
      <span class="bold">${props.customerName}</span>
    </div>
    ${props.customerPhone ? `<div class="row"><span>Phone:</span><span>${props.customerPhone}</span></div>` : ''}
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
      <span>₹${(props.totalAmount + props.totalDiscount).toFixed(2)}</span>
    </div>
    ${
      props.totalDiscount > 0
        ? `<div class="row"><span>Discount:</span><span class="discount-text">-₹${props.totalDiscount.toFixed(2)}</span></div>`
        : ''
    }
    <div class="row total-row">
      <span class="bold">TOTAL:</span>
      <span class="bold">₹${props.totalAmount.toFixed(2)}</span>
    </div>
  </div>

  <div class="dashed-border"></div>

  <!-- Payment Details -->
  <div style="margin-bottom: 8px;">
    <div class="row">
      <span>Payment Mode:</span>
      <span class="bold">${props.paymentMode}</span>
    </div>
    <div class="row">
      <span>Amount Received:</span>
      <span>₹${props.amountReceived.toFixed(2)}</span>
    </div>
    ${
      props.balanceAmount !== 0
        ? `<div class="row"><span>${props.balanceAmount > 0 ? 'Balance Due:' : 'Change:'}</span><span class="bold">₹${Math.abs(props.balanceAmount).toFixed(2)}</span></div>`
        : ''
    }
  </div>

  <div class="dashed-border"></div>

  <!-- Footer Section -->
  <div class="footer">
    <div class="thank-you">${props.thankYouNote || 'Thank you for visiting!'}</div>
    <div class="thank-you">Please visit again!</div>
    ${props.website ? `<div class="text">${props.website}</div>` : ''}
  </div>
</body>
</html>
  `;
};
