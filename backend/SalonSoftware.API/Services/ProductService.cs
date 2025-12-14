using Microsoft.EntityFrameworkCore;
using SalonSoftware.API.Data;
using SalonSoftware.API.DTOs;
using SalonSoftware.API.Models;

namespace SalonSoftware.API.Services;

public interface IProductService
{
    Task<List<ProductDto>> GetAllAsync();
    Task<ProductDto?> GetByIdAsync(Guid id);
    Task<ProductDto> CreateAsync(CreateProductDto dto);
    Task<ProductDto?> UpdateAsync(Guid id, UpdateProductDto dto);
    Task<bool> DeleteAsync(Guid id);
    Task<List<ProductDto>> GetLowStockProductsAsync();
}

public class ProductService : IProductService
{
    private readonly ApplicationDbContext _context;

    public ProductService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<ProductDto>> GetAllAsync()
    {
        return await _context.Products
            .OrderBy(p => p.Name)
            .Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Price = p.Price,
                StockQuantity = p.StockQuantity,
                OpeningStockQuantity = p.OpeningStockQuantity,
                OpeningStockDate = p.OpeningStockDate,
                CurrentStockQuantity = p.CurrentStockQuantity,
                CurrentStockDate = p.CurrentStockDate,
                ProductWeightUnit = p.ProductWeightUnit,
                ProductWeight = p.ProductWeight,
                Active = p.Active,
                CreatedAt = p.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<ProductDto?> GetByIdAsync(Guid id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return null;

        return new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Price = product.Price,
            StockQuantity = product.StockQuantity,
            OpeningStockQuantity = product.OpeningStockQuantity,
            OpeningStockDate = product.OpeningStockDate,
            CurrentStockQuantity = product.CurrentStockQuantity,
            CurrentStockDate = product.CurrentStockDate,
            ProductWeightUnit = product.ProductWeightUnit,
            ProductWeight = product.ProductWeight,
            Active = product.Active,
            CreatedAt = product.CreatedAt
        };
    }

    public async Task<ProductDto> CreateAsync(CreateProductDto dto)
    {
        var product = new Product
        {
            Name = dto.Name,
            Price = dto.Price,
            StockQuantity = dto.StockQuantity,
            OpeningStockQuantity = dto.OpeningStockQuantity,
            OpeningStockDate = dto.OpeningStockDate,
            CurrentStockQuantity = dto.CurrentStockQuantity,
            CurrentStockDate = dto.CurrentStockDate,
            ProductWeightUnit = dto.ProductWeightUnit,
            ProductWeight = dto.ProductWeight
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        return new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Price = product.Price,
            StockQuantity = product.StockQuantity,
            OpeningStockQuantity = product.OpeningStockQuantity,
            OpeningStockDate = product.OpeningStockDate,
            CurrentStockQuantity = product.CurrentStockQuantity,
            CurrentStockDate = product.CurrentStockDate,
            ProductWeightUnit = product.ProductWeightUnit,
            ProductWeight = product.ProductWeight,
            Active = product.Active,
            CreatedAt = product.CreatedAt
        };
    }

    public async Task<ProductDto?> UpdateAsync(Guid id, UpdateProductDto dto)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return null;

        product.Name = dto.Name;
        product.Price = dto.Price;
        product.StockQuantity = dto.StockQuantity;
        product.OpeningStockQuantity = dto.OpeningStockQuantity;
        product.OpeningStockDate = dto.OpeningStockDate;
        product.CurrentStockQuantity = dto.CurrentStockQuantity;
        product.CurrentStockDate = dto.CurrentStockDate;
        product.ProductWeightUnit = dto.ProductWeightUnit;
        product.ProductWeight = dto.ProductWeight;
        product.Active = dto.Active;

        await _context.SaveChangesAsync();

        return new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Price = product.Price,
            StockQuantity = product.StockQuantity,
            OpeningStockQuantity = product.OpeningStockQuantity,
            OpeningStockDate = product.OpeningStockDate,
            CurrentStockQuantity = product.CurrentStockQuantity,
            CurrentStockDate = product.CurrentStockDate,
            ProductWeightUnit = product.ProductWeightUnit,
            ProductWeight = product.ProductWeight,
            Active = product.Active,
            CreatedAt = product.CreatedAt
        };
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return false;

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<List<ProductDto>> GetLowStockProductsAsync()
    {
        return await _context.Products
            .Where(p => p.Active && p.CurrentStockQuantity != null &&
                ((p.ProductWeightUnit == "gm" && p.CurrentStockQuantity < 50) ||
                 (p.ProductWeightUnit == "ml" && p.CurrentStockQuantity < 50) ||
                 (p.ProductWeightUnit == "count" && p.CurrentStockQuantity < 5)))
            .OrderBy(p => p.CurrentStockQuantity)
            .Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Price = p.Price,
                StockQuantity = p.StockQuantity,
                OpeningStockQuantity = p.OpeningStockQuantity,
                OpeningStockDate = p.OpeningStockDate,
                CurrentStockQuantity = p.CurrentStockQuantity,
                CurrentStockDate = p.CurrentStockDate,
                ProductWeightUnit = p.ProductWeightUnit,
                ProductWeight = p.ProductWeight,
                Active = p.Active,
                CreatedAt = p.CreatedAt
            })
            .ToListAsync();
    }
}
