using System.ComponentModel.DataAnnotations;

namespace SalonSoftware.API.Models;

public class BranchDetails
{
    public string BranchName { get; set; } = "";
    public string Address { get; set; } = "";
    public string Email { get; set; } = "";
    public string Phone { get; set; } = "";
}

public class SalonSettings
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required]
    [MaxLength(200)]
    public string SalonName { get; set; } = "Cheap&Best Salon";
    
    [Required]
    [MaxLength(500)]
    public string MainAddress { get; set; } = "123 Beauty Street, City, State";
    
    [MaxLength(4000)]
    public string BranchAddresses { get; set; } = ""; // JSON array of BranchDetails objects
    
    [Required]
    [MaxLength(20)]
    public string Phone { get; set; } = "+91 98765 43210";
    
    [MaxLength(100)]
    public string? Email { get; set; }
    
    [MaxLength(500)]
    public string? LogoUrl { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
