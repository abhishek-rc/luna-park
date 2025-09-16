'use client';

import { useState } from 'react';
import { useCart } from '../hooks/useShopifyCheckout';
import { formatPrice } from '../shopify-sdk/utils';
import Image from 'next/image';

interface CartModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
    const { checkout, updateCartItemQuantity, removeFromCart, getCartTotal } = useCart();
    const [isUpdating, setIsUpdating] = useState(false);

    if (!isOpen) return null;

    const handleQuantityChange = async (variantId: string, newQuantity: number) => {
        if (newQuantity < 0) return;

        setIsUpdating(true);
        try {
            await updateCartItemQuantity(variantId, newQuantity);
        } catch (error) {
            console.error('Error updating quantity:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleRemoveItem = async (variantId: string) => {
        setIsUpdating(true);
        try {
            await removeFromCart(variantId);
        } catch (error) {
            console.error('Error removing item:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const total = getCartTotal();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">Shopping Cart</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                        ×
                    </button>
                </div>

                {/* Cart Items */}
                <div className="p-6 overflow-y-auto max-h-96">
                    {!checkout || checkout.lineItems.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500 text-lg">Your cart is empty</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {checkout.lineItems.map((item) => (
                                <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                                    {/* Product Image */}
                                    <div className="w-16 h-16 relative">
                                        <Image
                                            src="/placeholder-product.jpg" // You might want to get this from the product
                                            alt={item.title}
                                            fill
                                            className="object-cover rounded"
                                        />
                                    </div>

                                    {/* Product Details */}
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-800">{item.title}</h3>
                                        <p className="text-sm text-gray-600">{item.variant.title}</p>
                                        <p className="text-lg font-bold text-[#aa3030]">
                                            {formatPrice(item.variant.price)}
                                        </p>
                                    </div>

                                    {/* Quantity Controls */}
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handleQuantityChange(item.variant.id, item.quantity - 1)}
                                            disabled={isUpdating || item.quantity <= 1}
                                            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                        >
                                            -
                                        </button>
                                        <span className="w-8 text-center font-semibold">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => handleQuantityChange(item.variant.id, item.quantity + 1)}
                                            disabled={isUpdating}
                                            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                        >
                                            +
                                        </button>
                                    </div>

                                    {/* Remove Button */}
                                    <button
                                        onClick={() => handleRemoveItem(item.variant.id)}
                                        disabled={isUpdating}
                                        className="text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {checkout && checkout.lineItems.length > 0 && (
                    <div className="border-t p-6">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-xl font-bold">Total:</span>
                            <span className="text-2xl font-bold text-[#aa3030]">
                                {formatPrice(total.amount, total.currencyCode)}
                            </span>
                        </div>

                        <div className="space-y-2">
                            <button
                                onClick={() => window.open(checkout.webUrl, '_blank')}
                                className="w-full bg-[#aa3030] hover:bg-[#8a2525] text-white font-bold py-3 px-4 rounded-full transition-all duration-200"
                            >
                                Checkout on Shopify
                            </button>
                            <button
                                onClick={onClose}
                                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-full transition-all duration-200"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
