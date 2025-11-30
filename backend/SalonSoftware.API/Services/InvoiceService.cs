using Microsoft.EntityFrameworkCore;
using SalonSoftware.API.Data;
using SalonSoftware.API.DTOs;
using SalonSoftware.API.Models;

namespace SalonSoftware.API.Services;

public interface IInvoiceService
{
    Task<List<InvoiceDto>> GetAllAsync(DateTime? startDate = null, DateTime? endDate = null);
    Task<InvoiceDto?> GetByIdAsync(Guid id);
    Task<InvoiceDto> CreateAsync(CreateInvoiceDto dto, string userId);
    Task<DashboardStatsDto> GetDashboardStatsAsync();
}

public class InvoiceService : IInvoiceService
{
    private readonly ApplicationDbContext _context;

    public InvoiceService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<InvoiceDto>> GetAllAsync(DateTime? startDate = null, DateTime? endDate = null)
    {
        var query = _context.Invoices
            .Include(i => i.InvoiceServices).ThenInclude(s => s.Service)
            .Include(i => i.InvoiceServices).ThenInclude(s => s.Staff)
            .Include(i => i.InvoiceProducts).ThenInclude(p => p.Product)
            .Include(i => i.Payments)
            .AsQueryable();

        if (startDate.HasValue)
            query = query.Where(i => i.InvoiceDate >= startDate.Value);

        if (endDate.HasValue)
            query = query.Where(i => i.InvoiceDate <= endDate.Value);

        var invoices = await query
            .OrderByDescending(i => i.CreatedAt)
            .ToListAsync();

        return invoices.Select(MapToDto).ToList();
    }

    public async Task<InvoiceDto?> GetByIdAsync(Guid id)
    {
        var invoice = await _context.Invoices
            .Include(i => i.InvoiceServices).ThenInclude(s => s.Service)
            .Include(i => i.InvoiceServices).ThenInclude(s => s.Staff)
            .Include(i => i.InvoiceProducts).ThenInclude(p => p.Product)
            .Include(i => i.Payments)
            .FirstOrDefaultAsync(i => i.Id == id);

        return invoice == null ? null : MapToDto(invoice);
    }

