import { NextRequest, NextResponse } from 'next/server';
import { ShopifyProductService } from '../../../../shopify-sdk';

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();
    
    console.log('Creating order via API route:', orderData);
    
    // Validate required fields
    if (!orderData.email || !orderData.firstName || !orderData.lastName) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: email, firstName, lastName' },
        { status: 400 }
      );
    }
    
    if (!orderData.items || orderData.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No items provided' },
        { status: 400 }
      );
    }
    
    // Prepare line items for Shopify
    const lineItems = orderData.items.map((item: any) => ({
      variantId: item.variantId,
      quantity: item.quantity,
      price: item.price
    }));
    
    // Create order in Shopify
    const orderResult = await ShopifyProductService.createOrder({
      email: orderData.email,
      firstName: orderData.firstName,
      lastName: orderData.lastName,
      lineItems: lineItems,
      totalPrice: orderData.totalPrice,
      financialStatus: 'pending',
      fulfillmentStatus: 'null',
      note: `Visit Date: ${orderData.selectedDate}`
    });
    
    if (orderResult.success) {
      console.log('Order created successfully:', {
        orderId: orderResult.orderId,
        orderNumber: orderResult.orderNumber
      });
      
      return NextResponse.json({
        success: true,
        orderId: orderResult.orderId,
        orderNumber: orderResult.orderNumber
      });
    } else {
      console.error('Order creation failed:', orderResult.error);
      return NextResponse.json(
        { success: false, error: orderResult.error || 'Failed to create order' },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
