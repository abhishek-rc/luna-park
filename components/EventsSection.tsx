'use client';

import { useHomePageData } from '../hooks/useHomePageData';
import EventCarousel from './EventCarousel';

export default function EventsSection() {
    const { homepageData, loading, error } = useHomePageData();

    if (loading) {
        return (
            <section className="bg-[#305871] py-16">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="animate-pulse">
                        <div className="h-8 bg-[#305871] rounded w-80 mx-auto mb-12"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="bg-gray-200 rounded-lg h-80"></div>
                            ))}
                        </div>
                        <div className="h-10 bg-[#305871] rounded w-48 mx-auto mt-8"></div>
                    </div>
                </div>
            </section>
        );
    }

    if (error || !homepageData) {
        return (
            <section className="bg-[#305871] py-16">
                <div className="container mx-auto px-4 text-center max-w-7xl">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
                        <p className="font-bold">Error loading events section</p>
                        <p>{error || 'No data available'}</p>
                    </div>
                </div>
            </section>
        );
    }

    const { event_group } = homepageData;
    const events = event_group?.event_card || [];

    // Function to split events into chunks for multiple carousels (max 2 carousels)
    const splitEventsIntoCarousels = (events: any[], maxEventsPerCarousel: number = 6) => {
        if (events.length <= maxEventsPerCarousel) {
            return [events];
        }

        // If more than 6 events, split into exactly 2 carousels
        const midPoint = Math.ceil(events.length / 2);
        return [
            events.slice(0, midPoint),
            events.slice(midPoint)
        ];
    };

    const eventCarousels = splitEventsIntoCarousels(events);

    return (
        <section className="bg-[#3C8091] py-24 px-60">
            <div className="container mx-auto max-w-7xl">
                {/* Section Title */}
                <div className="text-center">
                    <h2 className="text-2xl md:text-3xl font-bold uppercase text-[#f9ebd1]">
                        WHAT&apos;S ON AT LUNA PARK
                    </h2>
                </div>

                <div className='my-12'>
                    {/* Render multiple carousels if more than 6 events */}
                    {eventCarousels.map((carouselEvents, carouselIndex) => {
                        // Calculate start index based on previous carousels' event counts
                        const startIndex = carouselIndex === 0 ? 0 :
                            eventCarousels.slice(0, carouselIndex).reduce((sum, carousel) => sum + carousel.length, 0);

                        return (
                            <div key={carouselIndex} className={carouselIndex > 0 ? 'mt-16' : ''}>
                                <EventCarousel
                                    events={carouselEvents}
                                    startIndex={startIndex}
                                />
                            </div>
                        );
                    })}
                </div>

                {/* View All Events Button */}
                <div className="text-center cursor-pointer">
                    <button className="border-1 border-[#f9ebd1] text-[#f9ebd1] font-semibold py-2 px-6 text-xs rounded-full hover:bg-[#f9ebd1] hover:text-[#305871] transition-all duration-200 cursor-pointer">
                        VIEW ALL EVENTS
                    </button>
                </div>
            </div>
        </section>
    );
}