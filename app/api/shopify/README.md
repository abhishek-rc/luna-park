# Shopify API Routes

This directory contains Next.js API routes for Shopify integration. All routes handle server-side communication with Shopify APIs to avoid CORS issues.

## Routes

### Products

- **GET** `/api/shopify/products` - Fetch all products
- **GET** `/api/shopify/products/[id]` - Fetch product by ID
- **GET** `/api/shopify/products/search?q=query` - Search products
- **GET** `/api/shopify/products/by-key?cardKey=key` - Fetch products by card key

### Checkout

- **POST** `/api/shopify/checkout` - Create new checkout
- **GET** `/api/shopify/checkout/[id]` - Fetch checkout by ID
- **PUT** `/api/shopify/checkout/[id]` - Update checkout line items

## Response Format

All routes return a consistent response format:

```json
{
  "success": boolean,
  "data": any,
  "error": string | null,
  "count": number (for list endpoints)
}
```

## Error Handling

- **400** - Bad Request (missing required parameters)
- **404** - Not Found (resource doesn't exist)
- **500** - Internal Server Error (Shopify API errors)

## Environment Variables Required

- `SHOPIFY_SHOP_DOMAIN`
- `SHOPIFY_ACCESS_TOKEN`
- `SHOPIFY_STOREFRONT_ACCESS_TOKEN`
- `SHOPIFY_API_VERSION` (optional, defaults to 2024-10)
