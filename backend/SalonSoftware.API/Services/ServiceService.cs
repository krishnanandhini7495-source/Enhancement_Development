using Microsoft.EntityFrameworkCore;
using SalonSoftware.API.Data;
using SalonSoftware.API.DTOs;
using SalonSoftware.API.Models;

namespace SalonSoftware.API.Services;

public interface IServiceService
{
    Task<List<ServiceDto>> GetAllAsync();
    Task<ServiceDto?> GetByIdAsync(Guid id);
    Task<ServiceDto> CreateAsync(CreateServiceDto dto);
    Task<ServiceDto?> UpdateAsync(Guid id, UpdateServiceDto dto);
    Task<bool> DeleteAsync(Guid id);
}

public class ServiceService : IServiceService
{
    private readonly ApplicationDbContext _context;

    public ServiceService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<ServiceDto>> GetAllAsync()
    {
        return await _context.Services
            .OrderBy(s => s.Name)
            .Select(s => new ServiceDto
            {
                Id = s.Id,
                Name = s.Name,
                BasePrice = s.BasePrice,
                Active = s.Active,
                CreatedAt = s.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<ServiceDto?> GetByIdAsync(Guid id)
    {
        var service = await _context.Services.FindAsync(id);
        if (service == null) return null;

        return new ServiceDto
        {
            Id = service.Id,
            Name = service.Name,
            BasePrice = service.BasePrice,
            Active = service.Active,
            CreatedAt = service.CreatedAt
        };
    }

    public async Task<ServiceDto> CreateAsync(CreateServiceDto dto)
    {
        var service = new Service
        {
            Name = dto.Name,
            BasePrice = dto.BasePrice
        };

        _context.Services.Add(service);
        await _context.SaveChangesAsync();

        return new ServiceDto
        {
            Id = service.Id,
            Name = service.Name,
            BasePrice = service.BasePrice,
            Active = service.Active,
            CreatedAt = service.CreatedAt
        };
    }

    public async Task<ServiceDto?> UpdateAsync(Guid id, UpdateServiceDto dto)
    {
        var service = await _context.Services.FindAsync(id);
        if (service == null) return null;

        service.Name = dto.Name;
        service.BasePrice = dto.BasePrice;
        service.Active = dto.Active;

        await _context.SaveChangesAsync();

        return new ServiceDto
        {
            Id = service.Id,
            Name = service.Name,
            BasePrice = service.BasePrice,
            Active = service.Active,
            CreatedAt = service.CreatedAt
        };
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var service = await _context.Services.FindAsync(id);
        if (service == null) return false;

        _context.Services.Remove(service);
        await _context.SaveChangesAsync();
        return true;
    }
}
