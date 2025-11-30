using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SalonSoftware.API.DTOs;
using SalonSoftware.API.Services;

namespace SalonSoftware.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ServicesController : ControllerBase
{
    private readonly IServiceService _serviceService;

    public ServicesController(IServiceService serviceService)
    {
        _serviceService = serviceService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var services = await _serviceService.GetAllAsync();
        return Ok(services);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var service = await _serviceService.GetByIdAsync(id);
        if (service == null)
            return NotFound();

        return Ok(service);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CreateServiceDto dto)
    {
        var service = await _serviceService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = service.Id }, service);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateServiceDto dto)
    {
        var service = await _serviceService.UpdateAsync(id, dto);
        if (service == null)
            return NotFound();

        return Ok(service);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _serviceService.DeleteAsync(id);
        if (!result)
            return NotFound();

        return NoContent();
    }
}
