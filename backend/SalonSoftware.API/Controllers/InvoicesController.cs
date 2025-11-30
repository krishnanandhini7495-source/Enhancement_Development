using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SalonSoftware.API.DTOs;
using SalonSoftware.API.Services;
using System.Security.Claims;
using System.Text;

namespace SalonSoftware.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class InvoicesController : ControllerBase
{
    private readonly IInvoiceService _invoiceService;

    public InvoicesController(IInvoiceService invoiceService)
    {
        _invoiceService = invoiceService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
    {
        var invoices = await _invoiceService.GetAllAsync(startDate, endDate);
        return Ok(invoices);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var invoice = await _invoiceService.GetByIdAsync(id);
        if (invoice == null)
            return NotFound();

        return Ok(invoice);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateInvoiceDto dto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var invoice = await _invoiceService.CreateAsync(dto, userId);
        return CreatedAtAction(nameof(GetById), new { id = invoice.Id }, invoice);
    }

    [HttpGet("export/csv")]
    public async Task<IActionResult> ExportToCsv([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate, [FromQuery] string? search)
    {
        try
        {
            var invoices = await _invoiceService.GetAllAsync(startDate, endDate);
            
            // Apply search filter if provided
            if (!string.IsNullOrWhiteSpace(search))
            {
                invoices = invoices.Where(i => 
                    i.InvoiceNumber.Contains(search, StringComparison.OrdinalIgnoreCase) ||
                    i.ClientName.Contains(search, StringComparison.OrdinalIgnoreCase) ||
                    i.ClientPhone.Contains(search, StringComparison.OrdinalIgnoreCase)
                ).ToList();
            }

            var csv = new StringBuilder();
            
            // CSV Header
            csv.AppendLine("Invoice Number,Date,Customer Name,Phone,Services,Products,Subtotal,Total Amount,Amount Received,Balance,Payment Modes,Created By");
            
            // CSV Data
            foreach (var invoice in invoices)
            {
                var services = string.Join("; ", invoice.Services.Select(s => $"{s.ServiceName} (₹{s.FinalPrice})"));
                var products = string.Join("; ", invoice.Products.Select(p => $"{p.ProductName} x{p.Quantity} (₹{p.TotalPrice})"));
                var paymentModes = string.Join("; ", invoice.Payments.Select(p => $"{p.PaymentMode}: ₹{p.Amount}"));
                var amountReceived = invoice.Payments.Sum(p => p.Amount);
                var balance = invoice.TotalAmount - amountReceived;
                
                csv.AppendLine($"\"{invoice.InvoiceNumber}\",\"{invoice.InvoiceDate:yyyy-MM-dd}\",\"{EscapeCsv(invoice.ClientName)}\",\"{invoice.ClientPhone}\",\"{EscapeCsv(services)}\",\"{EscapeCsv(products)}\",\"{invoice.Subtotal}\",\"{invoice.TotalAmount}\",\"{amountReceived}\",\"{balance}\",\"{EscapeCsv(paymentModes)}\",\"{EscapeCsv(invoice.CreatedBy)}\"");
            }
            
            var fileName = $"Invoices_{DateTime.Now:yyyyMMdd_HHmmss}.csv";
            var bytes = Encoding.UTF8.GetBytes(csv.ToString());
            
            return File(bytes, "text/csv", fileName);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error exporting to CSV: {ex.Message}");
        }
    }

    private string EscapeCsv(string value)
    {
        if (string.IsNullOrEmpty(value))
            return string.Empty;
        
        // Escape double quotes by doubling them
        return value.Replace("\"", "\"\"");
    }
}
