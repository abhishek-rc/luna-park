'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import { useState, useRef } from 'react';

interface Event {
    _metadata: {
        uid: string;
    };
    event_heading: string;
    event_description: string;
    event_image: {
        url: string;
    };
    event_card_cta: {
        href: string;
        title: string;
    };
}

interface EventCarouselProps {
    events: Event[];
    startIndex?: number;
}

export default function EventCarousel({ events, startIndex = 0 }: EventCarouselProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [totalSlides, setTotalSlides] = useState(0);
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);
    const swiperRef = useRef<SwiperType | null>(null);

    return (
        <div className="relative">
            <Swiper
                modules={[Navigation]}
                spaceBetween={2}
                slidesPerView={2.5}
                onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                    setTotalSlides(swiper.slides.length);
                    setIsBeginning(swiper.isBeginning);
                    setIsEnd(swiper.isEnd);
                }}
                onSlideChange={(swiper) => {
                    setCurrentSlide(swiper.activeIndex);
                    setIsBeginning(swiper.isBeginning);
                    setIsEnd(swiper.isEnd);
                }}
                breakpoints={{
                    320: {
                        slidesPerView: 1.2,
                        spaceBetween: 8,
                    },
                    640: {
                        slidesPerView: 2,
                        spaceBetween: 8,
                    },
                    768: {
                        slidesPerView: 2.5,
                        spaceBetween: 8,
                    },
                    1024: {
                        slidesPerView: 2.5,
                        spaceBetween: 8,
                    },
                }}
                className="events-carousel"
            >
                {events.map((event, index) => {
                    // Even/odd rotation pattern based on actual event index
                    const actualIndex = startIndex + index;
                    const rotationClass = actualIndex % 2 === 0 ? '-rotate-1' : 'rotate-2';
                    // const rotationClass = '';

                    return (
                        <SwiperSlide key={event?._metadata?.uid}>
                            <div
                                className={`relative group transform transition-transform duration-500 ${rotationClass}`}
                                style={{
                                    WebkitMaskImage: 'url(/ticket-pass-h.svg)',
                                    WebkitMaskSize: 'contain',
                                    WebkitMaskRepeat: 'no-repeat',
                                    WebkitMaskPosition: 'center',
                                    maskImage: 'url(/ticket-pass-h.svg)',
                                    maskSize: 'contain',
                                    maskRepeat: 'no-repeat',
                                    maskPosition: 'center',
                                    width: '400px',
                                    height: '240px',
                                    scale: '1.2',

                                }}
                            >
                                {/* Card Content */}
                                <div className="bg-[#f9ebd1] flex items-stretch h-full">
                                    {/* Left Section - Event Image (60% width) */}
                                    <div className="relative w-3/7 h-full overflow-hidden">
                                        <Image
                                            src={event?.event_image?.url || '/'}
                                            alt={event?.event_heading || 'Event'}
                                            fill
                                            className="object-cover w-full h-full"
                                            style={{
                                                objectFit: 'cover',
                                                objectPosition: 'center'
                                            }}
                                        />
                                    </div>

                                    {/* Right Section - Event Details (40% width) */}
                                    <div className="w-4/7 bg-[#f9ebd1] h-58 py-10 px-6 flex flex-col relative">
                                        <div className="flex-1 flex flex-col justify-start">
                                            <h3 className="text-md font-bold text-[#305871] mb-3 leading-tight">
                                                {event?.event_heading}
                                            </h3>
                                            <p className="text-xs text-[#305871] line-clamp-3 leading-relaxed h-[3.6rem] overflow-hidden">
                                                {event?.event_description}
                                            </p>
                                        </div>

                                        {/* Button positioned at bottom */}
                                        <div className="absolute bottom-8 left-6 right-6">
                                            <Link
                                                href={event?.event_card_cta?.href || '#'}
                                                className="inline-block bg-[#aa3030] text-[#f9ebd1] font-medium py-2 px-4 rounded-full hover:bg-[#305871] transition-colors duration-200 text-xs uppercase tracking-wide"
                                            >
                                                {event?.event_card_cta?.title}
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    );
                })}
            </Swiper>

            {/* Custom Navigation Buttons */}
            {!isBeginning && (
                <button
                    onClick={() => swiperRef.current?.slidePrev()}
                    className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-[#aa3030] rounded-full flex items-center justify-center text-white transition-colors duration-200 shadow-lg cursor-pointer"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            )}
            {!isEnd && (
                <button
                    onClick={() => swiperRef.current?.slideNext()}
                    className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-[#aa3030] rounded-full flex items-center justify-center text-white transition-colors duration-200 shadow-lg cursor-pointer"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            )}
        </div>
    );
}
