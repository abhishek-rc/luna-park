'use client';

import { useState } from 'react';
import { useHomePageData } from '../hooks/useHomePageData';
import Image from 'next/image';
import Link from 'next/link';

export default function TicketBookingSection() {
    const { homepageData, loading, error } = useHomePageData();
    const [activeTab, setActiveTab] = useState(1);

    if (loading) {
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

    const { ticketbooking_group } = homepageData;
    const activeTabData = ticketbooking_group?.find(tab => tab?.tab_id === activeTab);

    return (
        <section className="bg-[#305871] py-24 px-60">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Section Title */}
                <div className="text-center mb-20">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#f9ebd1] uppercase">
                        BOOK YOUR TICKETS ONLINE
                    </h2>
                </div>

                {/* Tab Navigation */}
                <div className="flex justify-center mb-12">
                    <div className="flex space-x-2">
                        {ticketbooking_group?.map((tab) => (
                            <button
                                key={tab?.tab_id}
                                onClick={() => setActiveTab(tab?.tab_id)}
                                className={`py-2 font-semibold text-xs w-30 uppercase transition-all duration-200 cursor-pointer ${activeTab === tab?.tab_id
                                    ? 'bg-[#aa3030] text-white'
                                    : 'bg-[#f9ebd1] text-[#305871]'
                                    }`}
                            >
                                {tab?.tab_name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Ticket Cards Grid */}
                {activeTabData && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activeTabData?.ticketbooking_cards?.map((card) => (
                            <div
                                key={card?._metadata?.uid}
                                className="bg-[#e1e8ec] rounded-4xl overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-500"
                            >
                                {/* Card Image */}
                                <div className="relative h-48 w-full">
                                    <Image
                                        src={card?.card_image?.url || '/'}
                                        alt={card?.card_title || 'Card'}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                {/* Card Content */}
                                <div className="p-4 pb-6">
                                    <h3 className="text-lg font-bold text-[#305871] mb-4">
                                        {card?.card_title}
                                    </h3>

                                    {/* CTA Button */}
                                    <Link
                                        href={card?.card_cta?.href || '#'}
                                        className="block w-full text-center bg-white border-1 border-[#aa3030] hover:border-[#305871] text-[#aa3030] font-bold py-2 px-4 rounded-full hover:text-[#305871] transition-all duration-200 text-xs"
                                    >
                                        {card?.card_cta?.title}
                                    </Link>
                                </div>
                            </div>
                        ))}
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
