namespace SalonSoftware.API.DTOs;

// Auth DTOs
public class LoginRequestDto
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class RegisterRequestDto
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Role { get; set; } = "Staff"; // Admin or Staff
}

public class AuthResponseDto
{
    public string Token { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
}

// Staff DTOs
public class StaffDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? Address { get; set; }
    public string? AadharNumber { get; set; }
    public string? StaffCategory { get; set; }
    public string? BankName { get; set; }
    public string? BankAccountNumber { get; set; }
    public string? IfscCode { get; set; }
    public bool Active { get; set; }
    public DateTime CreatedAt { get; set; }
    public StaffSalaryHistoryDto? CurrentSalary { get; set; }
}

public class CreateStaffDto
{
    public string Name { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? Address { get; set; }
    public string? AadharNumber { get; set; }
    public string? StaffCategory { get; set; }
    public string? BankName { get; set; }
    public string? BankAccountNumber { get; set; }
    public string? IfscCode { get; set; }
    public decimal? BasicSalary { get; set; }
    public DateTime? SalaryEffectiveDate { get; set; }
}

public class UpdateStaffDto
{
    public string Name { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? Address { get; set; }
    public string? AadharNumber { get; set; }
    public string? StaffCategory { get; set; }
    public string? BankName { get; set; }
    public string? BankAccountNumber { get; set; }
    public string? IfscCode { get; set; }
    public bool Active { get; set; }
    public decimal? BasicSalary { get; set; }
    public DateTime? SalaryEffectiveDate { get; set; }
}

public class StaffSalaryHistoryDto
{
    public Guid Id { get; set; }
    public Guid StaffId { get; set; }
    public decimal BasicSalary { get; set; }
    public DateTime EffectiveFromDate { get; set; }
    public DateTime? EffectiveToDate { get; set; }
    public DateTime CreatedAt { get; set; }
}

// Service DTOs
public class ServiceDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal BasePrice { get; set; }
    public bool Active { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateServiceDto
{
    public string Name { get; set; } = string.Empty;
    public decimal BasePrice { get; set; }
}

public class UpdateServiceDto
{
    public string Name { get; set; } = string.Empty;
    public decimal BasePrice { get; set; }
    public bool Active { get; set; }
}

// Product DTOs
public class ProductDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int StockQuantity { get; set; }
    public int? OpeningStockQuantity { get; set; }
    public DateTime? OpeningStockDate { get; set; }
    public int? CurrentStockQuantity { get; set; }
    public DateTime? CurrentStockDate { get; set; }
    public string? ProductWeightUnit { get; set; }
    public decimal? ProductWeight { get; set; }
    public bool Active { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateProductDto
{
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int StockQuantity { get; set; }
    public int? OpeningStockQuantity { get; set; }
    public DateTime? OpeningStockDate { get; set; }
    public int? CurrentStockQuantity { get; set; }
    public DateTime? CurrentStockDate { get; set; }
    public string? ProductWeightUnit { get; set; }
    public decimal? ProductWeight { get; set; }
}

public class UpdateProductDto
{
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int StockQuantity { get; set; }
    public int? OpeningStockQuantity { get; set; }
    public DateTime? OpeningStockDate { get; set; }
    public int? CurrentStockQuantity { get; set; }
    public DateTime? CurrentStockDate { get; set; }
    public string? ProductWeightUnit { get; set; }
    public decimal? ProductWeight { get; set; }
    public bool Active { get; set; }
}

// Invoice DTOs
public class InvoiceDto
{
    public Guid Id { get; set; }
    public string InvoiceNumber { get; set; } = string.Empty;
    public string ClientName { get; set; } = string.Empty;
    public string ClientPhone { get; set; } = string.Empty;
    public DateTime InvoiceDate { get; set; }
    public decimal Subtotal { get; set; }
    public decimal TotalAmount { get; set; }
    public string CreatedBy { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public List<InvoiceServiceDto> Services { get; set; } = new();
    public List<InvoiceProductDto> Products { get; set; } = new();
    public List<PaymentDto> Payments { get; set; } = new();
}

public class InvoiceServiceDto
{
    public Guid Id { get; set; }
    public Guid ServiceId { get; set; }
    public string ServiceName { get; set; } = string.Empty;
    public Guid? StaffId { get; set; }
    public string? StaffName { get; set; }
    public decimal BasePrice { get; set; }
    public decimal DiscountPercent { get; set; }
    public decimal FinalPrice { get; set; }
}

public class InvoiceProductDto
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal TotalPrice { get; set; }
}

public class PaymentDto
{
    public Guid Id { get; set; }
    public string PaymentMode { get; set; } = string.Empty;
    public decimal Amount { get; set; }
}

public class CreateInvoiceDto
{
    public string ClientName { get; set; } = string.Empty;
    public string ClientPhone { get; set; } = string.Empty;
    public DateTime InvoiceDate { get; set; }
    public List<CreateInvoiceServiceDto> Services { get; set; } = new();
    public List<CreateInvoiceProductDto> Products { get; set; } = new();
    public List<CreatePaymentDto> Payments { get; set; } = new();
}

public class CreateInvoiceServiceDto
{
    public Guid ServiceId { get; set; }
    public Guid? StaffId { get; set; }
    public decimal BasePrice { get; set; }
    public decimal DiscountPercent { get; set; }
    public decimal FinalPrice { get; set; }
}

public class CreateInvoiceProductDto
{
    public Guid ProductId { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal TotalPrice { get; set; }
}

public class CreatePaymentDto
{
    public string PaymentMode { get; set; } = string.Empty;
    public decimal Amount { get; set; }
}

// Dashboard DTOs
public class DashboardStatsDto
{
    public decimal TodaySales { get; set; }
    public int TodayInvoices { get; set; }
    public int TotalServices { get; set; }
    public int TotalProducts { get; set; }
    public int TotalStaff { get; set; }
    public List<ProductDto> LowStockProducts { get; set; } = new();
}

// Settings DTOs
public class BranchDetailsDto
{
    public string BranchName { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
}

public class SalonSettingsDto
{
    public Guid Id { get; set; }
    public string SalonName { get; set; } = string.Empty;
    public string MainAddress { get; set; } = string.Empty;
    public List<BranchDetailsDto> BranchAddresses { get; set; } = new();
    public string Phone { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? LogoUrl { get; set; }
}

public class UpdateSalonSettingsDto
{
    public string SalonName { get; set; } = string.Empty;
    public string MainAddress { get; set; } = string.Empty;
    public List<BranchDetailsDto> BranchAddresses { get; set; } = new();
    public string Phone { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? LogoUrl { get; set; }
}
