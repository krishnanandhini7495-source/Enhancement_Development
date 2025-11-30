using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using SalonSoftware.API.Data;
using SalonSoftware.API.DTOs;
using SalonSoftware.API.Models;
using SalonSoftware.API.Services;
using Xunit;

namespace SalonSoftware.Tests.Services;

public class ProductServiceTests : IDisposable
{
    private readonly ApplicationDbContext _context;
    private readonly ProductService _service;

    public ProductServiceTests()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _context = new ApplicationDbContext(options);
        _service = new ProductService(_context);
    }

    [Fact]
    public async Task GetAllAsync_ShouldReturnAllProducts()
    {
        // Arrange
        _context.Products.AddRange(
            new Product { Name = "Shampoo", Price = 15.00m, StockQuantity = 50 },
            new Product { Name = "Conditioner", Price = 18.00m, StockQuantity = 30 }
        );
        await _context.SaveChangesAsync();

        // Act
        var result = await _service.GetAllAsync();

        // Assert
        result.Should().HaveCount(2);
        result.Should().Contain(p => p.Name == "Shampoo");
    }

    [Fact]
    public async Task CreateAsync_ShouldAddNewProduct()
    {
        // Arrange
        var dto = new CreateProductDto
        {
            Name = "Hair Gel",
            Price = 12.00m,
            StockQuantity = 100
        };

        // Act
        var result = await _service.CreateAsync(dto);

        // Assert
        result.Should().NotBeNull();
        result.Name.Should().Be("Hair Gel");
        result.Price.Should().Be(12.00m);
        result.StockQuantity.Should().Be(100);
        result.Active.Should().BeTrue();
    }

    [Fact]
    public async Task UpdateAsync_ShouldUpdateStock()
    {
        // Arrange
        var product = new Product { Name = "Test Product", Price = 20.00m, StockQuantity = 50 };
        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        var updateDto = new UpdateProductDto
        {
            Name = "Test Product",
            Price = 20.00m,
            StockQuantity = 25,
            Active = true
        };

        // Act
        var result = await _service.UpdateAsync(product.Id, updateDto);

        // Assert
        result.Should().NotBeNull();
        result!.StockQuantity.Should().Be(25);
    }

    public void Dispose()
    {
        _context.Database.EnsureDeleted();
        _context.Dispose();
    }
}
