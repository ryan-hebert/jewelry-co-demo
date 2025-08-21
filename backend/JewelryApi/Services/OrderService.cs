using JewelryApi.Models;

namespace JewelryApi.Services;

/// <summary>
/// Service for managing order operations
/// </summary>
public class OrderService
{
    private readonly List<Order> _orders;
    private readonly EmailService _emailService;

    public OrderService(EmailService emailService)
    {
        _orders = new List<Order>();
        _emailService = emailService;
    }

    /// <summary>
    /// Creates a new order from cart items and customer information
    /// </summary>
    /// <param name="customerName">Customer's full name</param>
    /// <param name="customerEmail">Customer's email address</param>
    /// <param name="items">List of cart items</param>
    /// <returns>Created order</returns>
    public async Task<Order> CreateOrderAsync(string customerName, string customerEmail, List<CartItem> items)
    {
        var order = new Order
        {
            Id = Guid.NewGuid(),
            CustomerName = customerName,
            CustomerEmail = customerEmail,
            Items = new List<CartItem>(items),
            Total = items.Sum(item => item.Price)
        };

        _orders.Add(order);

        // Send confirmation email asynchronously (fire and forget)
        _ = Task.Run(async () =>
        {
            try
            {
                await _emailService.SendOrderConfirmationAsync(order);
            }
            catch (Exception ex)
            {
                // Log error but don't fail the order creation
                Console.WriteLine($"Failed to send confirmation email: {ex.Message}");
            }
        });

        return order;
    }

    /// <summary>
    /// Gets all orders
    /// </summary>
    /// <returns>List of all orders</returns>
    public IEnumerable<Order> GetAllOrders() => _orders;

    /// <summary>
    /// Gets an order by its ID
    /// </summary>
    /// <param name="orderId">Order identifier</param>
    /// <returns>Order if found, null otherwise</returns>
    public Order? GetOrderById(Guid orderId) => _orders.FirstOrDefault(o => o.Id == orderId);

    /// <summary>
    /// Gets the total number of orders
    /// </summary>
    /// <returns>Order count</returns>
    public int GetOrderCount() => _orders.Count;
}
