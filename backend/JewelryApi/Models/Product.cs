namespace JewelryApi.Models;

/// <summary>
/// Represents a base jewelry product in the catalog
/// </summary>
public record Product
{
    /// <summary>
    /// Unique identifier for the product
    /// </summary>
    public int Id { get; init; }
    
    /// <summary>
    /// Display name of the product
    /// </summary>
    public string Name { get; init; } = string.Empty;
    
    /// <summary>
    /// Base price of the product before customizations
    /// </summary>
    public decimal BasePrice { get; init; }
}
