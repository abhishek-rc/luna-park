'use client';

import React from 'react';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../shopify-sdk/utils';
import Image from 'next/image';

export default function Cart() {
    const { state, removeFromCart, updateQuantity, clearCart, closeCart } = useCart();
    const [isCheckingOut, setIsCheckingOut] = React.useState(false);

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

    if (state.isLoading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-center">Loading cart...</p>
                </div>
            </div>
        );
    }

    if (!state.isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-end">
            <div className="bg-white w-full max-w-md h-full max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold">Shopping Cart</h2>
                    <button
                        onClick={closeCart}
                        className="text-gray-500 hover:text-gray-700"
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
                            <svg className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                            </svg>
                            <p className="text-gray-500">Your cart is empty</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {state.items.map((item) => (
                                <div key={item.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                                    {item.image && (
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            width={60}
                                            height={60}
                                            className="rounded-md object-cover"
                                        />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-medium text-gray-900 truncate">
                                            {item.title}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {formatPrice(item.price)}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                            className="h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                                        >
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                            </svg>
                                        </button>
                                        <span className="w-8 text-center text-sm font-medium">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                            className="h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                                        >
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveItem(item.id)}
                                        className="text-red-500 hover:text-red-700 p-1"
                                    >
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {state.items.length > 0 && (
                    <div className="border-t p-4 space-y-4">
                        <div className="flex justify-between text-lg font-semibold">
                            <span>Total ({state.totalItems} items):</span>
                            <span>{formatPrice(state.totalPrice.toString())}</span>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={handleClearCart}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Clear Cart
                            </button>
                            <button
                                onClick={() => setIsCheckingOut(true)}
                                disabled={isCheckingOut}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                            >
                                {isCheckingOut ? 'Processing...' : 'Checkout'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}