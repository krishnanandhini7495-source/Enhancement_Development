using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using SalonSoftware.API.Data;
using SalonSoftware.API.DTOs;
using SalonSoftware.API.Models;
using SalonSoftware.API.Services;
using Xunit;

namespace SalonSoftware.Tests.Services;

public class ServiceServiceTests : IDisposable
{
    private readonly ApplicationDbContext _context;
    private readonly ServiceService _service;

    public ServiceServiceTests()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _context = new ApplicationDbContext(options);
        _service = new ServiceService(_context);
    }

    [Fact]
    public async Task GetAllAsync_ShouldReturnAllServices()
    {
        // Arrange
        _context.Services.AddRange(
            new Service { Name = "Haircut", BasePrice = 50.00m },
            new Service { Name = "Manicure", BasePrice = 30.00m }
        );
        await _context.SaveChangesAsync();

        // Act
        var result = await _service.GetAllAsync();

        // Assert
        result.Should().HaveCount(2);
        result.Should().Contain(s => s.Name == "Haircut");
    }

    [Fact]
    public async Task CreateAsync_ShouldAddNewService()
    {
        // Arrange
        var dto = new CreateServiceDto
        {
            Name = "Facial",
            BasePrice = 75.00m
        };

        // Act
        var result = await _service.CreateAsync(dto);

        // Assert
        result.Should().NotBeNull();
        result.Name.Should().Be("Facial");
        result.BasePrice.Should().Be(75.00m);
        result.Active.Should().BeTrue();
    }

    [Fact]
    public async Task UpdateAsync_ShouldUpdateExistingService()
    {
        // Arrange
        var service = new Service { Name = "Old Service", BasePrice = 40.00m };
        _context.Services.Add(service);
        await _context.SaveChangesAsync();

        var updateDto = new UpdateServiceDto
        {
            Name = "New Service",
            BasePrice = 60.00m,
            Active = false
        };

        // Act
        var result = await _service.UpdateAsync(service.Id, updateDto);

        // Assert
        result.Should().NotBeNull();
        result!.Name.Should().Be("New Service");
        result.BasePrice.Should().Be(60.00m);
        result.Active.Should().BeFalse();
    }

    public void Dispose()
    {
        _context.Database.EnsureDeleted();
        _context.Dispose();
    }
}
