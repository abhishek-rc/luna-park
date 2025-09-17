'use client';

import React from 'react';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../shopify-sdk/utils';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Cart() {
    const { state, removeFromCart, updateQuantity, clearCart, closeCart } = useCart();
    const [isCheckingOut, setIsCheckingOut] = React.useState(false);
    const router = useRouter();

    const handleRemoveItem = async (id: string) => {
        try {
            await removeFromCart(id);
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    const handleUpdateQuantity = async (id: string, quantity: number) => {
        try {
            if (quantity <= 0) {
                await removeFromCart(id);
            } else {
                await updateQuantity(id, quantity);
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const handleClearCart = async () => {
        if (confirm('Are you sure you want to clear the cart?')) {
            try {
                await clearCart();
            } catch (error) {
                console.error('Error clearing cart:', error);
            }
        }
    };

    const handleProceedToCheckout = () => {
        if (state.items.length === 0) return;

        // Calculate totals from cart items
        let yellowPass = 0;
        let redGreenPass = 0;
        let totalTickets = 0;
        let totalPrice = 0;

        // Create selectedVariants object from cart items
        const selectedVariants: { [key: string]: { variant: any; quantity: number } } = {};

        state.items.forEach((item, index) => {
            const variantTitle = item.title.toUpperCase();
            const price = parseFloat(item.price);

            // Determine ticket type based on title
            if (variantTitle.includes('Y') || variantTitle.includes('YELLOW')) {
                yellowPass += item.quantity;
            } else if (variantTitle.includes('R/G') || variantTitle.includes('RED/GREEN') || variantTitle.includes('RED') || variantTitle.includes('GREEN')) {
                redGreenPass += item.quantity;
            }

            totalTickets += item.quantity;
            totalPrice += price * item.quantity;

            // Create variant object for selectedVariants
            selectedVariants[`item_${index}`] = {
                variant: {
                    id: item.variantId,
                    title: item.title,
                    price: item.price
                },
                quantity: item.quantity
            };
        });

        // Create URL parameters
        const params = new URLSearchParams({
            date: new Date().toISOString().split('T')[0], // Default to today
            tickets: totalTickets.toString(),
            yellowPass: yellowPass.toString(),
            redGreenPass: redGreenPass.toString(),
            totalPrice: `$${totalPrice.toFixed(2)}`,
            selectedVariants: JSON.stringify(selectedVariants)
        });

        // Close cart and navigate to payment page
        closeCart();
        router.push(`/checkout/payment?${params.toString()}`);
    };

    // Don't render anything if cart is not open
    if (!state.isOpen) {
        return null;
    }

    if (state.isLoading) {
        return (
            <div className="fixed inset-0 z-50 flex items-start justify-end">
                <div className="bg-gray-800 w-full max-w-md h-full flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 bg-gray-700 border-b border-gray-600">
                        <div className="h-6 bg-gray-600 rounded animate-pulse w-32"></div>
                        <div className="h-6 w-6 bg-gray-600 rounded animate-pulse"></div>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto p-4">
                        <div className="space-y-4">
                            {[1, 2].map((i) => (
                                <div key={i} className="flex items-start space-x-4 p-3 bg-gray-700 rounded-lg">
                                    <div className="w-20 h-20 bg-gray-600 rounded animate-pulse"></div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="h-4 bg-gray-600 rounded animate-pulse w-16 mb-2"></div>
                                                <div className="h-3 bg-gray-600 rounded animate-pulse w-24 mb-1"></div>
                                                <div className="h-3 bg-gray-600 rounded animate-pulse w-12"></div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <div className="h-4 w-4 bg-gray-600 rounded animate-pulse"></div>
                                            </div>
                                        </div>
                                        <div className="mt-2 text-right">
                                            <div className="h-4 bg-gray-600 rounded animate-pulse w-16 ml-auto"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-start justify-end bg-black/50"
            onClick={closeCart}
        >
            <div
                className="bg-black w-full max-w-md h-full flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-end p-4">
                    <button
                        onClick={closeCart}
                        className="text-blue-400 hover:text-blue-300"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-4">
                    {state.items.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-white font-bold text-lg">Your cart is empty</p>
                            <button
                                onClick={closeCart}
                                className="mt-4 w-full text-xs bg-[#aa3030] text-[#f9ebd1] py-3 rounded-full font-semibold uppercase hover:bg-[#105974] disabled:opacity-50 transition-colors"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {state.items.map((item) => (
                                <div key={item.id} className="flex items-start space-x-4 p-3 border-b-2 border-[#f9ebd1]">
                                    {item.image && (
                                        <div className="w-20 h-20 flex-shrink-0">
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                width={80}
                                                height={80}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="text-sm font-bold text-[#f9ebd1] uppercase mb-1">
                                                    {item.title}
                                                </h3>
                                                <p className="text-sm text-[#f9ebd1] mb-1">
                                                    Ticket Type: {item.title.includes('YELLOW') ? 'Adult' : 'Child'}
                                                </p>
                                                <p className="text-sm text-[#f9ebd1]">
                                                    Qty: {item.quantity}
                                                </p>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => handleRemoveItem(item.id)}
                                                    className="text-[#f9ebd1] hover:text-red-400 p-1"
                                                >
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[#f9ebd1] font-semibold">
                                                {formatPrice((parseFloat(item.price) * item.quantity).toString())}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {state.items.length > 0 && (
                    <div className="border-t border-[#f9ebd1] p-4 space-y-4">
                        <div className="flex justify-between text-md font-medium text-[#f9ebd1]">
                            <span>CART SUBTOTAL:</span>
                            <span>{formatPrice(state.totalPrice.toString())}</span>
                        </div>
                        <button
                            onClick={handleProceedToCheckout}
                            disabled={isCheckingOut}
                            className="w-full text-xs bg-[#aa3030] text-[#f9ebd1] py-3 rounded-full font-semibold uppercase hover:bg-[#105974] disabled:opacity-50 transition-colors"
                        >
                            {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}