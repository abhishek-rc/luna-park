import { NextRequest, NextResponse } from 'next/server';
import { ShopifyProductService } from '../../../../../shopify-sdk';

/**
 * GET /api/shopify/products/[id]
 * Fetches a specific product by ID from Shopify
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const productId = params.id;
        const product = await ShopifyProductService.getProductById(productId);
        
        if (!product) {
            return NextResponse.json({
                success: false,
                error: 'Product not found',
                product: null
            }, { status: 404 });
        }
        
        return NextResponse.json({
            success: true,
            product
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            product: null
        }, { status: 500 });
    }
}
