import { Hero } from "@/components/cabin/Hero";
import { Gallery } from "@/components/cabin/Gallery";
import { PropertyDetails } from "@/components/cabin/PropertyDetails";
import { BookingWidget } from "@/components/cabin/BookingWidget";
import { Footer } from "@/components/cabin/Footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-cabin-dark">
      <Hero />
      <Gallery />
      <PropertyDetails />
      <BookingWidget />
      <Footer />
    </main>
  );
}
