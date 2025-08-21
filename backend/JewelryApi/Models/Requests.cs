namespace JewelryApi.Models;

/// <summary>
/// Request model for product customization price calculation
/// </summary>
public record CustomizationRequest
{
    /// <summary>
    /// Product identifier to customize
    /// </summary>
    public int ProductId { get; init; }
    
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
}

/// <summary>
/// Request model for checkout process
/// </summary>
public record OrderRequest
{
    /// <summary>
    /// Customer's full name
    /// </summary>
    public string CustomerName { get; init; } = string.Empty;
    
    /// <summary>
    /// Customer's email address
    /// </summary>
    public string CustomerEmail { get; init; } = string.Empty;
}
