'use client';

import { useState, useEffect } from 'react';
import { useHomePageData } from '../hooks/useHomePageData';
import { useShopifyProducts } from '../hooks/useShopifyProducts';
import { useCart } from '../hooks/useShopifyCheckout';
import { ProductMappingService } from '../services/ProductMappingService';
import { EnhancedHomepageTicketCard } from '../typescript/layout';
import { formatPrice, getProductImageUrl, getDefaultVariant } from '../shopify-sdk/utils';
import CartModal from './CartModal';
import Image from 'next/image';
import Link from 'next/link';

export default function TicketBookingSection() {
    const { homepageData, loading, error } = useHomePageData();
    const [activeTab, setActiveTab] = useState(1);
    const [enhancedCards, setEnhancedCards] = useState<EnhancedHomepageTicketCard[]>([]);
    const [enhancementLoading, setEnhancementLoading] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { addToCart, getCartItemCount } = useCart();

    // Enhance ticket cards with Shopify data
    useEffect(() => {
        const enhanceCards = async () => {
            if (!homepageData?.ticketbooking_group) return;

            setEnhancementLoading(true);
            try {
                const allCards = homepageData.ticketbooking_group.flatMap(group => group.ticketbooking_cards || []);
                const enhanced = await ProductMappingService.enhanceTicketCardsWithShopifyData(allCards);
                setEnhancedCards(enhanced);
            } catch (error) {
                console.error('Error enhancing cards with Shopify data:', error);
            } finally {
                setEnhancementLoading(false);
            }
        };

        enhanceCards();
    }, [homepageData]);

    console.log("enhancedCards>>>>>>>>>>>>", enhancedCards);

    const handleAddToCart = async (card: EnhancedHomepageTicketCard) => {
        if (!card.shopifyProduct || !card.isAvailable) {
            alert('This product is not available for purchase');
            return;
        }

        const defaultVariant = getDefaultVariant(card.shopifyProduct);
        if (!defaultVariant) {
            alert('No variants available for this product');
            return;
        }

        try {
            const success = await addToCart(card.shopifyProduct, defaultVariant.id, 1);
            if (success) {
                alert('Added to cart successfully!');
            } else {
                alert('Failed to add to cart');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Error adding to cart');
        }
    };

    if (loading || enhancementLoading) {
        return (
            <section className="bg-[#2a324a] py-16">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="animate-pulse">
                        <div className="h-8 bg-[#2a324a] rounded w-80 mx-auto mb-12"></div>
                        <div className="flex justify-center space-x-4 mb-12">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="h-10 bg-[#2a324a] rounded w-24"></div>
                            ))}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="bg-gray-200 rounded-lg h-80"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (error || !homepageData) {
        return (
            <section className="bg-[#2a324a] py-16">
                <div className="container mx-auto px-4 text-center max-w-7xl">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
                        <p className="font-bold">Error loading ticket section</p>
                        <p>{error || 'No data available'}</p>
                    </div>
                </div>
            </section>
        );
    }

    const { ticketbooking_group } = homepageData || {};
    const activeTabData = ticketbooking_group?.find(tab => tab?.tab_id === activeTab);

    return (
        <section className="bg-[#305871] py-24">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Section Title */}
                <div className="text-center mb-20">
                    <h2 className="text-2xl md:text-4xl font-black text-[#f9ebd1] uppercase">
                        BOOK YOUR TICKETS ONLINE
                    </h2>
                    {/* Cart Indicator */}
                    {getCartItemCount() > 0 && (
                        <div className="mt-4">
                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="bg-[#aa3030] hover:bg-[#8a2525] text-white px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200"
                            >
                                {getCartItemCount()} item{getCartItemCount() !== 1 ? 's' : ''} in cart - View Cart
                            </button>
                        </div>
                    )}
                </div>

                {/* Tab Navigation */}
                <div className="flex justify-center mb-12">
                    <div className="flex space-x-2">
                        {ticketbooking_group?.map((tab) => (
                            <button
                                key={tab?.tab_id}
                                onClick={() => setActiveTab(tab?.tab_id || 1)}
                                className={`py-2 font-semibold text-sm w-30 uppercase transition-all duration-200 cursor-pointer ${activeTab === tab?.tab_id
                                    ? 'bg-[#aa3030] text-white'
                                    : 'bg-[#f9ebd1] text-[#305871]'
                                    }`}
                            >
                                {tab?.tab_name || 'Tab'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Ticket Cards Grid */}
                {activeTabData && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activeTabData?.ticketbooking_cards?.map((card) => {
                            // Find enhanced card data
                            const enhancedCard = enhancedCards.find(enhanced =>
                                enhanced._metadata?.uid === card?._metadata?.uid
                            );

                            return (
                                <div
                                    key={card?._metadata?.uid}
                                    className="bg-[#e1e8ec] rounded-4xl overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-500"
                                >
                                    {/* Card Image */}
                                    <div className="relative h-48 w-full">
                                        <Image
                                            src={
                                                enhancedCard?.shopifyProduct
                                                    ? getProductImageUrl(enhancedCard.shopifyProduct)
                                                    : card?.card_image?.url || '/'
                                            }
                                            alt={card?.card_title || 'Card'}
                                            fill
                                            className="object-cover"
                                        />
                                        {/* Availability Badge */}
                                        {enhancedCard && (
                                            <div className="absolute top-2 right-2">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${enhancedCard.isAvailable
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-red-500 text-white'
                                                    }`}>
                                                    {enhancedCard.isAvailable ? 'Available' : 'Unavailable'}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-4 pb-6">
                                        <h3 className="text-2xl py-3 font-black text-[#305871] mb-2">
                                            {card?.card_title || 'Ticket'}
                                        </h3>

                                        {/* Price Display */}
                                        {enhancedCard?.price && (
                                            <div className="mb-4">
                                                <span className="text-2xl font-bold text-[#aa3030]">
                                                    {formatPrice(enhancedCard.price)}
                                                </span>
                                                {enhancedCard.compareAtPrice && enhancedCard.compareAtPrice !== enhancedCard.price && (
                                                    <span className="text-lg text-gray-500 line-through ml-2">
                                                        {formatPrice(enhancedCard.compareAtPrice)}
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        {/* Inventory Status */}
                                        {enhancedCard?.inventoryQuantity !== undefined && (
                                            <div className="mb-4 text-sm text-gray-600">
                                                {enhancedCard.inventoryQuantity > 0
                                                    ? `${enhancedCard.inventoryQuantity} in stock`
                                                    : 'Out of stock'
                                                }
                                            </div>
                                        )}

                                        {/* CTA Buttons */}
                                        <div className="space-y-2">
                                            {enhancedCard?.shopifyProduct && enhancedCard.isAvailable ? (
                                                <button
                                                    onClick={() => handleAddToCart(enhancedCard)}
                                                    className="w-full bg-[#aa3030] hover:bg-[#8a2525] text-white font-black py-3 px-4 rounded-full transition-all duration-200 text-xs"
                                                >
                                                    Add to Cart
                                                </button>
                                            ) : (
                                                <button
                                                    disabled
                                                    className="w-full bg-gray-400 text-gray-600 font-black py-3 px-4 rounded-full cursor-not-allowed text-xs"
                                                >
                                                    {enhancedCard?.isAvailable === false ? 'Unavailable' : 'Loading...'}
                                                </button>
                                            )}

                                            {/* Original CTA Link as fallback */}
                                            <Link
                                                href={card?.card_cta?.href || '#'}
                                                className="block w-full text-center bg-[#e1e8ec] border-1 border-[#aa3030] hover:border-[#305871] text-[#aa3030] font-black py-2 px-4 rounded-full hover:text-[#305871] transition-all duration-200 text-xs"
                                            >
                                                {card?.card_cta?.title || 'View Details'}
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* No cards message */}
                {activeTabData && activeTabData?.ticketbooking_cards?.length === 0 && (
                    <div className="text-center text-white py-12">
                        <p className="text-lg">No tickets available for this category.</p>
                    </div>
                )}
            </div>

            {/* Cart Modal */}
            <CartModal
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
            />
        </section>
    );
}
