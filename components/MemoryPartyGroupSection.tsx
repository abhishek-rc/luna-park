'use client';

import { HomepageMemoryCard } from '../typescript/layout';
import Image from 'next/image';

interface MemoryPartyGroupSectionProps {
    data: {
        memory_party_group: {
            memory_booking_card: HomepageMemoryCard[];
        };
    };
}

export default function MemoryPartyGroupSection({ data }: MemoryPartyGroupSectionProps) {

    if (!data) {
        return (
            <section className="bg-[#305871] py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center">
                        <div className="animate-pulse">
                            <div className="h-6 bg-[#305871] rounded w-64 mx-auto mb-4"></div>
                            <div className="h-12 bg-[#305871] rounded w-96 mx-auto mb-12"></div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="bg-[#305871] rounded-lg h-80"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    const cards = data?.memory_party_group?.memory_booking_card || [];

    // Debug logging
    console.log('Memory Party Group Data:', data);
    console.log('Cards:', cards);

    return (
        <section className="bg-[#305871] py-16 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h3 className="text-[#e1bf8d] text-lg font-medium mb-4">
                        GROUP AND PARTY BOOKINGS
                    </h3>
                    <h2 className="text-[#f9ebd1] text-2xl md:text-4xl font-bold">
                        MEMORIES TO LAST A LIFETIME
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {cards?.map((card, index) => (
                        <div key={card?._metadata?.uid || index} className="relative group">
                            <div className="relative overflow-hidden rounded-4xl h-108">
                                {card?.memory_card_image?.url ? (
                                    <Image
                                        src={card.memory_card_image.url}
                                        alt={card?.memory_card_title || 'Memory Card'}
                                        fill
                                        className="object-cover transition-transform duration-300"
                                        onError={(e) => {
                                            console.error('Image failed to load:', card?.memory_card_image?.url);
                                            console.error('Error:', e);
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                                        <span className="text-white text-lg">No Image</span>
                                    </div>
                                )}
                            </div>

                            <div className="absolute bottom-10 left-4 right-4">
                                <div className="relative bg-white rounded-2xl border-3 border-teal-600 px-6 py-4 shadow-sm">
                                    {/* Top middle rounded tab */}
                                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-8 bg-white border-3 border-teal-600 border-b-0 rounded-t-full"></div>

                                    <button className="w-full text-teal-600 font-medium text-lg tracking-wide cursor-pointer hover:text-teal-700 transition-colors">
                                        {card?.memory_card_title || 'School Bookings'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center cursor-pointer">
                    <button className="border-1 border-[#f9ebd1] text-[#f9ebd1] font-semibold py-3 px-6 text-xs rounded-full hover:bg-[#f9ebd1] hover:text-[#305871] transition-all duration-200 cursor-pointer">
                        LEARN MORE
                    </button>
                </div>
            </div>
        </section>
    );
}
