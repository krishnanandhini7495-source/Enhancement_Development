using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SalonSoftware.API.Data;
using SalonSoftware.API.DTOs;
using SalonSoftware.API.Models;

namespace SalonSoftware.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SettingsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<SettingsController> _logger;

    public SettingsController(ApplicationDbContext context, ILogger<SettingsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<SalonSettingsDto>> GetSettings()
    {
        try
        {
            var settings = await _context.SalonSettings.FirstOrDefaultAsync();
            
            if (settings == null)
            {
                // Create default settings if none exist
                settings = new SalonSettings
                {
                    SalonName = "Elegant Salon",
                    MainAddress = "123 Beauty Street, City, State - 400001",
                    BranchAddresses = "[]",
                    Phone = "+91 98765 43210",
                    Email = "info@elegantssalon.com"
                };
                _context.SalonSettings.Add(settings);
                await _context.SaveChangesAsync();
            }

            var branches = new List<BranchDetailsDto>();
            try
            {
                if (!string.IsNullOrWhiteSpace(settings.BranchAddresses))
                {
                    branches = System.Text.Json.JsonSerializer.Deserialize<List<BranchDetailsDto>>(settings.BranchAddresses) ?? new List<BranchDetailsDto>();
                }
            }
            catch
            {
                branches = new List<BranchDetailsDto>();
            }

            return Ok(new SalonSettingsDto
            {
                Id = settings.Id,
                SalonName = settings.SalonName,
                MainAddress = settings.MainAddress,
                BranchAddresses = branches,
                Phone = settings.Phone,
                Email = settings.Email,
                LogoUrl = settings.LogoUrl
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching salon settings");
            return StatusCode(500, "Error fetching salon settings");
        }
    }

    [HttpPut]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<SalonSettingsDto>> UpdateSettings([FromBody] UpdateSalonSettingsDto dto)
    {
        try
        {
            var settings = await _context.SalonSettings.FirstOrDefaultAsync();
            
            if (settings == null)
            {
                settings = new SalonSettings();
                _context.SalonSettings.Add(settings);
            }

            settings.SalonName = dto.SalonName;
            settings.MainAddress = dto.MainAddress;
            settings.BranchAddresses = System.Text.Json.JsonSerializer.Serialize(dto.BranchAddresses ?? new List<BranchDetailsDto>());
            settings.Phone = dto.Phone;
            settings.Email = dto.Email;
            settings.LogoUrl = dto.LogoUrl;
            settings.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new SalonSettingsDto
            {
                Id = settings.Id,
                SalonName = settings.SalonName,
                MainAddress = settings.MainAddress,
                BranchAddresses = dto.BranchAddresses ?? new List<BranchDetailsDto>(),
                Phone = settings.Phone,
                Email = settings.Email,
                LogoUrl = settings.LogoUrl
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating salon settings");
            return StatusCode(500, "Error updating salon settings");
        }
    }
}
