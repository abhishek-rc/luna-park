import { ShopifyProductService } from '../shopify-sdk';

export interface OrderItem {
  variantId: string;
  quantity: number;
  price: number;
  title: string;
}

export interface OrderData {
  email: string;
  firstName: string;
  lastName: string;
  postCode: string;
  selectedDate: string;
  items: OrderItem[];
  totalPrice: number;
}

export class OrderService {
  /**
   * Create a Shopify checkout with the order data
   */
  static async createOrder(orderData: OrderData): Promise<{
    success: boolean;
    checkoutUrl?: string;
    orderId?: string;
    error?: string;
  }> {
    try {
      // Generate order ID first
      const orderId = `LPS-${Date.now()}`;
      
      // Prepare line items for Shopify
      const lineItems = orderData.items.map(item => ({
        variantId: item.variantId,
        quantity: item.quantity
      }));

      // Try to create checkout in Shopify
      const checkoutResult = await ShopifyProductService.createCheckout(lineItems);
      
      if (checkoutResult.success && checkoutResult.checkoutUrl) {
        // In a real implementation, you would:
        // 1. Save order details to your database
        // 2. Send confirmation email
        // 3. Update inventory
        // 4. Process payment

        return {
          success: true,
          checkoutUrl: checkoutResult.checkoutUrl,
          orderId: orderId
        };
      } else {
        // Fallback: Create a mock successful order for testing
        // In development, we'll create a mock successful order
        if (process.env.NODE_ENV === 'development') {

          return {
            success: true,
            checkoutUrl: `https://checkout.shopify.com/mock-checkout/${orderId}`,
            orderId: orderId
          };
        }

        return {
          success: false,
          error: checkoutResult.error || 'Failed to create checkout'
        };
      }
    } catch (error) {
      console.error('Error creating order:', error);
      
      // Fallback for development
      if (process.env.NODE_ENV === 'development') {
        const orderId = `LPS-${Date.now()}`;

        return {
          success: true,
          checkoutUrl: `https://checkout.shopify.com/mock-checkout/${orderId}`,
          orderId: orderId
        };
      }

      return {
        success: false,
        error: 'Failed to create order'
      };
    }
  }

  /**
   * Create a cart in Shopify (alternative to checkout)
   */
  static async createCart(orderData: OrderData): Promise<{
    success: boolean;
    cartId?: string;
    orderId?: string;
    error?: string;
  }> {
    try {
      // Prepare line items for Shopify
      const lineItems = orderData.items.map(item => ({
        variantId: item.variantId,
        quantity: item.quantity
      }));

      // Create cart in Shopify
      const cartResult = await ShopifyProductService.createCart(lineItems);
      
      if (cartResult) {
        // Generate order ID
        const orderId = `LPS-${Date.now()}`;

        return {
          success: true,
          cartId: cartResult.id,
          orderId: orderId
        };
      } else {
        return {
          success: false,
          error: 'Failed to create cart'
        };
      }
    } catch (error) {
      console.error('Error creating cart:', error);
      return {
        success: false,
        error: 'Failed to create cart'
      };
    }
  }

  /**
   * Validate order data
   */
  static validateOrderData(orderData: OrderData): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!orderData.email || !orderData.email.includes('@')) {
      errors.push('Valid email is required');
    }

    if (!orderData.firstName || orderData.firstName.trim().length === 0) {
      errors.push('First name is required');
    }

    if (!orderData.lastName || orderData.lastName.trim().length === 0) {
      errors.push('Last name is required');
    }

    if (!orderData.postCode || orderData.postCode.trim().length === 0) {
      errors.push('Post code is required');
    }

    if (!orderData.selectedDate) {
      errors.push('Visit date is required');
    }

    if (!orderData.items || orderData.items.length === 0) {
      errors.push('At least one item is required');
    }

    if (orderData.totalPrice <= 0) {
      errors.push('Total price must be greater than 0');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Format order data for display
   */
  static formatOrderForDisplay(orderData: OrderData): {
    orderId: string;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
      total: number;
    }>;
    subtotal: number;
    total: number;
    visitDate: string;
    customerInfo: {
      name: string;
      email: string;
      postCode: string;
    };
  } {
    const orderId = `LPS-${Date.now()}`;
    
    const formattedItems = orderData.items.map(item => ({
      name: item.title,
      quantity: item.quantity,
      price: item.price,
      total: item.price * item.quantity
    }));

    const subtotal = formattedItems.reduce((sum, item) => sum + item.total, 0);

    return {
      orderId,
      items: formattedItems,
      subtotal,
      total: orderData.totalPrice,
      visitDate: orderData.selectedDate,
      customerInfo: {
        name: `${orderData.firstName} ${orderData.lastName}`,
        email: orderData.email,
        postCode: orderData.postCode
      }
    };
  }
}
