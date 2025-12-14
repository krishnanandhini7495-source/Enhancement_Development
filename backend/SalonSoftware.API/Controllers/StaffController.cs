using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SalonSoftware.API.DTOs;
using SalonSoftware.API.Services;

namespace SalonSoftware.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class StaffController : ControllerBase
{
    private readonly IStaffService _staffService;

    public StaffController(IStaffService staffService)
    {
        _staffService = staffService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var staff = await _staffService.GetAllAsync();
        return Ok(staff);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var staff = await _staffService.GetByIdAsync(id);
        if (staff == null)
            return NotFound();

        return Ok(staff);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CreateStaffDto dto)
    {
        var staff = await _staffService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = staff.Id }, staff);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateStaffDto dto)
    {
        var staff = await _staffService.UpdateAsync(id, dto);
        if (staff == null)
            return NotFound();

        return Ok(staff);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _staffService.DeleteAsync(id);
        if (!result)
            return NotFound();

        return NoContent();
    }

    [HttpGet("export/csv")]
    public async Task<IActionResult> ExportToCsv()
    {
        var staff = await _staffService.GetAllAsync();
        
        var csv = new System.Text.StringBuilder();
        csv.AppendLine("Name,Phone,Email,Address,Aadhar Number,Staff Category,Current Salary,Salary Effective Date,Bank Name,Account Number,IFSC Code,Status,Created Date");
        
        foreach (var s in staff)
        {
            csv.AppendLine($"\"{s.Name}\"," +
                $"\"{s.Phone ?? ""}\"," +
                $"\"{s.Email ?? ""}\"," +
                $"\"{s.Address ?? ""}\"," +
                $"\"{s.AadharNumber ?? ""}\"," +
                $"\"{s.StaffCategory ?? ""}\"," +
                $"{(s.CurrentSalary != null ? s.CurrentSalary.BasicSalary.ToString() : "")}," +
                $"{(s.CurrentSalary != null ? s.CurrentSalary.EffectiveFromDate.ToString("yyyy-MM-dd") : "")}," +
                $"\"{s.BankName ?? ""}\"," +
                $"\"{s.BankAccountNumber ?? ""}\"," +
                $"\"{s.IfscCode ?? ""}\"," +
                $"{(s.Active ? "Active" : "Inactive")}," +
                $"{s.CreatedAt:yyyy-MM-dd}");
        }
        
        var bytes = System.Text.Encoding.UTF8.GetBytes(csv.ToString());
        return File(bytes, "text/csv", $"staff_{DateTime.Now:yyyyMMdd_HHmmss}.csv");
    }
}
