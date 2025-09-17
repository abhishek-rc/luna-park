# Shopify Integration for Luna Park

This document explains how to use the Shopify integration for product and checkout management in the Luna Park application.

## Overview

The Shopify integration allows you to:
- Sync products between Contentstack and Shopify using `card_key` and `product_key` mapping
- Display real-time product availability, pricing, and inventory
- Add products to cart and manage checkout
- Handle product variants and options

## Setup

### 1. Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# Shopify Configuration
SHOPIFY_SHOP_DOMAIN=your-shop-name.myshopify.com
SHOPIFY_ACCESS_TOKEN=your_access_token_here
SHOPIFY_API_KEY=your_api_key_here
SHOPIFY_API_SECRET=your_api_secret_here
SHOPIFY_API_VERSION=2024-10
SHOPIFY_APP_URL=https://your-app-domain.com
```

### 2. Shopify Store Setup

1. Create a Shopify store or use an existing one
2. Create a private app or custom app in your Shopify admin
3. Generate an access token with the following permissions:
   - `read_products`
   - `write_products`
   - `read_orders`
   - `write_orders`
   - `read_checkouts`
   - `write_checkouts`

### 3. Product Mapping

To sync products between Contentstack and Shopify:

1. In Contentstack, ensure your ticket cards have a `card_key` field
2. In Shopify, add a metafield to your products:
   - Namespace: `custom`
   - Key: `product_key`
   - Value: Should match the `card_key` from Contentstack

## Usage

### Basic Product Display

The `TicketBookingSection` component automatically enhances Contentstack products with Shopify data:

```tsx
import TicketBookingSection from './components/TicketBookingSection';

// The component will automatically:
// 1. Fetch products from Contentstack
// 2. Map them to Shopify products using card_key/product_key
// 3. Display real-time pricing, availability, and inventory
// 4. Provide add-to-cart functionality
```

### Using Shopify Hooks

#### Fetch Products

```tsx
import { useShopifyProducts } from './hooks/useShopifyProducts';

function MyComponent() {
    const { products, loading, error } = useShopifyProducts({
        cardKey: 'ticket-001', // Optional: filter by card key
        sortBy: 'price',
        sortOrder: 'asc'
    });

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            {products.map(product => (
                <div key={product.id}>
                    <h3>{product.title}</h3>
                    <p>Price: {formatPrice(product.variants[0].price)}</p>
                </div>
            ))}
        </div>
    );
}
```

#### Cart Management

```tsx
import { useCart } from './hooks/useShopifyCheckout';

function CartComponent() {
    const { 
        addToCart, 
        removeFromCart, 
        getCartItemCount, 
        getCartTotal 
    } = useCart();

    const handleAddToCart = async (product, variantId) => {
        const success = await addToCart(product, variantId, 1);
        if (success) {
            alert('Added to cart!');
        }
    };

    return (
        <div>
            <p>Items in cart: {getCartItemCount()}</p>
            <p>Total: {formatPrice(getCartTotal().amount)}</p>
        </div>
    );
}
```

### Product Mapping Service

```tsx
import { ProductMappingService } from './services/ProductMappingService';

// Enhance Contentstack cards with Shopify data
const enhancedCards = await ProductMappingService.enhanceTicketCardsWithShopifyData(
    contentstackCards
);

// Get Shopify products for a specific card key
const shopifyProducts = await ProductMappingService.getShopifyProductsForCardKey('ticket-001');

// Validate product mapping
const validation = ProductMappingService.validateProductMapping(
    contentstackCards, 
    shopifyProducts
);
```

## API Reference

### ShopifyProductService

- `getAllProducts()`: Fetch all products from Shopify
- `getProductById(id)`: Get a specific product by ID
- `getProductByHandle(handle)`: Get a product by handle
- `getProductsByProductKey(key)`: Get products matching a product_key
- `searchProducts(query)`: Search products by title

### ShopifyCheckoutService

- `createCheckout(lineItems)`: Create a new checkout
- `getCheckout(id)`: Get checkout by ID
- `updateCheckoutLineItems(id, lineItems)`: Update checkout items

### Hooks

#### useShopifyProducts(options)
- `products`: Array of Shopify products
- `loading`: Loading state
- `error`: Error message
- `refetch()`: Refetch products

#### useCart()
- `addToCart(product, variantId, quantity)`: Add item to cart
- `removeFromCart(variantId)`: Remove item from cart
- `updateCartItemQuantity(variantId, quantity)`: Update item quantity
- `getCartItemCount()`: Get total items in cart
- `getCartTotal()`: Get cart total

## Features

### Real-time Data
- Product availability status
- Current pricing and inventory
- Automatic image fallbacks

### Cart Management
- Add/remove items
- Update quantities
- View cart total
- Checkout integration

### Product Mapping
- Automatic sync between Contentstack and Shopify
- Validation and error reporting
- Statistics and analytics

### Error Handling
- Graceful fallbacks when Shopify is unavailable
- User-friendly error messages
- Console logging for debugging

## Troubleshooting

### Common Issues

1. **Products not showing**: Check that `card_key` in Contentstack matches `product_key` in Shopify
2. **Cart not working**: Verify Shopify access token has correct permissions
3. **Images not loading**: Ensure product images are properly set in Shopify

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
```

This will log detailed information about API calls and data mapping.

## Security Notes

- Never expose Shopify access tokens in client-side code
- Use environment variables for all sensitive configuration
- Implement proper error handling to avoid exposing internal details
- Consider rate limiting for API calls

## Support

For issues or questions about the Shopify integration, please check:
1. Shopify API documentation
2. Console logs for error details
3. Network tab for API call status
