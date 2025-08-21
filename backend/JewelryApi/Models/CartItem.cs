namespace JewelryApi.Models;

/// <summary>
/// Represents an item in the shopping cart with customization details
/// </summary>
public record CartItem
{
    /// <summary>
    /// Product identifier
    /// </summary>
    public int ProductId { get; init; }
    
    /// <summary>
    /// Display name of the product
    /// </summary>
    public string ProductName { get; init; } = string.Empty;
    
    /// <summary>
    /// Selected metal type
    /// </summary>
    public string Metal { get; init; } = string.Empty;
    
    /// <summary>
    /// Selected stone type
    /// </summary>
    public string Stone { get; init; } = string.Empty;
    
    /// <summary>
    /// Selected carat size
    /// </summary>
    public string CaratSize { get; init; } = string.Empty;
    
    /// <summary>
    /// Selected ring size (optional)
    /// </summary>
    public string? RingSize { get; init; }
    
    /// <summary>
    /// Selected necklace length (optional)
    /// </summary>
    public string? NecklaceSize { get; init; }
    
    /// <summary>
    /// Final calculated price including customizations
    /// </summary>
    public decimal Price { get; init; }
}
