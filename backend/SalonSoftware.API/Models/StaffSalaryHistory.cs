using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SalonSoftware.API.Models;

public class StaffSalaryHistory
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required]
    public Guid StaffId { get; set; }
    
    [Required]
    [Column(TypeName = "decimal(10,2)")]
    public decimal BasicSalary { get; set; }
    
    [Required]
    public DateTime EffectiveFromDate { get; set; }
    
    public DateTime? EffectiveToDate { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation property
    public Staff Staff { get; set; } = null!;
}
