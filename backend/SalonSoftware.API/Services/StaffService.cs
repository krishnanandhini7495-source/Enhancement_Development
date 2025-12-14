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
        var staff = await _context.Staff
            .Include(s => s.SalaryHistory)
            .OrderBy(s => s.Name)
            .ToListAsync();

        return staff.Select(s => new StaffDto
        {
            Id = s.Id,
            Name = s.Name,
            Phone = s.Phone,
            Email = s.Email,
            Address = s.Address,
            AadharNumber = s.AadharNumber,
            StaffCategory = s.StaffCategory,
            BankName = s.BankName,
            BankAccountNumber = s.BankAccountNumber,
            IfscCode = s.IfscCode,
            Active = s.Active,
            CreatedAt = s.CreatedAt,
            CurrentSalary = s.SalaryHistory
                .Where(sh => sh.EffectiveToDate == null)
                .Select(sh => new StaffSalaryHistoryDto
                {
                    Id = sh.Id,
                    StaffId = sh.StaffId,
                    BasicSalary = sh.BasicSalary,
                    EffectiveFromDate = sh.EffectiveFromDate,
                    EffectiveToDate = sh.EffectiveToDate,
                    CreatedAt = sh.CreatedAt
                })
                .FirstOrDefault()
        }).ToList();
    }

    public async Task<StaffDto?> GetByIdAsync(Guid id)
    {
        var staff = await _context.Staff
            .Include(s => s.SalaryHistory)
            .FirstOrDefaultAsync(s => s.Id == id);
        if (staff == null) return null;

        return new StaffDto
        {
            Id = staff.Id,
            Name = staff.Name,
            Phone = staff.Phone,
            Email = staff.Email,
            Address = staff.Address,
            AadharNumber = staff.AadharNumber,
            StaffCategory = staff.StaffCategory,
            BankName = staff.BankName,
            BankAccountNumber = staff.BankAccountNumber,
            IfscCode = staff.IfscCode,
            Active = staff.Active,
            CreatedAt = staff.CreatedAt,
            CurrentSalary = staff.SalaryHistory
                .Where(sh => sh.EffectiveToDate == null)
                .Select(sh => new StaffSalaryHistoryDto
                {
                    Id = sh.Id,
                    StaffId = sh.StaffId,
                    BasicSalary = sh.BasicSalary,
                    EffectiveFromDate = sh.EffectiveFromDate,
                    EffectiveToDate = sh.EffectiveToDate,
                    CreatedAt = sh.CreatedAt
                })
                .FirstOrDefault()
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
            AadharNumber = dto.AadharNumber,
            StaffCategory = dto.StaffCategory,
            BankName = dto.BankName,
            BankAccountNumber = dto.BankAccountNumber,
            IfscCode = dto.IfscCode
        };

        _context.Staff.Add(staff);
        
        // Add salary history if provided
        if (dto.BasicSalary.HasValue && dto.SalaryEffectiveDate.HasValue)
        {
            var salaryHistory = new StaffSalaryHistory
            {
                StaffId = staff.Id,
                BasicSalary = dto.BasicSalary.Value,
                EffectiveFromDate = dto.SalaryEffectiveDate.Value,
                EffectiveToDate = null
            };
            _context.StaffSalaryHistory.Add(salaryHistory);
        }
        
        await _context.SaveChangesAsync();

        return new StaffDto
        {
            Id = staff.Id,
            Name = staff.Name,
            Phone = staff.Phone,
            Email = staff.Email,
            Address = staff.Address,
            AadharNumber = staff.AadharNumber,
            StaffCategory = staff.StaffCategory,
            BankName = staff.BankName,
            BankAccountNumber = staff.BankAccountNumber,
            IfscCode = staff.IfscCode,
            Active = staff.Active,
            CreatedAt = staff.CreatedAt
        };
    }

    public async Task<StaffDto?> UpdateAsync(Guid id, UpdateStaffDto dto)
    {
        var staff = await _context.Staff
            .Include(s => s.SalaryHistory)
            .FirstOrDefaultAsync(s => s.Id == id);
        if (staff == null) return null;

        staff.Name = dto.Name;
        staff.Phone = dto.Phone;
        staff.Email = dto.Email;
        staff.Address = dto.Address;
        staff.AadharNumber = dto.AadharNumber;
        staff.StaffCategory = dto.StaffCategory;
        staff.BankName = dto.BankName;
        staff.BankAccountNumber = dto.BankAccountNumber;
        staff.IfscCode = dto.IfscCode;
        staff.Active = dto.Active;

        // Handle salary change
        if (dto.BasicSalary.HasValue && dto.SalaryEffectiveDate.HasValue)
        {
            var currentSalary = staff.SalaryHistory.FirstOrDefault(sh => sh.EffectiveToDate == null);
            
            // Check if salary is different
            if (currentSalary == null || currentSalary.BasicSalary != dto.BasicSalary.Value)
            {
                // Close previous salary record (set end date to 1 day before new effective date)
                if (currentSalary != null)
                {
                    currentSalary.EffectiveToDate = dto.SalaryEffectiveDate.Value.AddDays(-1);
                }

                // Add new salary record
                var newSalaryHistory = new StaffSalaryHistory
                {
                    StaffId = staff.Id,
                    BasicSalary = dto.BasicSalary.Value,
                    EffectiveFromDate = dto.SalaryEffectiveDate.Value,
                    EffectiveToDate = null
                };
                _context.StaffSalaryHistory.Add(newSalaryHistory);
            }
        }

        await _context.SaveChangesAsync();

        return new StaffDto
        {
            Id = staff.Id,
            Name = staff.Name,
            Phone = staff.Phone,
            Email = staff.Email,
            Address = staff.Address,
            AadharNumber = staff.AadharNumber,
            StaffCategory = staff.StaffCategory,
            BankName = staff.BankName,
            BankAccountNumber = staff.BankAccountNumber,
            IfscCode = staff.IfscCode,
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
