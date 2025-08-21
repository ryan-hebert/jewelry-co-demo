using JewelryApi.Models;

namespace JewelryApi.Services;

/// <summary>
/// Service for managing shopping cart operations
/// </summary>
public class CartService
{
    private readonly List<CartItem> _cart;

    public CartService()
    {
        _cart = new List<CartItem>();
    }

    /// <summary>
    /// Gets all items in the cart
    /// </summary>
    /// <returns>List of cart items</returns>
    public IEnumerable<CartItem> GetCartItems() => _cart;

    /// <summary>
    /// Adds an item to the cart
    /// </summary>
    /// <param name="item">Cart item to add</param>
    public void AddItem(CartItem item)
    {
        _cart.Add(item);
    }

    /// <summary>
    /// Removes an item from the cart by index
    /// </summary>
    /// <param name="index">Index of the item to remove</param>
    /// <returns>True if item was removed, false if index was invalid</returns>
    public bool RemoveItem(int index)
    {
        if (index < 0 || index >= _cart.Count)
            return false;

        _cart.RemoveAt(index);
        return true;
    }

    /// <summary>
    /// Calculates the total price of all items in the cart
    /// </summary>
    /// <returns>Total cart value</returns>
    public decimal GetCartTotal() => _cart.Sum(item => item.Price);

    /// <summary>
    /// Gets the number of items in the cart
    /// </summary>
    /// <returns>Cart item count</returns>
    public int GetCartItemCount() => _cart.Count;

    /// <summary>
    /// Clears all items from the cart
    /// </summary>
    public void ClearCart() => _cart.Clear();

    /// <summary>
    /// Gets all cart items and clears the cart
    /// </summary>
    /// <returns>List of cart items</returns>
    public List<CartItem> GetAndClearCart()
    {
        var items = new List<CartItem>(_cart);
        _cart.Clear();
        return items;
    }
}
