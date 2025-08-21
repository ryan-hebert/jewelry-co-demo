using JewelryApi.Models;
using JewelryApi.Services;

var builder = WebApplication.CreateBuilder(args);

// Add CORS policy
builder.Services.AddCors(options => options.AddDefaultPolicy(policy =>
    policy.WithOrigins("https://jewelry-customizer-emclbgodi-ryans-projects-dc24d5e5.vercel.app", 
                      "https://jewelry-customizer-1xqlq051g-ryans-projects-dc24d5e5.vercel.app",
                      "http://localhost:5173",
                      "http://localhost:3000")
          .AllowAnyHeader()
          .AllowAnyMethod()
          .AllowCredentials()));

// Register services
builder.Services.AddSingleton<ProductService>();
builder.Services.AddSingleton<PricingService>();
builder.Services.AddSingleton<CartService>();
builder.Services.AddSingleton<EmailService>();
builder.Services.AddSingleton<OrderService>();

var app = builder.Build();

// Configure middleware
app.UseCors();

// API Endpoints

// GET /products - Returns all available products
app.MapGet("/products", (ProductService productService) =>
{
    var products = productService.GetAllProducts();
    return Results.Ok(products);
})
.WithName("GetProducts");

// POST /customize - Calculates price for customized product
app.MapPost("/customize", (CustomizationRequest request, ProductService productService, PricingService pricingService) =>
{
    var product = productService.GetProductById(request.ProductId);
    if (product == null)
        return Results.NotFound("Product not found");

    var finalPrice = pricingService.CalculatePrice(
        product.BasePrice, 
        request.Metal, 
        request.Stone, 
        request.CaratSize, 
        request.RingSize,
        request.NecklaceSize);

    return Results.Ok(new 
    { 
        Product = product.Name, 
        FinalPrice = finalPrice,
        Customizations = new
        {
            Metal = request.Metal,
            Stone = request.Stone,
            CaratSize = request.CaratSize,
            RingSize = request.RingSize,
            NecklaceSize = request.NecklaceSize
        }
    });
})
.WithName("CustomizeProduct");

// GET /cart - Returns current cart items
app.MapGet("/cart", (CartService cartService) =>
{
    var items = cartService.GetCartItems();
    var total = cartService.GetCartTotal();
    
    return Results.Ok(new 
    { 
        Items = items, 
        Total = total,
        ItemCount = cartService.GetCartItemCount()
    });
})
.WithName("GetCart");

// POST /cart - Adds item to cart
app.MapPost("/cart", (CartItem item, CartService cartService, ProductService productService) =>
{
    // Validate that the product exists
    if (!productService.ProductExists(item.ProductId))
        return Results.BadRequest("Invalid product ID");

    cartService.AddItem(item);
    
    var updatedCart = cartService.GetCartItems();
    var total = cartService.GetCartTotal();
    
    return Results.Ok(new 
    { 
        Items = updatedCart, 
        Total = total,
        ItemCount = cartService.GetCartItemCount()
    });
})
.WithName("AddToCart");

// DELETE /cart/{index} - Removes item from cart
app.MapDelete("/cart/{index}", (int index, CartService cartService) =>
{
    var removed = cartService.RemoveItem(index);
    if (!removed)
        return Results.NotFound("Item not found");

    var updatedCart = cartService.GetCartItems();
    var total = cartService.GetCartTotal();
    
    return Results.Ok(new 
    { 
        Items = updatedCart, 
        Total = total,
        ItemCount = cartService.GetCartItemCount()
    });
})
.WithName("RemoveFromCart");

// POST /checkout - Processes order and clears cart
app.MapPost("/checkout", async (OrderRequest request, CartService cartService, OrderService orderService) =>
{
    var cartItems = cartService.GetCartItems().ToList();
    
    if (!cartItems.Any())
        return Results.BadRequest("Cart is empty");

    var order = await orderService.CreateOrderAsync(
        request.CustomerName, 
        request.CustomerEmail, 
        cartItems);

    // Clear the cart after successful order
    cartService.ClearCart();

    return Results.Ok(order);
})
.WithName("Checkout");

// GET /orders - Returns all orders (for demo purposes)
app.MapGet("/orders", (OrderService orderService) =>
{
    var orders = orderService.GetAllOrders();
    return Results.Ok(orders);
})
.WithName("GetOrders");

// Health check endpoint
app.MapGet("/health", () => Results.Ok(new { Status = "Healthy", Timestamp = DateTime.UtcNow }))
.WithName("HealthCheck");

// Test email endpoint (for development only)
app.MapPost("/test-email", async (EmailService emailService) =>
{
    var testOrder = new Order
    {
        Id = Guid.NewGuid(),
        CustomerName = "Test Customer",
        CustomerEmail = "test@example.com",
        Items = new List<CartItem>
        {
            new CartItem
            {
                ProductId = 1,
                ProductName = "Ring Base",
                Metal = "Gold",
                Stone = "Diamond",
                CaratSize = "2ct",
                RingSize = "7",
                Price = 800
            }
        },
        Total = 800,
        CreatedAt = DateTime.UtcNow
    };

    var success = await emailService.SendOrderConfirmationAsync(testOrder);
    return Results.Ok(new { EmailSent = success, OrderId = testOrder.Id });
})
.WithName("TestEmail");

app.Run();
