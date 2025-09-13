import HeroSection from "../components/HeroSection";
import TicketBookingSection from "../components/TicketBookingSection";

export default function Home() {
  return (
    <div className="font-sans min-h-screen">
      <main>
        <HeroSection />
        <TicketBookingSection />
      </main>
    </div>
  );
}
