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
}
