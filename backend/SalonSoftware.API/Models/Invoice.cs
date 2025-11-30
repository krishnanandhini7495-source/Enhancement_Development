using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SalonSoftware.API.Models;

public class Invoice
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required]
    [MaxLength(50)]
    public string InvoiceNumber { get; set; } = string.Empty;
    
    // Foreign Key to Customer
    public Guid? CustomerId { get; set; }
    
    [Required]
    [MaxLength(200)]
    public string ClientName { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(20)]
    public string ClientPhone { get; set; } = string.Empty;
    
    public DateTime InvoiceDate { get; set; } = DateTime.UtcNow.Date;
    
    [Column(TypeName = "decimal(10,2)")]
    public decimal Subtotal { get; set; } = 0;
    
    [Required]
    [Column(TypeName = "decimal(10,2)")]
    public decimal TotalAmount { get; set; }
    
    [Required]
    public string CreatedBy { get; set; } = string.Empty;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public Customer? Customer { get; set; }
    public ICollection<InvoiceService> InvoiceServices { get; set; } = new List<InvoiceService>();
    public ICollection<InvoiceProduct> InvoiceProducts { get; set; } = new List<InvoiceProduct>();
    public ICollection<Payment> Payments { get; set; } = new List<Payment>();
}
