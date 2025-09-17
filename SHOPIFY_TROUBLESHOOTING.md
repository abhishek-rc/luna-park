# Shopify Integration Troubleshooting Guide

This guide helps you diagnose and fix issues with the Shopify integration in your Luna Park application.

## Quick Diagnosis

Run the configuration checker to identify issues:

```bash
npm run check-shopify
```

## Common Issues and Solutions

### 1. "Shopify is not properly configured" Error

**Symptoms:**
- Console shows "❌ Shopify configuration errors"
- Orders fail to create
- CORS errors when calling Shopify Admin API from browser

**Causes:**
- Missing `.env.local` file
- Environment variables not set
- Placeholder values in configuration

**Solutions:**

1. **Create environment file:**
   ```bash
   npm run setup-shopify
   ```

2. **Update `.env.local` with real values:**
   ```env
   SHOPIFY_SHOP_DOMAIN=your-actual-shop.myshopify.com
   SHOPIFY_ACCESS_TOKEN=your_actual_admin_token
   SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_actual_storefront_token
   ```

3. **Verify configuration:**
   ```bash
   npm run check-shopify
   ```

### 2. "Failed to create checkout in Shopify" Error

**Symptoms:**
- Orders fail with Shopify API errors
- GraphQL errors in console
- 401/403 HTTP status codes

**Causes:**
- Invalid access tokens
- Insufficient API permissions
- Incorrect shop domain

**Solutions:**

1. **Verify shop domain format:**
   - Must be: `your-shop.myshopify.com`
   - Not: `https://your-shop.myshopify.com`

2. **Check API token permissions:**
   - Admin API: `read_products`, `read_product_listings`
   - Storefront API: `unauthenticated_read_product_listings`, `unauthenticated_write_checkouts`

3. **Regenerate tokens if needed:**
   - Go to Shopify Admin → Apps → App and sales channel settings
   - Find your app → Configuration
   - Regenerate tokens

### 3. "GraphQL errors" in Console

**Symptoms:**
- GraphQL errors in browser console
- Specific error messages about mutations

**Common GraphQL Errors:**

1. **"Field 'checkoutCreate' doesn't exist"**
   - **Solution:** Your Shopify API version doesn't support checkoutCreate
   - **Fix:** Update `SHOPIFY_API_VERSION=2024-01` or later

2. **"Access denied for field"**
   - **Solution:** Insufficient API permissions
   - **Fix:** Update app permissions in Shopify Admin

3. **"Invalid variant ID"**
   - **Solution:** Product variants don't exist or are unavailable
   - **Fix:** Check product inventory in Shopify Admin

### 4. Orders Created but Not Visible in Shopify

**Symptoms:**
- Success page shows order created
- No order appears in Shopify Admin
- Checkout URL doesn't work

**Causes:**
- Using cartCreate instead of checkoutCreate
- Checkout not completed
- Payment not processed

**Solutions:**

1. **Check if using cartCreate:**
   - CartCreate creates a cart, not an order
   - Orders are only created after payment completion

2. **Verify checkout flow:**
   - User must complete payment on Shopify checkout page
   - Only then will order appear in Shopify Admin

### 5. Development vs Production Issues

**Development Mode:**
- Server-side API routes now handle order creation
- Now returns actual Shopify API errors
- Use test products and variants

**Production Mode:**
- Always uses real Shopify API
- Requires valid production credentials
- Test with small orders first

## Architecture Overview

### Server-Side API Routes
The application now uses Next.js API routes to handle Shopify Admin API calls:

- **`/api/orders/create`** - Creates orders in Shopify Admin
- **Client-side code** calls our API routes (no CORS issues)
- **API routes** call Shopify Admin API (server-to-server)
- **Real orders** are created in Shopify Admin dashboard

### Flow Diagram
```
Browser → /api/orders/create → Shopify Admin API → Real Order Created
```

## Testing Your Integration

### 1. Test Configuration
```bash
npm run check-shopify
```

### 2. Test Product Fetching
Check if products load on the homepage:
- Visit `/`
- Check browser console for Shopify errors
- Verify products display with prices

### 3. Test Order Creation
1. Add items to cart
2. Go through checkout process
3. Complete payment form
4. Verify order is created in Shopify Admin
5. Check success page shows order number

### 4. Test Complete Flow
1. Create test order with small amount
2. Complete payment form
3. Verify order appears in Shopify Admin
4. Check success page displays correctly

## Environment Variables Reference

### Required Variables
```env
SHOPIFY_SHOP_DOMAIN=your-shop.myshopify.com
SHOPIFY_ACCESS_TOKEN=shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SHOPIFY_STOREFRONT_ACCESS_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Optional Variables
```env
SHOPIFY_API_VERSION=2024-01
SHOPIFY_APP_URL=http://localhost:3000
```

## Getting Help

### 1. Check Logs
- Browser console for client-side errors
- Server console for API errors
- Network tab for HTTP requests

### 2. Verify Shopify Setup
- Follow `SHOPIFY_SETUP.md` guide
- Ensure app has correct permissions
- Test with Shopify's GraphQL explorer

### 3. Common Debug Commands
```bash
# Check configuration
npm run check-shopify

# View environment variables (be careful with tokens)
node -e "console.log(process.env.SHOPIFY_SHOP_DOMAIN)"

# Test GraphQL query manually
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Shopify-Storefront-Access-Token: YOUR_TOKEN" \
  -d '{"query": "{ shop { name } }"}' \
  https://YOUR_SHOP.myshopify.com/api/2024-01/graphql.json
```

## Still Having Issues?

1. **Check Shopify Status:** https://status.shopify.com/
2. **Review API Documentation:** https://shopify.dev/api/storefront
3. **Test with Shopify GraphQL Explorer:** https://shopify.dev/tools/graphql-admin-api/graphql-explorer
4. **Contact Support:** Include error messages and configuration status

## Security Notes

- Never commit `.env.local` to version control
- Use test tokens for development
- Rotate tokens regularly
- Monitor API usage in Shopify Admin
