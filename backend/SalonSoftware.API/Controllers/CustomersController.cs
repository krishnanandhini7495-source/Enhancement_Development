using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SalonSoftware.API.Data;
using SalonSoftware.API.Models;

namespace SalonSoftware.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CustomersController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<CustomersController> _logger;

    public CustomersController(ApplicationDbContext context, ILogger<CustomersController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet("search")]
    public async Task<IActionResult> SearchCustomers([FromQuery] string query)
    {
        if (string.IsNullOrWhiteSpace(query) || query.Length < 3)
            return Ok(new List<object>());

        try
        {
            var searchQuery = query.ToLower();
            var customers = await _context.Customers
                .Where(c => c.CustomerName.ToLower().Contains(searchQuery) || c.Phone.Contains(query))
                .Select(c => new
                {
                    Id = c.Id,
                    CustomerName = c.CustomerName,
                    Phone = c.Phone,
                    Email = c.Email,
                    Address = c.Address,
                    LastVisitDate = c.Invoices.Max(i => (DateTime?)i.InvoiceDate) ?? c.CreatedAt,
                    LastInvoiceTotal = c.Invoices.OrderByDescending(i => i.InvoiceDate).Select(i => i.TotalAmount).FirstOrDefault(),
                    TotalVisits = c.Invoices.Count(),
                    LastPaymentMode = c.Invoices.OrderByDescending(i => i.InvoiceDate)
                        .SelectMany(i => i.Payments)
                        .Select(p => p.PaymentMode)
                        .FirstOrDefault() ?? "N/A"
                })
                .OrderByDescending(c => c.LastVisitDate)
                .Take(10)
                .ToListAsync();

            return Ok(customers);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching customers");
            return StatusCode(500, "Error searching customers");
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetAllCustomers()
    {
        try
        {
            var customers = await _context.Customers
                .OrderByDescending(c => c.CreatedAt)
                .Select(c => new
                {
                    Id = c.Id,
                    CustomerName = c.CustomerName,
                    Phone = c.Phone,
                    Email = c.Email,
                    Address = c.Address,
                    CreatedAt = c.CreatedAt,
                    TotalInvoices = c.Invoices.Count()
                })
                .ToListAsync();

            return Ok(customers);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching customers");
            return StatusCode(500, "Error fetching customers");
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetCustomer(Guid id)
    {
        try
        {
            var customer = await _context.Customers
                .Where(c => c.Id == id)
                .Select(c => new
                {
                    Id = c.Id,
                    CustomerName = c.CustomerName,
                    Phone = c.Phone,
                    Email = c.Email,
                    Address = c.Address,
                    CreatedAt = c.CreatedAt,
                    UpdatedAt = c.UpdatedAt
                })
                .FirstOrDefaultAsync();

            if (customer == null)
                return NotFound();

            return Ok(customer);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching customer");
            return StatusCode(500, "Error fetching customer");
        }
    }

    [HttpGet("history/{phone}")]
    public async Task<IActionResult> GetCustomerHistory(string phone)
    {
        try
        {
            var customer = await _context.Customers
                .Include(c => c.Invoices)
                    .ThenInclude(i => i.Payments)
                .FirstOrDefaultAsync(c => c.Phone == phone);

            if (customer == null)
                return Ok(new { CustomerName = "", Phone = phone, Invoices = new List<object>() });

            var invoices = customer.Invoices
                .OrderByDescending(i => i.InvoiceDate)
                .Take(10)
                .Select(i => new
                {
                    i.Id,
                    i.InvoiceNumber,
                    i.InvoiceDate,
                    i.TotalAmount,
                    PaymentMode = i.Payments.FirstOrDefault() != null ? i.Payments.First().PaymentMode : "N/A"
                })
                .ToList();

            return Ok(new
            {
                CustomerName = customer.CustomerName,
                Phone = customer.Phone,
                Invoices = invoices
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching customer history");
            return StatusCode(500, "Error fetching customer history");
        }
    }
}
