import { NextRequest, NextResponse } from 'next/server';
import { ShopifyProductService } from '../../../../../shopify-sdk';

/**
 * GET /api/shopify/products/search?q=query
 * Searches products in Shopify by query string
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');
        
        if (!query) {
            return NextResponse.json({
                success: false,
                error: 'Query parameter "q" is required',
                products: []
            }, { status: 400 });
        }
        
        const products = await ShopifyProductService.searchProducts(query);
        
        return NextResponse.json({
            success: true,
            products,
            count: products.length,
            query
        });
    } catch (error) {
        console.error('Error searching products:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            products: []
        }, { status: 500 });
    }
}
