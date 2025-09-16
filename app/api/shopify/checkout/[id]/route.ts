import { NextRequest, NextResponse } from 'next/server';
import { ShopifyCheckoutService } from '../../../../../shopify-sdk';

/**
 * GET /api/shopify/checkout/[id]
 * Fetches a specific checkout by ID from Shopify
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const checkoutId = params.id;
        const checkout = await ShopifyCheckoutService.getCheckout(checkoutId);
        
        if (!checkout) {
            return NextResponse.json({
                success: false,
                error: 'Checkout not found',
                checkout: null
            }, { status: 404 });
        }
        
        return NextResponse.json({
            success: true,
            checkout
        });
    } catch (error) {
        console.error('Error fetching checkout:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            checkout: null
        }, { status: 500 });
    }
}

/**
 * PUT /api/shopify/checkout/[id]
 * Updates a checkout's line items in Shopify
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const checkoutId = params.id;
        const body = await request.json();
        const { lineItems } = body;
        
        if (!lineItems || !Array.isArray(lineItems)) {
            return NextResponse.json({
                success: false,
                error: 'lineItems array is required',
                checkout: null
            }, { status: 400 });
        }
        
        const checkout = await ShopifyCheckoutService.updateCheckoutLineItems(checkoutId, lineItems);
        
        if (!checkout) {
            return NextResponse.json({
                success: false,
                error: 'Failed to update checkout',
                checkout: null
            }, { status: 500 });
        }
        
        return NextResponse.json({
            success: true,
            checkout
        });
    } catch (error) {
        console.error('Error updating checkout:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            checkout: null
        }, { status: 500 });
    }
}
