using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SalonSoftware.API.DTOs;
using SalonSoftware.API.Services;

namespace SalonSoftware.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductsController(IProductService productService)
    {
        _productService = productService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var products = await _productService.GetAllAsync();
        return Ok(products);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var product = await _productService.GetByIdAsync(id);
        if (product == null)
            return NotFound();

        return Ok(product);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CreateProductDto dto)
    {
        var product = await _productService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateProductDto dto)
    {
        var product = await _productService.UpdateAsync(id, dto);
        if (product == null)
            return NotFound();

        return Ok(product);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _productService.DeleteAsync(id);
        if (!result)
            return NotFound();

        return NoContent();
    }

    [HttpGet("low-stock")]
    public async Task<IActionResult> GetLowStock()
    {
        var products = await _productService.GetLowStockProductsAsync();
        return Ok(products);
    }

    [HttpGet("export/csv")]
    public async Task<IActionResult> ExportToCsv()
    {
        var products = await _productService.GetAllAsync();
        
        var csv = new System.Text.StringBuilder();
        csv.AppendLine("Name,Price,Stock Quantity,Opening Stock Quantity,Opening Stock Date,Current Stock Quantity,Current Stock Date,Product Weight,Weight Unit,Status,Created Date");
        
        foreach (var product in products)
        {
            csv.AppendLine($"\"{product.Name}\",{product.Price},{product.StockQuantity}," +
                $"{product.OpeningStockQuantity?.ToString() ?? ""}," +
                $"{product.OpeningStockDate?.ToString("yyyy-MM-dd") ?? ""}," +
                $"{product.CurrentStockQuantity?.ToString() ?? ""}," +
                $"{product.CurrentStockDate?.ToString("yyyy-MM-dd") ?? ""}," +
                $"{product.ProductWeight?.ToString() ?? ""}," +
                $"\"{product.ProductWeightUnit ?? ""}\"," +
                $"{(product.Active ? "Active" : "Inactive")}," +
                $"{product.CreatedAt:yyyy-MM-dd}");
        }
        
        var bytes = System.Text.Encoding.UTF8.GetBytes(csv.ToString());
        return File(bytes, "text/csv", $"products_{DateTime.Now:yyyyMMdd_HHmmss}.csv");
    }
}
