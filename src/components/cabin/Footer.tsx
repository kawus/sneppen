import { cabin } from "@/lib/cabin";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.04] px-6 py-16 md:px-12 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <span className="font-serif text-xl tracking-tight text-cabin-cream/80">
              {cabin.name}
            </span>
            <p className="mt-1 text-sm text-cabin-cream/30">
              {cabin.location.city}, {cabin.location.country}
            </p>
          </div>
          <div className="flex items-center gap-6 text-sm text-cabin-cream/30">
            <a
              href="#gallery"
              className="transition-colors duration-200 hover:text-cabin-cream/60"
            >
              Gallery
            </a>
            <a
              href="#booking"
              className="transition-colors duration-200 hover:text-cabin-cream/60"
            >
              Book
            </a>
            <span>&copy; {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
