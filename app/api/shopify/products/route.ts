import { NextRequest, NextResponse } from 'next/server';
import { ShopifyProductService } from '../../../../shopify-sdk';

/**
 * GET /api/shopify/products
 * Fetches all products from Shopify
 */
export async function GET(request: NextRequest) {
    try {
        const products = await ShopifyProductService.getAllProducts();

        return NextResponse.json({
            success: true,
            products,
            count: products.length
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            products: []
        }, { status: 500 });
    }
}
