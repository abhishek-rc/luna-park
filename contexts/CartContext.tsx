'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartService } from '../services/CartService';

export interface CartItem {
    id: string;
    product: any;
    variantId: string;
    quantity: number;
    price: string;
    title: string;
    image?: string;
    lineItemId?: string;
}

interface CartState {
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
    isOpen: boolean;
    isLoading: boolean;
}

interface CartContextType {
    state: CartState;
    addToCart: (item: Omit<CartItem, 'id'>) => Promise<void>;
    removeFromCart: (id: string) => Promise<void>;
    updateQuantity: (id: string, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;
    loadCartData: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<CartState>({
        items: [],
        totalItems: 0,
        totalPrice: 0,
        isOpen: false,
        isLoading: false,
    });

    // Load cart data from Shopify
    const loadCartData = async () => {
        try {
            setState(prev => ({ ...prev, isLoading: true }));
            const result = await CartService.getCart();
            if (result.success && result.cart) {
                const items: CartItem[] = result.cart.lines.edges.map((edge: any) => ({
                    id: edge.node.merchandise.id.replace('gid://shopify/ProductVariant/', ''),
                    product: {
                        id: edge.node.merchandise.product.id.replace('gid://shopify/Product/', ''),
                        title: edge.node.merchandise.product.title,
                    },
                    variantId: edge.node.merchandise.id.replace('gid://shopify/ProductVariant/', ''),
                    quantity: edge.node.quantity,
                    price: edge.node.merchandise.price.amount,
                    title: edge.node.merchandise.title,
                    lineItemId: edge.node.id.replace('gid://shopify/CartLine/', ''),
                }));

                setState(prev => ({
                    ...prev,
                    items,
                    totalItems: result.cart!.totalQuantity,
                    totalPrice: parseFloat(result.cart!.cost.totalAmount.amount),
                }));
            } else {
                setState(prev => ({
                    ...prev,
                    items: [],
                    totalItems: 0,
                    totalPrice: 0,
                }));
            }
        } catch (error) {
            console.error('Error loading cart:', error);
            setState(prev => ({
                ...prev,
                items: [],
                totalItems: 0,
                totalPrice: 0,
            }));
        } finally {
            setState(prev => ({ ...prev, isLoading: false }));
        }
    };

    const addToCart = async (item: Omit<CartItem, 'id'>) => {
        try {
            const cartItem: CartItem = { ...item, id: Date.now().toString() };
            const result = await CartService.addToCart([cartItem]);
            if (result.success) {
                console.log('Successfully added to Shopify cart');
                // Reload cart data to get updated state
                await loadCartData();
            } else {
                console.error('Failed to add to Shopify cart:', result.error);
                throw new Error(result.error || 'Failed to add to cart');
            }
        } catch (error: any) {
            console.error('Error adding to cart:', error);
            throw error;
        }
    };

    const removeFromCart = async (id: string) => {
        try {
            // Find the item by its local ID to get the lineItemId
            const itemToRemove = state.items.find(item => item.id === id);
            if (!itemToRemove?.lineItemId) {
                throw new Error('Item not found or missing line item ID');
            }

            const result = await CartService.removeFromCart([itemToRemove.lineItemId]);
            if (result.success) {
                console.log('Successfully removed from Shopify cart');
                await loadCartData();
            } else {
                console.error('Failed to remove from Shopify cart:', result.error);
                throw new Error(result.error || 'Failed to remove from cart');
            }
        } catch (error: any) {
            console.error('Error removing from cart:', error);
            throw error;
        }
    };

    const updateQuantity = async (id: string, quantity: number) => {
        try {
            const itemToUpdate = state.items.find(item => item.id === id);
            if (itemToUpdate) {
                const result = await CartService.updateCartItems([{ ...itemToUpdate, quantity }]);
                if (result.success) {
                    console.log('Successfully updated Shopify cart');
                    await loadCartData();
                } else {
                    console.error('Failed to update Shopify cart:', result.error);
                    throw new Error(result.error || 'Failed to update cart');
                }
            }
        } catch (error: any) {
            console.error('Error updating quantity:', error);
            throw error;
        }
    };

    const clearCart = async () => {
        try {
            const lineItemIds = state.items
                .filter(item => item.lineItemId)
                .map(item => item.lineItemId!);

            if (lineItemIds.length > 0) {
                const result = await CartService.removeFromCart(lineItemIds);
                if (result.success) {
                    console.log('Successfully cleared Shopify cart');
                    await loadCartData();
                } else {
                    console.error('Failed to clear Shopify cart:', result.error);
                    throw new Error(result.error || 'Failed to clear cart');
                }
            } else {
                setState(prev => ({
                    ...prev,
                    items: [],
                    totalItems: 0,
                    totalPrice: 0,
                }));
            }
        } catch (error: any) {
            console.error('Error clearing cart:', error);
            throw error;
        }
    };

    const openCart = () => {
        setState(prev => ({ ...prev, isOpen: true }));
        loadCartData(); // Load fresh data when opening
    };

    const closeCart = () => {
        setState(prev => ({ ...prev, isOpen: false }));
    };

    const toggleCart = () => {
        setState(prev => {
            const newIsOpen = !prev.isOpen;
            if (newIsOpen) {
                loadCartData(); // Load fresh data when opening
            }
            return { ...prev, isOpen: newIsOpen };
        });
    };

    return (
        <CartContext.Provider
            value={{
                state,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                openCart,
                closeCart,
                toggleCart,
                loadCartData,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}