'use client';

import { useState, useCallback } from 'react';
import {
    ShopifyCheckoutService,
    ShopifyCheckout,
    ShopifyProduct
} from '../shopify-sdk';
import { createLineItems, validateCheckoutData } from '../shopify-sdk/utils';

interface UseShopifyCheckoutReturn {
    checkout: ShopifyCheckout | null;
    loading: boolean;
    error: string | null;
    createCheckout: (lineItems: Array<{ variantId: string; quantity: number }>) => Promise<boolean>;
    updateCheckout: (lineItems: Array<{ variantId: string; quantity: number }>) => Promise<boolean>;
    getCheckout: (checkoutId: string) => Promise<boolean>;
    clearCheckout: () => void;
}

/**
 * Hook for managing Shopify checkout
 */
export function useShopifyCheckout(): UseShopifyCheckoutReturn {
    const [checkout, setCheckout] = useState<ShopifyCheckout | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createCheckout = useCallback(async (lineItems: Array<{ variantId: string; quantity: number }>) => {
        setLoading(true);
        setError(null);

        try {
            const newCheckout = await ShopifyCheckoutService.createCheckout(lineItems);

            if (newCheckout) {
                setCheckout(newCheckout);
                return true;
            } else {
                setError('Failed to create checkout');
                return false;
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to create checkout';
            setError(errorMessage);
            console.error('Error creating checkout:', err);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateCheckout = useCallback(async (lineItems: Array<{ variantId: string; quantity: number }>) => {
        if (!checkout) {
            setError('No checkout to update');
            return false;
        }

        setLoading(true);
        setError(null);

        try {
            const updatedCheckout = await ShopifyCheckoutService.updateCheckoutLineItems(
                checkout.id,
                lineItems
            );

            if (updatedCheckout) {
                setCheckout(updatedCheckout);
                return true;
            } else {
                setError('Failed to update checkout');
                return false;
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update checkout';
            setError(errorMessage);
            console.error('Error updating checkout:', err);
            return false;
        } finally {
            setLoading(false);
        }
    }, [checkout]);

    const getCheckout = useCallback(async (checkoutId: string) => {
        setLoading(true);
        setError(null);

        try {
            const fetchedCheckout = await ShopifyCheckoutService.getCheckout(checkoutId);

            if (fetchedCheckout) {
                setCheckout(fetchedCheckout);
                return true;
            } else {
                setError('Checkout not found');
                return false;
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch checkout';
            setError(errorMessage);
            console.error('Error fetching checkout:', err);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const clearCheckout = useCallback(() => {
        setCheckout(null);
        setError(null);
    }, []);

    return {
        checkout,
        loading,
        error,
        createCheckout,
        updateCheckout,
        getCheckout,
        clearCheckout,
    };
}

/**
 * Hook for adding products to checkout
 */
export function useAddToCheckout() {
    const { createCheckout, updateCheckout, checkout, loading, error } = useShopifyCheckout();

    const addProductToCheckout = useCallback(async (
        product: ShopifyProduct,
        variantId: string,
        quantity: number = 1
    ) => {
        try {
            const lineItems = createLineItems(product, variantId, quantity);

            if (checkout) {
                // Update existing checkout
                return await updateCheckout(lineItems);
            } else {
                // Create new checkout
                return await createCheckout(lineItems);
            }
        } catch (err) {
            console.error('Error adding product to checkout:', err);
            return false;
        }
    }, [checkout, createCheckout, updateCheckout]);

    const addMultipleProductsToCheckout = useCallback(async (
        products: Array<{
            product: ShopifyProduct;
            variantId: string;
            quantity: number;
        }>
    ) => {
        try {
            const lineItems: Array<{ variantId: string; quantity: number }> = [];

            for (const { product, variantId, quantity } of products) {
                const items = createLineItems(product, variantId, quantity);
                lineItems.push(...items);
            }

            if (checkout) {
                // Update existing checkout
                return await updateCheckout(lineItems);
            } else {
                // Create new checkout
                return await createCheckout(lineItems);
            }
        } catch (err) {
            console.error('Error adding multiple products to checkout:', err);
            return false;
        }
    }, [checkout, createCheckout, updateCheckout]);

    return {
        addProductToCheckout,
        addMultipleProductsToCheckout,
        checkout,
        loading,
        error,
    };
}

/**
 * Hook for managing cart state
 */
export function useCart() {
    const { checkout, loading, error, createCheckout, updateCheckout, clearCheckout } = useShopifyCheckout();

    const addToCart = useCallback(async (
        product: ShopifyProduct,
        variantId: string,
        quantity: number = 1
    ) => {
        try {
            const lineItems = createLineItems(product, variantId, quantity);

            if (checkout) {
                // Add to existing checkout
                const currentLineItems = checkout.lineItems.map(item => ({
                    variantId: item.variant.id,
                    quantity: item.quantity,
                }));

                // Check if variant already exists in cart
                const existingItemIndex = currentLineItems.findIndex(
                    item => item.variantId === variantId
                );

                if (existingItemIndex >= 0) {
                    // Update quantity
                    currentLineItems[existingItemIndex].quantity += quantity;
                } else {
                    // Add new item
                    currentLineItems.push(...lineItems);
                }

                return await updateCheckout(currentLineItems);
            } else {
                // Create new checkout
                return await createCheckout(lineItems);
            }
        } catch (err) {
            console.error('Error adding to cart:', err);
            return false;
        }
    }, [checkout, createCheckout, updateCheckout]);

    const removeFromCart = useCallback(async (variantId: string) => {
        if (!checkout) return false;

        try {
            const currentLineItems = checkout.lineItems
                .filter(item => item.variant.id !== variantId)
                .map(item => ({
                    variantId: item.variant.id,
                    quantity: item.quantity,
                }));

            return await updateCheckout(currentLineItems);
        } catch (err) {
            console.error('Error removing from cart:', err);
            return false;
        }
    }, [checkout, updateCheckout]);

    const updateCartItemQuantity = useCallback(async (variantId: string, quantity: number) => {
        if (!checkout) return false;

        try {
            const currentLineItems = checkout.lineItems.map(item => {
                if (item.variant.id === variantId) {
                    return {
                        variantId: item.variant.id,
                        quantity: Math.max(0, quantity), // Ensure quantity is not negative
                    };
                }
                return {
                    variantId: item.variant.id,
                    quantity: item.quantity,
                };
            }).filter(item => item.quantity > 0); // Remove items with 0 quantity

            return await updateCheckout(currentLineItems);
        } catch (err) {
            console.error('Error updating cart item quantity:', err);
            return false;
        }
    }, [checkout, updateCheckout]);

    const getCartItemCount = useCallback(() => {
        if (!checkout) return 0;
        return checkout.lineItems.reduce((total, item) => total + item.quantity, 0);
    }, [checkout]);

    const getCartTotal = useCallback(() => {
        if (!checkout) return { amount: '0', currencyCode: 'USD' };
        return checkout.totalPrice;
    }, [checkout]);

    return {
        checkout,
        loading,
        error,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart: clearCheckout,
        getCartItemCount,
        getCartTotal,
    };
}
