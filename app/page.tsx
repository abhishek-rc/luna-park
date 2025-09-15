import Image from "next/image";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import TicketBookingSection from "../components/TicketBookingSection";
import EventsSection from "../components/EventsSection";
import MemoryPartyGroupSection from "../components/MemoryPartyGroupSection";

export default function Home() {
  return (
    <div className="font-sans min-h-screen">
      <main>
        <HeroSection />
        <TicketBookingSection />
        <EventsSection />
        <MemoryPartyGroupSection />
      </main>
      <Footer />
    </div>
  );
}
