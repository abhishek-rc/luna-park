'use client';

import EventsSection from './EventsSection';
import HeroSection from './HeroSection';
import TicketBookingSection from './TicketBookingSection';
import MemoryPartyGroupSection from './MemoryPartyGroupSection';

// Main Component Mapper
interface ComponentMapperProps {
    modularBlocks: Array<{
        [key: string]: any;
    }>;
}

export default function ComponentMapper({ modularBlocks }: ComponentMapperProps) {
    return (
        <div>
            {modularBlocks?.map((block, index) => {
                // Get the first key from the block (which is the component type)
                const componentType = Object.keys(block)[0];
                const componentData = block[componentType];

                switch (componentType) {
                    case 'hero_video_section':
                        return <HeroSection key={index} data={componentData} />;
                    case 'ticket_booking_tabs':
                        return <TicketBookingSection key={index} data={componentData} />;
                    case 'event_carousel':
                        return <EventsSection key={index} data={componentData} />;
                    case 'memory_section':
                        return <MemoryPartyGroupSection key={index} data={componentData} />;
                    default:
                        console.warn(`Unknown component type: ${componentType}`);
                        return null;
                }
            })}
        </div>
    );
}