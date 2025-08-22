# Jewelry Customizer - Micro E-Commerce App

A full-stack jewelry customization e-commerce application built with React + TypeScript (frontend) and .NET 8 Minimal API (backend).

## Features

- **Product Customization**: Choose jewelry type, metal, stone, and size with real-time price calculation
- **Favorites System**: Save your favorite designs with heart icon and view them in a dedicated favorites page
- **Shopping Cart**: Add, remove, and manage cart items with live total updates
- **Checkout Process**: Complete order flow with customer information
- **Order Confirmation**: Detailed order summary with order ID and customer details
- **Responsive Design**: Modern, mobile-friendly UI with beautiful animations
- **Type Safety**: Full TypeScript implementation for both frontend and backend
- **localStorage Persistence**: Favorites persist across browser sessions
- **Intelligent Caching**: Metal prices cached for 24 hours to minimize API calls

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development and building
- **CSS3** with modern styling and responsive design
- **Fetch API** for HTTP requests

### Backend
- **.NET 8** Minimal API
- **C#** with modern language features
- **In-memory data storage** (no database required)
- **CORS enabled** for cross-origin requests

## Project Structure

```
jewelry-customizer/
├── backend/
│   └── JewelryApi/
│       ├── Models/           # Data models and DTOs
│       ├── Services/         # Business logic services
│       ├── Controllers/      # API controllers
│       ├── Program.cs        # Main application entry point
│       └── README.md         # Backend documentation
├── src/
│   ├── components/           # React components
│   ├── services/             # API service layer
│   ├── types/                # TypeScript type definitions
│   ├── App.tsx              # Main React component
│   ├── App.css              # Application styles
│   └── main.tsx             # React entry point
├── .env                     # Environment variables
└── README.md               # This file
```

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- .NET 8 SDK

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend/JewelryApi
   ```

2. Run the backend API:
   ```bash
   dotnet run --urls "http://localhost:5001"
   ```

3. The API will be available at `http://localhost:5001`

### Frontend Setup
1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and add your Metals.Dev API key:
   ```
   VITE_API_URL=http://localhost:5001
   VITE_METALSDEV_API_KEY=your_metalsdev_api_key
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. The application will be available at `http://localhost:5173`

## API Endpoints

### Products
- `GET /products` - Returns all available products

### Customization
- `POST /customize` - Calculates price for customized product
  ```json
  {
    "productId": 1,
    "metal": "Gold",
    "stone": "Diamond",
    "size": "Medium"
  }
  ```

### Cart
- `GET /cart` - Returns current cart items and total
- `POST /cart` - Adds item to cart
- `DELETE /cart/{index}` - Removes item at specified index

### Favorites
- `GET /favorites` - Returns user's favorite designs
- `POST /favorites` - Adds design to favorites
- `DELETE /favorites/{id}` - Removes design from favorites
- `GET /favorites/check` - Checks if a design is favorited

### Orders
- `POST /checkout` - Processes order and clears cart
- `GET /orders` - Returns all orders (for demo purposes)

### Health
- `GET /health` - Health check endpoint

## Pricing Rules

### Metals
- **Silver**: +$0
- **Gold**: +$100
- **Platinum**: +$200

### Stones
- **None**: +$0
- **Diamond**: +$500
- **Ruby**: +$300
- **Sapphire**: +$250

### Sizes
- **Small**: ×1.0
- **Medium**: ×1.2
- **Large**: ×1.5

### Example Calculation
Ring Base ($200) + Gold ($100) + Diamond ($500) + Medium Size (×1.2) = **$960**

## User Flow

1. **Product Selection**: Choose between Ring Base or Necklace Base
2. **Customization**: Select metal type, stone, and size
3. **Price Calculation**: Real-time price updates as you customize
4. **Add to Favorites**: Click heart icon to save your favorite designs
5. **View Favorites**: Navigate to favorites page to see all saved designs
6. **Add to Cart**: Add customized item to shopping cart
7. **Cart Management**: Review items, remove if needed, see total
8. **Checkout**: Enter customer information (name and email)
9. **Order Confirmation**: View order details and confirmation

## Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Import repository in Vercel
3. Set environment variable `VITE_API_URL` to your deployed backend URL
4. Deploy

### Backend (Render)
1. Deploy .NET project to Render free tier
2. Copy the public API URL
3. Update frontend environment variable with the new backend URL

## Testing

### Backend Testing
```bash
cd backend/JewelryApi
dotnet test
```

### Frontend Testing
```bash
npm test
```

### Manual Testing
1. Start both backend and frontend
2. Navigate through the complete user flow
3. Test all customization options
4. Verify cart operations
5. Complete checkout process

## Development

### Adding New Products
Edit `ProductService.cs` in the backend to add new products to the catalog.

### Adding New Customization Options
Update the pricing dictionaries in `PricingService.cs` and the frontend type definitions.

### Styling Changes
Modify `src/App.css` for styling updates. The app uses modern CSS with flexbox and grid layouts.

## License

This project is created as a demo for interview purposes.


---

**Built with React, TypeScript, and .NET 8**
