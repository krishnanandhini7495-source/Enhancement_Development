using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SalonSoftware.API.Models;

namespace SalonSoftware.API.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Staff> Staff { get; set; }
    public DbSet<Service> Services { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<Customer> Customers { get; set; }
    public DbSet<Invoice> Invoices { get; set; }
    public DbSet<InvoiceService> InvoiceServices { get; set; }
    public DbSet<InvoiceProduct> InvoiceProducts { get; set; }
    public DbSet<Payment> Payments { get; set; }
    public DbSet<SalonSettings> SalonSettings { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure decimal precision
        modelBuilder.Entity<Service>()
            .Property(s => s.BasePrice)
            .HasPrecision(10, 2);

        modelBuilder.Entity<Product>()
            .Property(p => p.Price)
            .HasPrecision(10, 2);

        modelBuilder.Entity<Invoice>()
            .Property(i => i.Subtotal)
            .HasPrecision(10, 2);

        modelBuilder.Entity<Invoice>()
            .Property(i => i.TotalAmount)
            .HasPrecision(10, 2);

        modelBuilder.Entity<InvoiceService>()
            .Property(i => i.BasePrice)
            .HasPrecision(10, 2);

        modelBuilder.Entity<InvoiceService>()
            .Property(i => i.DiscountPercent)
            .HasPrecision(5, 2);

        modelBuilder.Entity<InvoiceService>()
            .Property(i => i.FinalPrice)
            .HasPrecision(10, 2);

        modelBuilder.Entity<InvoiceProduct>()
            .Property(i => i.UnitPrice)
            .HasPrecision(10, 2);

        modelBuilder.Entity<InvoiceProduct>()
            .Property(i => i.TotalPrice)
            .HasPrecision(10, 2);

        modelBuilder.Entity<Payment>()
            .Property(p => p.Amount)
            .HasPrecision(10, 2);

        // Configure relationships
        modelBuilder.Entity<InvoiceService>()
            .HasOne(i => i.Invoice)
            .WithMany(inv => inv.InvoiceServices)
            .HasForeignKey(i => i.InvoiceId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<InvoiceService>()
            .HasOne(i => i.Service)
            .WithMany(s => s.InvoiceServices)
            .HasForeignKey(i => i.ServiceId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<InvoiceService>()
            .HasOne(i => i.Staff)
            .WithMany(s => s.InvoiceServices)
            .HasForeignKey(i => i.StaffId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<InvoiceProduct>()
            .HasOne(i => i.Invoice)
            .WithMany(inv => inv.InvoiceProducts)
            .HasForeignKey(i => i.InvoiceId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<InvoiceProduct>()
            .HasOne(i => i.Product)
            .WithMany(p => p.InvoiceProducts)
            .HasForeignKey(i => i.ProductId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Payment>()
            .HasOne(p => p.Invoice)
            .WithMany(i => i.Payments)
            .HasForeignKey(p => p.InvoiceId)
            .OnDelete(DeleteBehavior.Cascade);

        // Customer-Invoice relationship
        modelBuilder.Entity<Invoice>()
            .HasOne(i => i.Customer)
            .WithMany(c => c.Invoices)
            .HasForeignKey(i => i.CustomerId)
            .OnDelete(DeleteBehavior.SetNull);

        // Unique constraints
        modelBuilder.Entity<Invoice>()
            .HasIndex(i => i.InvoiceNumber)
            .IsUnique();
        
        // Customer unique constraint on Phone
        modelBuilder.Entity<Customer>()
            .HasIndex(c => c.Phone)
            .IsUnique();

        // Seed default salon settings
        modelBuilder.Entity<SalonSettings>().HasData(
            new SalonSettings
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000001"),
                SalonName = "Elegant Salon",
                MainAddress = "123 Beauty Street, City, State - 400001",
                BranchAddresses = "[]",
                Phone = "+91 98765 43210",
                Email = "info@elegantsalon.com",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        );
    }
}
