using JewelryApi.Models;

namespace JewelryApi.Services;

/// <summary>
/// Service for managing jewelry products
/// </summary>
public class ProductService
{
    private readonly List<Product> _products;

    public ProductService()
    {
        // Initialize product catalog
        _products = new List<Product>
        {
            new Product { Id = 1, Name = "Ring Base", BasePrice = 200 },
            new Product { Id = 2, Name = "Necklace Base", BasePrice = 150 }
        };
    }

    /// <summary>
    /// Gets all available products
    /// </summary>
    /// <returns>List of all products</returns>
    public IEnumerable<Product> GetAllProducts() => _products;

    /// <summary>
    /// Gets a product by its ID
    /// </summary>
    /// <param name="id">Product identifier</param>
    /// <returns>Product if found, null otherwise</returns>
    public Product? GetProductById(int id) => _products.FirstOrDefault(p => p.Id == id);

    /// <summary>
    /// Checks if a product exists
    /// </summary>
    /// <param name="id">Product identifier</param>
    /// <returns>True if product exists, false otherwise</returns>
    public bool ProductExists(int id) => _products.Any(p => p.Id == id);
}
