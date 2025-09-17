import { ShopifyProductService } from '../shopify-sdk';
import { CartItem } from '../contexts/CartContext';

export interface ShopifyCart {
    id: string;
    totalQuantity: number;
    cost: {
        totalAmount: {
            amount: string;
            currencyCode: string;
        };
    };
    lines: {
        edges: Array<{
            node: {
                id: string;
                quantity: number;
                merchandise: {
                    id: string;
                    title: string;
                    price: {
                        amount: string;
                        currencyCode: string;
                    };
                    product: {
                        id: string;
                        title: string;
                    };
                };
            };
        }>;
    };
}

/**
 * Service to handle cart operations and Shopify checkout
 */
export class CartService {
    private static cartId: string | null = null;
    /**
     * Create a Shopify checkout with cart items
     */
    static async createCheckout(cartItems: CartItem[]): Promise<{
        success: boolean;
        checkoutUrl?: string;
        error?: string;
    }> {
        try {
            if (cartItems.length === 0) {
                return {
                    success: false,
                    error: 'Cart is empty',
                };
            }

            // Convert cart items to Shopify line items format
            const lineItems = cartItems.map(item => ({
                variantId: item.variantId,
                quantity: item.quantity,
            }));

            console.log('Creating checkout with line items:', lineItems);

            // Create checkout using Shopify Storefront API
            const result = await ShopifyProductService.createCheckout(lineItems);

            if (!result.success) {
                console.error('Checkout creation failed:', result.error);
                return {
                    success: false,
                    error: result.error,
                };
            }

            console.log('Checkout created successfully:', result.checkoutUrl);

            return {
                success: true,
                checkoutUrl: result.checkoutUrl,
            };
        } catch (error) {
            console.error('Error creating checkout:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to create checkout',
            };
        }
    }

    /**
     * Create a new cart with items
     */
    static async createCart(items: CartItem[]): Promise<{
        success: boolean;
        cart?: ShopifyCart;
        error?: string;
    }> {
        try {
            const lineItems = items.map(item => ({
                variantId: item.variantId,
                quantity: item.quantity
            }));

            const cart = await ShopifyProductService.createCart(lineItems);
            this.cartId = cart.id.replace('gid://shopify/Cart/', '');

            // Persist cartId to localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('luna-park-cart-id', this.cartId);
            }

            return {
                success: true,
                cart
            };
        } catch (error) {
            console.error('Error creating cart:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to create cart'
            };
        }
    }

    /**
     * Add items to existing cart
     */
    static async addToCart(items: CartItem[]): Promise<{
        success: boolean;
        cart?: ShopifyCart;
        error?: string;
    }> {
        try {
            if (!this.cartId) {
                return await this.createCart(items);
            }

            const lineItems = items.map(item => ({
                variantId: item.variantId,
                quantity: item.quantity
            }));

            const cart = await ShopifyProductService.addToCart(this.cartId, lineItems);

            return {
                success: true,
                cart
            };
        } catch (error) {
            console.error('Error adding to cart:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to add to cart'
            };
        }
    }

    /**
     * Update cart line items
     */
    static async updateCartItems(items: CartItem[]): Promise<{
        success: boolean;
        cart?: ShopifyCart;
        error?: string;
    }> {
        try {
            if (!this.cartId) {
                return {
                    success: false,
                    error: 'No cart found'
                };
            }

            const lineItems = items
                .filter(item => item.lineItemId)
                .map(item => ({
                    id: item.lineItemId!,
                    quantity: item.quantity
                }));

            if (lineItems.length === 0) {
                return {
                    success: false,
                    error: 'No valid line items to update'
                };
            }

            const cart = await ShopifyProductService.updateCartLines(this.cartId, lineItems);

            return {
                success: true,
                cart
            };
        } catch (error) {
            console.error('Error updating cart:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to update cart'
            };
        }
    }

    /**
     * Remove items from cart
     */
    static async removeFromCart(lineItemIds: string[]): Promise<{
        success: boolean;
        cart?: ShopifyCart;
        error?: string;
    }> {
        try {
            if (!this.cartId) {
                return {
                    success: false,
                    error: 'No cart found'
                };
            }

            const cart = await ShopifyProductService.removeFromCart(this.cartId, lineItemIds);

            return {
                success: true,
                cart
            };
        } catch (error) {
            console.error('Error removing from cart:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to remove from cart'
            };
        }
    }

    /**
     * Get current cart
     */
    static async getCart(): Promise<{
        success: boolean;
        cart?: ShopifyCart;
        error?: string;
    }> {
        try {
            if (!this.cartId) {
                return {
                    success: false,
                    error: 'No cart found'
                };
            }

            const cart = await ShopifyProductService.getCart(this.cartId);

            if (!cart) {
                this.cartId = null;
                return {
                    success: false,
                    error: 'Cart not found'
                };
            }

            return {
                success: true,
                cart
            };
        } catch (error) {
            console.error('Error getting cart:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to get cart'
            };
        }
    }

    /**
     * Get cart ID
     */
    static getCartId(): string | null {
        // Initialize from localStorage if not set
        if (typeof window !== 'undefined' && this.cartId === null) {
            const savedCartId = localStorage.getItem('luna-park-cart-id');
            if (savedCartId) {
                this.cartId = savedCartId;
            }
        }
        return this.cartId;
    }

    /**
     * Set cart ID (for restoring from storage)
     */
    static setCartId(cartId: string): void {
        this.cartId = cartId;
        // Persist to localStorage
        if (typeof window !== 'undefined') {
            localStorage.setItem('luna-park-cart-id', cartId);
        }
    }

    /**
     * Clear cart
     */
    static clearCart(): void {
        this.cartId = null;
        // Remove from localStorage
        if (typeof window !== 'undefined') {
            localStorage.removeItem('luna-park-cart-id');
        }
    }

    /**
     * Validate cart items before checkout
     */
    static validateCartItems(cartItems: CartItem[]): {
        isValid: boolean;
        errors: string[];
    } {
        const errors: string[] = [];

        if (cartItems.length === 0) {
            errors.push('Cart is empty');
        }

        for (const item of cartItems) {
            if (item.quantity <= 0) {
                errors.push(`Invalid quantity for ${item.title}`);
            }

            if (!item.variantId) {
                errors.push(`Missing variant ID for ${item.title}`);
            }

            if (!item.price || parseFloat(item.price) <= 0) {
                errors.push(`Invalid price for ${item.title}`);
            }
        }

        return {
            isValid: errors.length === 0,
            errors,
        };
    }

    /**
     * Calculate cart totals
     */
    static calculateTotals(cartItems: CartItem[]): {
        totalItems: number;
        totalPrice: number;
        subtotal: number;
        tax: number;
    } {
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        const subtotal = cartItems.reduce(
            (sum, item) => sum + (parseFloat(item.price) * item.quantity),
            0
        );

        // For now, we'll assume no tax calculation
        // In a real implementation, you might want to calculate tax based on location
        const tax = 0;
        const totalPrice = subtotal + tax;

        return {
            totalItems,
            totalPrice,
            subtotal,
            tax,
        };
    }

    /**
     * Format price for display
     */
    static formatPrice(amount: number, currencyCode: string = 'USD'): string {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currencyCode,
        }).format(amount);
    }
}
