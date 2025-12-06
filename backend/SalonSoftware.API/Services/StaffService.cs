using Microsoft.EntityFrameworkCore;
using SalonSoftware.API.Data;
using SalonSoftware.API.DTOs;
using SalonSoftware.API.Models;

namespace SalonSoftware.API.Services;

public interface IStaffService
{
    Task<List<StaffDto>> GetAllAsync();
    Task<StaffDto?> GetByIdAsync(Guid id);
    Task<StaffDto> CreateAsync(CreateStaffDto dto);
    Task<StaffDto?> UpdateAsync(Guid id, UpdateStaffDto dto);
    Task<bool> DeleteAsync(Guid id);
}

public class StaffService : IStaffService
{
    private readonly ApplicationDbContext _context;

    public StaffService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<StaffDto>> GetAllAsync()
    {
        return await _context.Staff
            .OrderBy(s => s.Name)
            .Select(s => new StaffDto
            {
                Id = s.Id,
                Name = s.Name,
                Phone = s.Phone,
                Email = s.Email,
                Address = s.Address,
                AadharNumber = s.AadharNumber,
                Active = s.Active,
                CreatedAt = s.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<StaffDto?> GetByIdAsync(Guid id)
    {
        var staff = await _context.Staff.FindAsync(id);
        if (staff == null) return null;

        return new StaffDto
        {
            Id = staff.Id,
            Name = staff.Name,
            Phone = staff.Phone,
            Email = staff.Email,
            Address = staff.Address,
            AadharNumber = staff.AadharNumber,
            Active = staff.Active,
            CreatedAt = staff.CreatedAt
        };
    }

    public async Task<StaffDto> CreateAsync(CreateStaffDto dto)
    {
        var staff = new Staff
        {
            Name = dto.Name,
            Phone = dto.Phone,
            Email = dto.Email,
            Address = dto.Address,
            AadharNumber = dto.AadharNumber
        };

        _context.Staff.Add(staff);
        await _context.SaveChangesAsync();

        return new StaffDto
        {
            Id = staff.Id,
            Name = staff.Name,
            Phone = staff.Phone,
            Email = staff.Email,
            Address = staff.Address,
            AadharNumber = staff.AadharNumber,
            Active = staff.Active,
            CreatedAt = staff.CreatedAt
        };
    }

    public async Task<StaffDto?> UpdateAsync(Guid id, UpdateStaffDto dto)
    {
        var staff = await _context.Staff.FindAsync(id);
        if (staff == null) return null;

        staff.Name = dto.Name;
        staff.Phone = dto.Phone;
        staff.Email = dto.Email;
        staff.Address = dto.Address;
        staff.AadharNumber = dto.AadharNumber;
        staff.Active = dto.Active;

        await _context.SaveChangesAsync();

        return new StaffDto
        {
            Id = staff.Id,
            Name = staff.Name,
            Phone = staff.Phone,
            Email = staff.Email,
            Address = staff.Address,
            AadharNumber = staff.AadharNumber,
            Active = staff.Active,
            CreatedAt = staff.CreatedAt
        };
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var staff = await _context.Staff.FindAsync(id);
        if (staff == null) return false;

        _context.Staff.Remove(staff);
        await _context.SaveChangesAsync();
        return true;
    }
}
