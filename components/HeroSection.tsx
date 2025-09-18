'use client';

import { useState } from 'react';
import Link from 'next/link';

interface HeroSectionProps {
    data: {
        hero_section: {
            hero_cover_video: {
                url: string;
            };
            hero_cta: {
                title: string;
                href: string;
            };
        };
    };
}

export default function HeroSection({ data }: HeroSectionProps) {
    const [videoLoaded, setVideoLoaded] = useState(false);
    const [videoError, setVideoError] = useState(false);

    // Show loading state while data is being processed
    if (!data) {
        return (
            <section className="relative h-[90vh] bg-[#2a324a] flex items-center justify-center">
                <div className="container mx-auto px-4">
                    <div className="animate-pulse flex flex-col items-center justify-center space-y-4">
                        <div className="h-8 bg-[#2a324a] rounded w-48"></div>
                        <div className="h-6 bg-[#2a324a] rounded w-32"></div>
                        <div className="h-12 bg-[#2a324a] rounded-full w-48"></div>
                    </div>
                </div>
            </section>
        );
    }

    const { hero_section } = data;

    return (
        <section className="relative h-[90vh] overflow-hidden">90
            {/* Video Background */}
            <div className="absolute inset-0 w-full h-full">
                <video
                    className={`w-full h-full object-cover transition-opacity duration-500 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
                    autoPlay
                    muted
                    loop
                    playsInline
                    onError={(e) => {
                        console.error('Video error:', e);
                        setVideoError(true);
                    }}
                    onLoadStart={() => console.log('Video loading started')}
                    onCanPlay={() => {
                        console.log('Video can play');
                        setVideoLoaded(true);
                    }}
                    onLoadedData={() => {
                        console.log('Video data loaded');
                        setVideoLoaded(true);
                    }}
                >
                    <source src={hero_section?.hero_cover_video?.url || ''} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex items-end justify-center pb-52">
                <div className="text-center text-white px-4 max-w-4xl mx-auto">
                    {/* Main CTA Button */}
                    <div>
                        <Link
                            href={hero_section?.hero_cta?.href || '#'}
                            className="inline-block bg-[#aa3030] text-white font-semibold text-sm px-8 py-2.5 rounded-full transition-all duration-300 transform hover:scale-105 shadow-2xl"
                        >
                            {hero_section?.hero_cta?.title}
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
