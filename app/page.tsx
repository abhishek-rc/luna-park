import Image from "next/image";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="font-sans min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <Image
            className="dark:invert mx-auto mb-6"
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />
          <h1 className="text-4xl font-bold mb-4">Luna Park + Contentstack</h1>
          <p className="text-gray-600 text-lg">
            A Next.js application integrated with Contentstack CMS
          </p>
        </div>


        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Next.js 15</h3>
            <p className="text-gray-600">
              Latest version with App Router, React 19, and TypeScript support.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Contentstack SDK</h3>
            <p className="text-gray-600">
              Headless CMS integration with live preview and content management.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Tailwind CSS</h3>
            <p className="text-gray-600">
              Utility-first CSS framework for rapid UI development.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
