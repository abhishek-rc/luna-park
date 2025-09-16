import { NextRequest, NextResponse } from 'next/server';
import { ShopifyProductService } from '../../../../../shopify-sdk';

/**
 * GET /api/shopify/products/by-key?cardKey=key
 * Fetches products from Shopify by card key (mapped to product_key)
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const cardKey = searchParams.get('cardKey');
        
        if (!cardKey) {
            return NextResponse.json({
                success: false,
                error: 'Query parameter "cardKey" is required',
                products: []
            }, { status: 400 });
        }
        
        const products = await ShopifyProductService.getProductsByProductKey(cardKey);
        
        return NextResponse.json({
            success: true,
            products,
            count: products.length,
            cardKey
        });
    } catch (error) {
        console.error('Error fetching products by key:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            products: []
        }, { status: 500 });
    }
}
