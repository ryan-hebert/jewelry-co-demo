# Jewelry API

A .NET 8 Minimal API for a jewelry customization e-commerce application.

## Features

- **Product Management**: Get available jewelry products
- **Price Customization**: Calculate dynamic prices based on metal, stone, and size selections
- **Shopping Cart**: Add, remove, and manage cart items
- **Order Processing**: Complete checkout process with customer information
- **Email Confirmations**: Send professional order confirmation emails via SendGrid
- **CORS Enabled**: Configured for cross-origin requests from frontend

## API Endpoints

### Products
- `GET /products` - Returns all available products

### Customization
- `POST /customize` - Calculates price for customized product
  - Body: `{ "productId": 1, "metal": "Gold", "stone": "Diamond", "size": "Medium" }`

### Cart
- `GET /cart` - Returns current cart items and total
- `POST /cart` - Adds item to cart
  - Body: `{ "productId": 1, "productName": "Ring Base", "metal": "Gold", "stone": "Diamond", "size": "Medium", "price": 800 }`
- `DELETE /cart/{index}` - Removes item at specified index

### Orders
- `POST /checkout` - Processes order and clears cart
  - Body: `{ "customerName": "John Doe", "customerEmail": "john@example.com" }`
- `GET /orders` - Returns all orders (for demo purposes)

### Health
- `GET /health` - Health check endpoint

## Pricing Rules

### Metals
- Silver: +$0
- Gold: +$100
- Platinum: +$200

### Stones
- None: +$0
- Diamond: +$500
- Ruby: +$300
- Sapphire: +$250

### Sizes
- Small: ×1.0
- Medium: ×1.2
- Large: ×1.5

## Email Configuration

To enable email confirmations, you need to set up SendGrid:

1. Create a free SendGrid account at [sendgrid.com](https://sendgrid.com)
2. Generate an API key in your SendGrid dashboard
3. Configure the API key in `appsettings.json` or `appsettings.Development.json`:
   ```json
   {
     "SendGrid": {
       "ApiKey": "your-sendgrid-api-key-here",
       "FromEmail": "noreply@yourdomain.com"
     }
   }
   ```
4. Verify your sender email address in SendGrid

**Note**: If no API key is configured, the application will still work but won't send emails.

## Running the Application

1. Ensure .NET 8 SDK is installed
2. Navigate to the project directory
3. Run the application:
   ```bash
   dotnet run
   ```
4. The API will be available at `http://localhost:5000`

## Project Structure

```
JewelryApi/
├── Models/           # Data models and DTOs
├── Services/         # Business logic services
├── Controllers/      # API controllers (if using traditional controllers)
├── Program.cs        # Main application entry point
└── README.md         # This file
```

## Technologies Used

- .NET 8
- ASP.NET Core Minimal APIs
- C# Records for immutable data models
- Dependency Injection
- CORS middleware
- SendGrid for email delivery
