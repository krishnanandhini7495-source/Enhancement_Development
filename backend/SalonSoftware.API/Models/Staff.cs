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
    
    public bool Active { get; set; } = true;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public ICollection<InvoiceService> InvoiceServices { get; set; } = new List<InvoiceService>();
}
