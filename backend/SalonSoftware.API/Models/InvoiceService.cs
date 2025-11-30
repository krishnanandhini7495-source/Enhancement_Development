using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SalonSoftware.API.Models;

public class InvoiceService
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required]
    public Guid InvoiceId { get; set; }
    
    [Required]
    public Guid ServiceId { get; set; }
    
    public Guid? StaffId { get; set; }
    
    [Required]
    [Column(TypeName = "decimal(10,2)")]
    public decimal BasePrice { get; set; }
    
    [Column(TypeName = "decimal(5,2)")]
    public decimal DiscountPercent { get; set; } = 0;
    
    [Required]
    [Column(TypeName = "decimal(10,2)")]
    public decimal FinalPrice { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    [ForeignKey("InvoiceId")]
    public Invoice Invoice { get; set; } = null!;
    
    [ForeignKey("ServiceId")]
    public Service Service { get; set; } = null!;
    
    [ForeignKey("StaffId")]
    public Staff? Staff { get; set; }
}
