using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SalonSoftware.API.Models;

public class Product
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    [Column(TypeName = "decimal(10,2)")]
    public decimal Price { get; set; }
    
    public int StockQuantity { get; set; } = 0;
    
    // Stock management fields
    public int? OpeningStockQuantity { get; set; }
    
    public DateTime? OpeningStockDate { get; set; }
    
    public int? CurrentStockQuantity { get; set; }
    
    public DateTime? CurrentStockDate { get; set; }
    
    [MaxLength(20)]
    public string? ProductWeightUnit { get; set; } // "gm", "ml", "count"
    
    public decimal? ProductWeight { get; set; }
    
    public bool Active { get; set; } = true;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public ICollection<InvoiceProduct> InvoiceProducts { get; set; } = new List<InvoiceProduct>();
}
