namespace JewelryApi.Models;

/// <summary>
/// Represents a completed order with customer information and items
/// </summary>
public record Order
{
    /// <summary>
    /// Unique order identifier
    /// </summary>
    public Guid Id { get; init; }
    
    /// <summary>
    /// Customer's full name
    /// </summary>
    public string CustomerName { get; init; } = string.Empty;
    
    /// <summary>
    /// Customer's email address
    /// </summary>
    public string CustomerEmail { get; init; } = string.Empty;
    
    /// <summary>
    /// List of items in the order
    /// </summary>
    public List<CartItem> Items { get; init; } = new();
    
    /// <summary>
    /// Total order amount
    /// </summary>
    public decimal Total { get; init; }
    
    /// <summary>
    /// Order creation timestamp
    /// </summary>
    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
}
