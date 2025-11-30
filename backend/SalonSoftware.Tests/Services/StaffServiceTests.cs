using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using SalonSoftware.API.Data;
using SalonSoftware.API.DTOs;
using SalonSoftware.API.Models;
using SalonSoftware.API.Services;
using Xunit;

namespace SalonSoftware.Tests.Services;

public class StaffServiceTests : IDisposable
{
    private readonly ApplicationDbContext _context;
    private readonly StaffService _service;

    public StaffServiceTests()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _context = new ApplicationDbContext(options);
        _service = new StaffService(_context);
    }

    [Fact]
    public async Task GetAllAsync_ShouldReturnAllStaff()
    {
        // Arrange
        _context.Staff.AddRange(
            new Staff { Name = "John Doe", Phone = "1234567890" },
            new Staff { Name = "Jane Smith", Phone = "0987654321" }
        );
        await _context.SaveChangesAsync();

        // Act
        var result = await _service.GetAllAsync();

        // Assert
        result.Should().HaveCount(2);
        result.Should().Contain(s => s.Name == "John Doe");
        result.Should().Contain(s => s.Name == "Jane Smith");
    }

    [Fact]
    public async Task CreateAsync_ShouldAddNewStaff()
    {
        // Arrange
        var dto = new CreateStaffDto
        {
            Name = "Test Staff",
            Phone = "1111111111"
        };

        // Act
        var result = await _service.CreateAsync(dto);

        // Assert
        result.Should().NotBeNull();
        result.Name.Should().Be("Test Staff");
        result.Phone.Should().Be("1111111111");
        result.Active.Should().BeTrue();

        var staffInDb = await _context.Staff.FindAsync(result.Id);
        staffInDb.Should().NotBeNull();
    }

    [Fact]
    public async Task UpdateAsync_ShouldUpdateExistingStaff()
    {
        // Arrange
        var staff = new Staff { Name = "Original Name", Phone = "1234567890" };
        _context.Staff.Add(staff);
        await _context.SaveChangesAsync();

        var updateDto = new UpdateStaffDto
        {
            Name = "Updated Name",
            Phone = "0987654321",
            Active = false
        };

        // Act
        var result = await _service.UpdateAsync(staff.Id, updateDto);

        // Assert
        result.Should().NotBeNull();
        result!.Name.Should().Be("Updated Name");
        result.Phone.Should().Be("0987654321");
        result.Active.Should().BeFalse();
    }

    [Fact]
    public async Task DeleteAsync_ShouldRemoveStaff()
    {
        // Arrange
        var staff = new Staff { Name = "To Delete", Phone = "1234567890" };
        _context.Staff.Add(staff);
        await _context.SaveChangesAsync();

        // Act
        var result = await _service.DeleteAsync(staff.Id);

        // Assert
        result.Should().BeTrue();
        var deletedStaff = await _context.Staff.FindAsync(staff.Id);
        deletedStaff.Should().BeNull();
    }

    public void Dispose()
    {
        _context.Database.EnsureDeleted();
        _context.Dispose();
    }
}
