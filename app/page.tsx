import Footer from "../components/Footer";
import DynamicHomepage from "../components/DynamicHomepage";

export default function Home() {
  return (
    <div className="font-sans min-h-screen">
      <DynamicHomepage />
      <Footer />
    </div>
  );
}
