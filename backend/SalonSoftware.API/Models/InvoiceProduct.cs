using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SalonSoftware.API.Models;

public class InvoiceProduct
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required]
    public Guid InvoiceId { get; set; }
    
    [Required]
    public Guid ProductId { get; set; }
    
    [Required]
    public int Quantity { get; set; }
    
    [Required]
    [Column(TypeName = "decimal(10,2)")]
    public decimal UnitPrice { get; set; }
    
    [Required]
    [Column(TypeName = "decimal(10,2)")]
    public decimal TotalPrice { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    [ForeignKey("InvoiceId")]
    public Invoice Invoice { get; set; } = null!;
    
    [ForeignKey("ProductId")]
    public Product Product { get; set; } = null!;
}
