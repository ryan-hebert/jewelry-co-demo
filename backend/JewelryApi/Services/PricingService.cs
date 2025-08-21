namespace JewelryApi.Services;

/// <summary>
/// Service for calculating jewelry prices based on customizations
/// </summary>
public class PricingService
{
    private readonly Dictionary<string, decimal> _metalPrices;
    private readonly Dictionary<string, decimal> _stonePrices;
    private readonly Dictionary<string, decimal> _caratPrices;

    public PricingService()
    {
        // Initialize pricing rules
        _metalPrices = new Dictionary<string, decimal>
        {
            { "Silver", 0 },
            { "Gold", 100 },
            { "Rose Gold", 150 }
        };

        // Diamonds are now included by default in all jewelry
        _stonePrices = new Dictionary<string, decimal>
        {
            { "Diamond", 500 }
        };

        _caratPrices = new Dictionary<string, decimal>
        {
            { "1ct", 1000 },
            { "2ct", 2500 },
            { "3ct", 4500 }
        };
    }

    /// <summary>
    /// Calculates the final price for a customized jewelry item
    /// </summary>
    /// <param name="basePrice">Base price of the product</param>
    /// <param name="metal">Selected metal type</param>
    /// <param name="stone">Selected stone type</param>
    /// <param name="caratSize">Selected carat size</param>
    /// <param name="ringSize">Selected ring size (optional, doesn't affect pricing)</param>
    /// <param name="necklaceSize">Selected necklace length (optional, doesn't affect pricing)</param>
    /// <returns>Final calculated price</returns>
    public decimal CalculatePrice(decimal basePrice, string metal, string stone, string caratSize, string? ringSize = null, string? necklaceSize = null)
    {
        var price = basePrice;
        
        // Add metal cost
        price += _metalPrices.GetValueOrDefault(metal, 0);
        
        // Add diamond cost (included by default)
        price += _stonePrices.GetValueOrDefault("Diamond", 0);
        
        // Add carat size cost (multiplier for stone size)
        price += _caratPrices.GetValueOrDefault(caratSize, 0);
        
        // Note: Ring size and necklace size don't affect pricing as per requirements
        
        return Math.Round(price, 2);
    }

    /// <summary>
    /// Gets available metal options
    /// </summary>
    public IEnumerable<string> GetAvailableMetals() => _metalPrices.Keys;

    /// <summary>
    /// Gets available stone options
    /// </summary>
    public IEnumerable<string> GetAvailableStones() => _stonePrices.Keys;

    /// <summary>
    /// Gets available carat size options
    /// </summary>
    public IEnumerable<string> GetAvailableCaratSizes() => _caratPrices.Keys;

    /// <summary>
    /// Gets available ring size options
    /// </summary>
    public IEnumerable<string> GetAvailableRingSizes() => new[] { "5", "6", "7", "8", "9", "10" };
}
