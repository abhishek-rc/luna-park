'use client';

import { useState, useEffect, useCallback } from 'react';
import { ShopifyProduct, ShopifyProductService } from '../shopify-sdk';
import { sortProducts } from '../shopify-sdk/utils';

interface UseShopifyProductsOptions {
    sortBy?: 'title' | 'price' | 'created' | 'updated';
    sortOrder?: 'asc' | 'desc';
    enabled?: boolean;
}

interface UseShopifyProductsReturn {
    products: ShopifyProduct[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

/**
 * Hook for fetching and managing Shopify products
 */
export function useShopifyProducts(options: UseShopifyProductsOptions = {}): UseShopifyProductsReturn {
    const {
        sortBy = 'title',
        sortOrder = 'asc',
        enabled = true,
    } = options;

    const [products, setProducts] = useState<ShopifyProduct[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = useCallback(async () => {
        if (!enabled) return;

        setLoading(true);
        setError(null);

        try {
            // Fetch all products directly from Shopify
            const allProducts = await ShopifyProductService.getAllProducts();

            // Sort products
            const sortedProducts = sortProducts(allProducts, sortBy, sortOrder);

            setProducts(sortedProducts);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products';
            setError(errorMessage);
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    }, [enabled, sortBy, sortOrder]);

    // Fetch products on mount and when dependencies change
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return {
        products,
        loading,
        error,
        refetch: fetchProducts,
    };
}