import HeroSection from "../components/HeroSection";
import TicketBookingSection from "../components/TicketBookingSection";
import EventsSection from "../components/EventsSection";

export default function Home() {
  return (
    <div className="font-sans min-h-screen">
      <main>
        <HeroSection />
        <TicketBookingSection />
        <EventsSection />
      </main>
    </div>
  );
}
