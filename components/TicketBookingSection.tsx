'use client';

import { useState, useEffect } from 'react';
import { useHomePageData } from '../hooks/useHomePageData';
import { ProductMappingService } from '../services/ProductMappingService';
import { EnhancedHomepageTicketCard } from '../typescript/layout';
import { formatPrice, getProductImageUrl } from '../shopify-sdk/utils';
import { useShopifyProducts } from '../hooks/useShopifyProducts';
import { useCart } from '../contexts/CartContext';
import Image from 'next/image';

export default function TicketBookingSection() {
    const { homepageData, loading, error } = useHomePageData();
    const [activeTab, setActiveTab] = useState(1);
    const [enhancedCards, setEnhancedCards] = useState<EnhancedHomepageTicketCard[]>([]);
    const [enhancementLoading, setEnhancementLoading] = useState(false);

    const { products, loading: productsLoading, error: productsError } = useShopifyProducts();
    const { addToCart } = useCart();

    console.log('products>>>>>>>>>>>>', products);

    // Enhance cards with Shopify data when products are loaded
    useEffect(() => {
        const enhanceCards = async () => {
            if (homepageData?.ticketbooking_group && products.length > 0) {
                setEnhancementLoading(true);
                try {
                    const allCards = homepageData.ticketbooking_group.flatMap(group => group.ticketbooking_cards || []);
                    const enhanced = await ProductMappingService.enhanceTicketCardsWithShopifyData(allCards);
                    setEnhancedCards(enhanced);
                } catch (error) {
                    console.error('Error enhancing cards:', error);
                } finally {
                    setEnhancementLoading(false);
                }
            }
        };

        enhanceCards();
    }, [homepageData, products]);

    const handleBuyNow = async (card: any, enhancedCard: EnhancedHomepageTicketCard) => {
        if (!enhancedCard.shopifyProduct || !enhancedCard.isAvailable) {
            alert('This product is not available for purchase');
            return;
        }

        const defaultVariant = enhancedCard.shopifyProduct.variants[0];
        if (!defaultVariant) {
            alert('No variants available for this product');
            return;
        }

        try {
            await addToCart({
                product: enhancedCard.shopifyProduct,
                variantId: defaultVariant.id,
                quantity: 1,
                price: defaultVariant.price,
                title: enhancedCard.shopifyProduct.title,
                image: enhancedCard.shopifyProduct.images[0]?.url,
            });

            alert('Item added to cart successfully!');
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Failed to add item to cart. Please try again.');
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
                <div className="text-center mb-20 relative">
                    <h2 className="text-2xl md:text-4xl font-black text-[#f9ebd1] uppercase">
                        BOOK YOUR TICKETS ONLINE
                    </h2>

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

                                        {/* Buy Now Button */}
                                        {enhancedCard && (
                                            <div className="mt-4">
                                                <button
                                                    onClick={() => handleBuyNow(card, enhancedCard)}
                                                    disabled={!enhancedCard.isAvailable || !enhancedCard.shopifyProduct}
                                                    className={`w-full py-2 px-4 rounded-md font-semibold text-sm uppercase transition-all duration-200 ${enhancedCard.isAvailable && enhancedCard.shopifyProduct
                                                        ? 'bg-[#aa3030] text-white hover:bg-[#8a2525] hover:shadow-lg'
                                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                        }`}
                                                >
                                                    {enhancedCard.isAvailable && enhancedCard.shopifyProduct
                                                        ? 'Buy Now'
                                                        : 'Not Available'
                                                    }
                                                </button>
                                            </div>
                                        )}
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
        </section>
    );
}
