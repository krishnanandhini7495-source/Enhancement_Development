using System.ComponentModel.DataAnnotations;

namespace SalonSoftware.API.Models;

public class Customer
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required]
    [MaxLength(200)]
    public string CustomerName { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(20)]
    public string Phone { get; set; } = string.Empty;
    
    [MaxLength(100)]
    public string? Email { get; set; }
    
    [MaxLength(500)]
    public string? Address { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation property
    public ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();
}
