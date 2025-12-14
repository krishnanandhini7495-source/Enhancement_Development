using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SalonSoftware.API.Services;

namespace SalonSoftware.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly IInvoiceService _invoiceService;
    private readonly IProductService _productService;

    public DashboardController(IInvoiceService invoiceService, IProductService productService)
    {
        _invoiceService = invoiceService;
        _productService = productService;
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var stats = await _invoiceService.GetDashboardStatsAsync();
        stats.LowStockProducts = await _productService.GetLowStockProductsAsync();
        return Ok(stats);
    }
}
