import { ShopifyProduct } from './index';

/**
 * Format price for display
 */
export function formatPrice(amount: string, currencyCode: string = 'USD'): string {
    const price = parseFloat(amount);
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
    }).format(price);
}

/**
 * Get the main product image URL
 */
export function getProductImageUrl(product: ShopifyProduct): string {
    if (product.images && product.images.length > 0) {
        return product.images[0].url;
    }
    return '/placeholder-product.jpg'; // Fallback image
}

/**
 * Get product variant by ID
 */
export function getProductVariant(product: ShopifyProduct, variantId: string): ShopifyProduct['variants'][0] | null {
    return product.variants.find(variant => variant.id === variantId) || null;
}

/**
 * Get the default variant (first available variant)
 */
export function getDefaultVariant(product: ShopifyProduct): ShopifyProduct['variants'][0] | null {
    const availableVariant = product.variants.find(variant => variant.availableForSale);
    return availableVariant || (product.variants.length > 0 ? product.variants[0] : null);
}

/**
 * Check if product is available for purchase
 */
export function isProductAvailable(product: ShopifyProduct): boolean {
    return product.availableForSale && product.variants.some(variant => variant.availableForSale);
}

/**
 * Get product availability status
 */
export function getProductAvailabilityStatus(product: ShopifyProduct): 'in_stock' | 'low_stock' | 'out_of_stock' | 'unavailable' {
    if (!product.availableForSale) {
        return 'unavailable';
    }

    const availableVariants = product.variants.filter(variant => variant.availableForSale);

    if (availableVariants.length === 0) {
        return 'out_of_stock';
    }

    const totalInventory = availableVariants.reduce((sum, variant) => sum + variant.inventoryQuantity, 0);

    if (totalInventory === 0) {
        return 'out_of_stock';
    } else if (totalInventory <= 5) {
        return 'low_stock';
    } else {
        return 'in_stock';
    }
}

/**
 * Generate product slug from title
 */
export function generateProductSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}


/**
 * Get product metafield value by key
 */
export function getProductMetafield(product: ShopifyProduct, namespace: string, key: string): string | null {
    const metafield = product.metafields.find(
        mf => mf.namespace === namespace && mf.key === key
    );
    return metafield ? metafield.value : null;
}

/**
 * Get product_key metafield (for mapping with Contentstack card_key)
 */
export function getProductKey(product: ShopifyProduct): string | null {
    return getProductMetafield(product, 'custom', 'product_key');
}

/**
 * Check if product matches card key
 */
export function productMatchesCardKey(product: ShopifyProduct, cardKey: string): boolean {
    const productKey = getProductKey(product);
    console.log('Product key:', productKey, 'Card key:', cardKey);
    return productKey == cardKey;
}

/**
 * Filter products by card key
 */
export function filterProductsByCardKey(products: ShopifyProduct[], cardKey: string): ShopifyProduct[] {
    return products.filter(product => productMatchesCardKey(product, cardKey));
}

/**
 * Sort products by various criteria
 */
export function sortProducts(
    products: ShopifyProduct[],
    sortBy: 'title' | 'price' | 'created' | 'updated' = 'title',
    order: 'asc' | 'desc' = 'asc'
): ShopifyProduct[] {
    return [...products].sort((a, b) => {
        let comparison = 0;

        switch (sortBy) {
            case 'title':
                comparison = a.title.localeCompare(b.title);
                break;
            case 'price':
                const priceA = parseFloat(a.variants[0]?.price || '0');
                const priceB = parseFloat(b.variants[0]?.price || '0');
                comparison = priceA - priceB;
                break;
            case 'created':
                comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                break;
            case 'updated':
                comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
                break;
        }

        return order === 'desc' ? -comparison : comparison;
    });
}

/**
 * Paginate products
 */
export function paginateProducts<T>(
    items: T[],
    page: number = 1,
    limit: number = 10
): {
    items: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
} {
    const total = items.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedItems = items.slice(startIndex, endIndex);

    return {
        items: paginatedItems,
        pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
        },
    };
}
