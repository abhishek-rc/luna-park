'use client';

import { useState, useEffect, useCallback } from 'react';
import { ShopifyProduct } from '../shopify-sdk';
import { sortProducts } from '../shopify-sdk/utils';

interface UseShopifyProductsOptions {
    cardKey?: string;
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
        cardKey,
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
            let response: Response;
            let data: any;

            if (cardKey) {
                // Fetch products by card key (mapped to product_key in Shopify)
                response = await fetch(`/api/shopify/products/by-key?cardKey=${encodeURIComponent(cardKey)}`);
                data = await response.json();
            } else {
                // Fetch all products
                response = await fetch('/api/shopify/products');
                data = await response.json();
            }

            if (!response.ok || !data.success) {
                throw new Error(data.error || `HTTP ${response.status}`);
            }

            const fetchedProducts: ShopifyProduct[] = data.products || [];

            // Sort products
            const sortedProducts = sortProducts(fetchedProducts, sortBy, sortOrder);

            setProducts(sortedProducts);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products';
            setError(errorMessage);
            console.error('Error fetching Shopify products:', err);
        } finally {
            setLoading(false);
        }
    }, [cardKey, sortBy, sortOrder, enabled]);

    const refetch = useCallback(() => {
        return fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return {
        products,
        loading,
        error,
        refetch,
    };
}

/**
 * Hook for fetching a single Shopify product by ID
 */
export function useShopifyProduct(productId: string | null) {
    const [product, setProduct] = useState<ShopifyProduct | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProduct = useCallback(async () => {
        if (!productId) {
            setProduct(null);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/shopify/products/${productId}`);
            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || `HTTP ${response.status}`);
            }

            setProduct(data.product);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch product';
            setError(errorMessage);
            console.error('Error fetching Shopify product:', err);
        } finally {
            setLoading(false);
        }
    }, [productId]);

    useEffect(() => {
        fetchProduct();
    }, [fetchProduct]);

    return {
        product,
        loading,
        error,
        refetch: fetchProduct,
    };
}

/**
 * Hook for searching Shopify products
 */
export function useShopifyProductSearch(query: string, enabled: boolean = true) {
    const [products, setProducts] = useState<ShopifyProduct[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const searchProducts = useCallback(async () => {
        if (!enabled || !query.trim()) {
            setProducts([]);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/shopify/products/search?q=${encodeURIComponent(query)}`);
            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || `HTTP ${response.status}`);
            }

            setProducts(data.products || []);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to search products';
            setError(errorMessage);
            console.error('Error searching Shopify products:', err);
        } finally {
            setLoading(false);
        }
    }, [query, enabled]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            searchProducts();
        }, 300); // Debounce search

        return () => clearTimeout(timeoutId);
    }, [searchProducts]);

    return {
        products,
        loading,
        error,
        refetch: searchProducts,
    };
}

/**
 * Hook for getting products by multiple card keys
 */
export function useShopifyProductsByCardKeys(cardKeys: string[]) {
    const [productsByCardKey, setProductsByCardKey] = useState<Record<string, ShopifyProduct[]>>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProductsByCardKeys = useCallback(async () => {
        if (cardKeys.length === 0) {
            setProductsByCardKey({});
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const results: Record<string, ShopifyProduct[]> = {};

            // Fetch products for each card key in parallel
            await Promise.all(
                cardKeys.map(async (cardKey) => {
                    try {
                        const products = await ProductMappingService.getShopifyProductsByCardKey(cardKey);
                        results[cardKey] = products;
                    } catch (err) {
                        console.error(`Error fetching products for card key ${cardKey}:`, err);
                        results[cardKey] = [];
                    }
                })
            );

            setProductsByCardKey(results);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products by card keys';
            setError(errorMessage);
            console.error('Error fetching products by card keys:', err);
        } finally {
            setLoading(false);
        }
    }, [cardKeys]);

    useEffect(() => {
        fetchProductsByCardKeys();
    }, [fetchProductsByCardKeys]);

    return {
        productsByCardKey,
        loading,
        error,
        refetch: fetchProductsByCardKeys,
    };
}
