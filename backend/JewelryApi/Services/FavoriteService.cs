using JewelryApi.Models;

namespace JewelryApi.Services;

/// <summary>
/// Service for managing favorites operations
/// </summary>
public class FavoriteService
{
    private readonly List<FavoriteItem> _favorites;

    public FavoriteService()
    {
        _favorites = new List<FavoriteItem>();
    }

    /// <summary>
    /// Gets all favorite items
    /// </summary>
    /// <returns>List of favorite items</returns>
    public IEnumerable<FavoriteItem> GetFavorites() => _favorites;

    /// <summary>
    /// Adds an item to favorites if it's not already present
    /// </summary>
    /// <param name="request">Favorite item to add</param>
    /// <returns>True if item was added, false if it was already in favorites</returns>
    public bool AddFavorite(AddFavoriteRequest request)
    {
        // Check if this exact design is already in favorites
        var isDuplicate = _favorites.Any(f => 
            f.ProductId == request.ProductId &&
            f.Metal == request.Metal &&
            f.Stone == request.Stone &&
            f.CaratSize == request.CaratSize &&
            f.RingSize == request.RingSize &&
            f.NecklaceSize == request.NecklaceSize);

        if (isDuplicate)
            return false;

        var favoriteItem = new FavoriteItem
        {
            Id = Guid.NewGuid().ToString(),
            ProductId = request.ProductId,
            ProductName = request.ProductName,
            Metal = request.Metal,
            Stone = request.Stone,
            CaratSize = request.CaratSize,
            RingSize = request.RingSize,
            NecklaceSize = request.NecklaceSize,
            Price = request.Price,
            CreatedAt = DateTime.UtcNow
        };

        _favorites.Add(favoriteItem);
        return true;
    }

    /// <summary>
    /// Removes an item from favorites by ID
    /// </summary>
    /// <param name="id">ID of the favorite item to remove</param>
    /// <returns>True if item was removed, false if ID was not found</returns>
    public bool RemoveFavorite(string id)
    {
        var favorite = _favorites.FirstOrDefault(f => f.Id == id);
        if (favorite == null)
            return false;

        _favorites.Remove(favorite);
        return true;
    }

    /// <summary>
    /// Gets the number of favorite items
    /// </summary>
    /// <returns>Favorite item count</returns>
    public int GetFavoriteCount() => _favorites.Count;

    /// <summary>
    /// Checks if a specific design is in favorites
    /// </summary>
    /// <param name="productId">Product ID</param>
    /// <param name="metal">Metal type</param>
    /// <param name="stone">Stone type</param>
    /// <param name="caratSize">Carat size</param>
    /// <param name="ringSize">Ring size (optional)</param>
    /// <param name="necklaceSize">Necklace size (optional)</param>
    /// <returns>True if the design is favorited</returns>
    public bool IsFavorited(int productId, string metal, string stone, string caratSize, string? ringSize = null, string? necklaceSize = null)
    {
        return _favorites.Any(f => 
            f.ProductId == productId &&
            f.Metal == metal &&
            f.Stone == stone &&
            f.CaratSize == caratSize &&
            f.RingSize == ringSize &&
            f.NecklaceSize == necklaceSize);
    }

    /// <summary>
    /// Updates the price of a favorite item
    /// </summary>
    /// <param name="id">ID of the favorite item</param>
    /// <param name="newPrice">New price</param>
    /// <returns>True if price was updated, false if item was not found</returns>
    public bool UpdatePrice(string id, decimal newPrice)
    {
        var favorite = _favorites.FirstOrDefault(f => f.Id == id);
        if (favorite == null)
            return false;

        // Since FavoriteItem is a record, we need to replace it
        var index = _favorites.IndexOf(favorite);
        if (index == -1)
            return false;

        var updatedFavorite = favorite with { Price = newPrice };
        _favorites[index] = updatedFavorite;
        return true;
    }

    /// <summary>
    /// Clears all favorite items
    /// </summary>
    public void ClearFavorites() => _favorites.Clear();
}
