# Shopify Integration Setup Guide

This guide will help you set up the Shopify integration for your Luna Park application.

## Prerequisites

1. A Shopify store (development or production)
2. Admin access to your Shopify store
3. Access to create private apps or use the Shopify Partner Dashboard

## Step 1: Create Shopify Private App

### Option A: Using Shopify Admin (Recommended for Development)

1. Go to your Shopify Admin Dashboard
2. Navigate to **Apps** → **App and sales channel settings**
3. Click **Develop apps** → **Create an app**
4. Give your app a name (e.g., "Luna Park Integration")
5. Click **Create app**

### Option B: Using Shopify Partner Dashboard (For Production)

1. Go to [Shopify Partners](https://partners.shopify.com/)
2. Create a new app
3. Configure the app settings

## Step 2: Configure API Access

### Admin API Access

1. In your app settings, go to **Configuration** → **Admin API access**
2. Enable the following scopes:
   - `read_products` - To fetch products
   - `read_product_listings` - To read product listings
   - `read_orders` - To read orders (optional)
   - `read_checkouts` - To read checkouts (optional)

3. Click **Save**
4. Click **Install app** to generate the Admin API access token

### Storefront API Access

1. In your app settings, go to **Configuration** → **Storefront API access**
2. Enable the following scopes:
   - `unauthenticated_read_product_listings` - To read products on the storefront
   - `unauthenticated_read_product_inventory` - To read product inventory
   - `unauthenticated_write_checkouts` - To create and update checkouts
   - `unauthenticated_read_checkouts` - To read checkouts

3. Click **Save**
4. Copy the **Storefront access token**

## Step 3: Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Shopify Configuration
SHOPIFY_SHOP_DOMAIN=your-shop-name.myshopify.com
SHOPIFY_ACCESS_TOKEN=your_admin_api_access_token
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token
SHOPIFY_API_VERSION=2024-10
```

### How to Get These Values:

1. **SHOPIFY_SHOP_DOMAIN**: Your shop's domain (e.g., `my-shop.myshopify.com`)
2. **SHOPIFY_ACCESS_TOKEN**: The Admin API access token from Step 2
3. **SHOPIFY_STOREFRONT_ACCESS_TOKEN**: The Storefront API access token from Step 2
4. **SHOPIFY_API_VERSION**: Use `2024-10` (latest stable version)

## Step 4: Product Setup

### Add Product Metafields

To link Contentstack cards with Shopify products, you need to add metafields to your products:

1. Go to **Settings** → **Custom data** → **Products**
2. Click **Add definition**
3. Create a metafield with:
   - **Namespace and key**: `custom.product_key`
   - **Name**: Product Key
   - **Description**: Links to Contentstack card_key
   - **Type**: Single line text
   - **Access**: Public (for Storefront API)

### Set Product Keys

1. Go to **Products** in your Shopify admin
2. Edit each product you want to link
3. Scroll down to **Metafields**
4. Set the **Product Key** to match the `card_key` from your Contentstack entries

## Step 5: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Check the browser console for Shopify configuration messages:
   - ✅ `Shopify configuration is valid` - Configuration is correct
   - ❌ Error messages - Check your environment variables

3. Test product fetching by visiting the ticket booking section

## Troubleshooting

### Common Issues

1. **"Shopify is not properly configured"**
   - Check that all environment variables are set
   - Verify the shop domain format (should end with `.myshopify.com`)
   - Ensure tokens are copied correctly

2. **"Failed to fetch products: 401 Unauthorized"**
   - Check your Admin API access token
   - Verify the token has the correct permissions
   - Make sure the app is installed

3. **"Failed to create checkout: 401 Unauthorized"**
   - Check your Storefront API access token
   - Verify the token has checkout permissions
   - Ensure the token is for the Storefront API, not Admin API

4. **"No products found"**
   - Check that products exist in your Shopify store
   - Verify products are published
   - Check that metafields are set correctly

### Debug Mode

To enable debug logging, add this to your `.env.local`:

```env
NODE_ENV=development
```

This will show detailed error messages in the console.

## API Limits

- **Admin API**: 2 calls per second per app
- **Storefront API**: 2 calls per second per IP address
- **Rate limiting**: The app includes automatic retry logic for rate limits

## Security Notes

- Never commit your `.env.local` file to version control
- Use different tokens for development and production
- Regularly rotate your API tokens
- Use the minimum required permissions for your app

## Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify your Shopify app configuration
3. Test API calls using tools like Postman
4. Check Shopify's API documentation for the latest changes

## Next Steps

Once the integration is working:

1. Set up product metafields to link with Contentstack
2. Configure inventory management
3. Set up webhooks for real-time updates (optional)
4. Implement error handling and retry logic
5. Add analytics and monitoring