    public async Task<InvoiceDto> CreateAsync(CreateInvoiceDto dto, string userId)
    {
        // Find or create customer
        var customer = await _context.Customers
            .FirstOrDefaultAsync(c => c.Phone == dto.ClientPhone);

        if (customer == null)
        {
            // Create new customer
            customer = new Customer
            {
                CustomerName = dto.ClientName,
                Phone = dto.ClientPhone,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _context.Customers.Add(customer);
        }
        else
        {
            // Update customer name if changed
            if (customer.CustomerName != dto.ClientName)
            {
                customer.CustomerName = dto.ClientName;
                customer.UpdatedAt = DateTime.UtcNow;
            }
        }

        // Generate invoice number
        var lastInvoice = await _context.Invoices
            .OrderByDescending(i => i.CreatedAt)
            .FirstOrDefaultAsync();

        var invoiceNumber = GenerateInvoiceNumber(lastInvoice);

        // Calculate totals
        var subtotal = dto.Services.Sum(s => s.FinalPrice) + dto.Products.Sum(p => p.TotalPrice);
        var totalAmount = subtotal;

        var invoice = new Invoice
        {
            InvoiceNumber = invoiceNumber,
            CustomerId = customer.Id,
            ClientName = dto.ClientName,
            ClientPhone = dto.ClientPhone,
            InvoiceDate = dto.InvoiceDate,
            Subtotal = subtotal,
            TotalAmount = totalAmount,
            CreatedBy = userId
        };

        _context.Invoices.Add(invoice);

        // Add services
        foreach (var serviceDto in dto.Services)
        {
            var invoiceService = new Models.InvoiceService
            {
                InvoiceId = invoice.Id,
                ServiceId = serviceDto.ServiceId,
                StaffId = serviceDto.StaffId,
                BasePrice = serviceDto.BasePrice,
                DiscountPercent = serviceDto.DiscountPercent,
                FinalPrice = serviceDto.FinalPrice
            };
            _context.InvoiceServices.Add(invoiceService);
        }

        // Add products and update stock
        foreach (var productDto in dto.Products)
        {
            var invoiceProduct = new InvoiceProduct
            {
                InvoiceId = invoice.Id,
                ProductId = productDto.ProductId,
                Quantity = productDto.Quantity,
                UnitPrice = productDto.UnitPrice,
                TotalPrice = productDto.TotalPrice
            };
            _context.InvoiceProducts.Add(invoiceProduct);

            // Update product stock
            var product = await _context.Products.FindAsync(productDto.ProductId);
            if (product != null)
            {
                product.StockQuantity -= productDto.Quantity;
            }
        }

        // Add payments
        foreach (var paymentDto in dto.Payments)
        {
            var payment = new Payment
            {
                InvoiceId = invoice.Id,
                PaymentMode = paymentDto.PaymentMode,
                Amount = paymentDto.Amount
            };
            _context.Payments.Add(payment);
        }

        await _context.SaveChangesAsync();

        return (await GetByIdAsync(invoice.Id))!;
    }

    public async Task<DashboardStatsDto> GetDashboardStatsAsync()
    {
        var today = DateTime.UtcNow.Date;

        var todayInvoices = await _context.Invoices
            .Where(i => i.InvoiceDate == today)
            .ToListAsync();

        var stats = new DashboardStatsDto
        {
            TodaySales = todayInvoices.Sum(i => i.TotalAmount),
            TodayInvoices = todayInvoices.Count,
            TotalServices = await _context.Services.CountAsync(),
            TotalProducts = await _context.Products.CountAsync(),
            TotalStaff = await _context.Staff.CountAsync()
        };

        return stats;
    }

    private static InvoiceDto MapToDto(Invoice invoice)
    {
        return new InvoiceDto
        {
            Id = invoice.Id,
            InvoiceNumber = invoice.InvoiceNumber,
            ClientName = invoice.ClientName,
            ClientPhone = invoice.ClientPhone,
            InvoiceDate = invoice.InvoiceDate,
            Subtotal = invoice.Subtotal,
            TotalAmount = invoice.TotalAmount,
            CreatedBy = invoice.CreatedBy,
            CreatedAt = invoice.CreatedAt,
            Services = invoice.InvoiceServices.Select(s => new InvoiceServiceDto
            {
                Id = s.Id,
                ServiceId = s.ServiceId,
                ServiceName = s.Service.Name,
                StaffId = s.StaffId,
                StaffName = s.Staff?.Name,
                BasePrice = s.BasePrice,
                DiscountPercent = s.DiscountPercent,
                FinalPrice = s.FinalPrice
            }).ToList(),
            Products = invoice.InvoiceProducts.Select(p => new InvoiceProductDto
            {
                Id = p.Id,
                ProductId = p.ProductId,
                ProductName = p.Product.Name,
                Quantity = p.Quantity,
                UnitPrice = p.UnitPrice,
                TotalPrice = p.TotalPrice
            }).ToList(),
            Payments = invoice.Payments.Select(p => new PaymentDto
            {
                Id = p.Id,
                PaymentMode = p.PaymentMode,
                Amount = p.Amount
            }).ToList()
        };
    }

    private static string GenerateInvoiceNumber(Invoice? lastInvoice)
    {
        var date = DateTime.UtcNow;
        var prefix = $"INV-{date:yyyyMMdd}";

        if (lastInvoice == null || !lastInvoice.InvoiceNumber.StartsWith(prefix))
        {
            return $"{prefix}-001";
        }

        var lastNumber = int.Parse(lastInvoice.InvoiceNumber.Split('-').Last());
        var newNumber = lastNumber + 1;

        return $"{prefix}-{newNumber:D3}";
    }
}
