using System.ComponentModel.DataAnnotations;

namespace SalonSoftware.API.Models;

public class Staff
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;
    
    [MaxLength(20)]
    public string? Phone { get; set; }
    
    [MaxLength(200)]
    public string? Email { get; set; }
    
    [MaxLength(500)]
    public string? Address { get; set; }
    
    [MaxLength(12)]
    public string? AadharNumber { get; set; }
    
    [MaxLength(100)]
    public string? StaffCategory { get; set; }
    
    [MaxLength(200)]
    public string? BankName { get; set; }
    
    [MaxLength(50)]
    public string? BankAccountNumber { get; set; }
    
    [MaxLength(20)]
    public string? IfscCode { get; set; }
    
    public bool Active { get; set; } = true;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public ICollection<InvoiceService> InvoiceServices { get; set; } = new List<InvoiceService>();
    public ICollection<StaffSalaryHistory> SalaryHistory { get; set; } = new List<StaffSalaryHistory>();
}
