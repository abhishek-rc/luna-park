import { NextRequest, NextResponse } from 'next/server';
import { ShopifyCheckoutService } from '../../../../shopify-sdk';

/**
 * POST /api/shopify/checkout
 * Creates a new checkout in Shopify with the provided line items
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { lineItems } = body;
        
        if (!lineItems || !Array.isArray(lineItems)) {
            return NextResponse.json({
                success: false,
                error: 'lineItems array is required',
                checkout: null
            }, { status: 400 });
        }
        
        const checkout = await ShopifyCheckoutService.createCheckout(lineItems);
        
        if (!checkout) {
            return NextResponse.json({
                success: false,
                error: 'Failed to create checkout',
                checkout: null
            }, { status: 500 });
        }
        
        return NextResponse.json({
            success: true,
            checkout
        });
    } catch (error) {
        console.error('Error creating checkout:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            checkout: null
        }, { status: 500 });
    }
}
