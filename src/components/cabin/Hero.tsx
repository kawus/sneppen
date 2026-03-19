"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronDown, Users, BedDouble, Bath, Bed } from "lucide-react";
import { cabin } from "@/lib/cabin";

export function Hero() {
  const [scrollY, setScrollY] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number | null = null;
    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        if (heroRef.current) {
          const rect = heroRef.current.getBoundingClientRect();
          if (rect.bottom > 0) {
            setScrollY(window.scrollY);
          }
        }
        rafId = null;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const heroImage = cabin.images[0];

  return (
    <section
      ref={heroRef}
      className="relative h-screen min-h-[600px] w-full overflow-hidden"
      aria-label="Hero"
    >
      {/* Parallax background image */}
      <div
        className="absolute inset-0"
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
      >
        <Image
          src={heroImage.src}
          alt={heroImage.alt}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Dark overlay gradient — moody, cinematic */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70" />
        {/* Bottom fade to background color */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-cabin-dark to-transparent" />
      </div>

      {/* Content */}
      <div className="relative flex h-full flex-col items-center justify-center px-6">
        {/* Top nav bar — minimal */}
        <nav className="absolute inset-x-0 top-0 flex items-center justify-between px-6 py-6 md:px-12">
          <span className="font-serif text-lg tracking-tight text-white/90">
            Sneppen
          </span>
          <a
            href="#booking"
            className="text-sm font-medium text-white/70 transition-colors duration-200 hover:text-white"
          >
            Book now
          </a>
        </nav>

        {/* Main hero content */}
        <div className="flex flex-col items-center text-center">
          {/* Property name — dramatic editorial typography */}
          <h1
            className={`font-serif text-6xl font-semibold tracking-tight text-white transition-all duration-1000 ease-out md:text-8xl lg:text-9xl ${
              loaded
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            {cabin.name}
          </h1>

          {/* Tagline */}
          <p
            className={`mt-4 text-lg font-light tracking-wide text-white/70 transition-all delay-200 duration-1000 ease-out md:text-xl ${
              loaded
                ? "translate-y-0 opacity-100"
                : "translate-y-6 opacity-0"
            }`}
          >
            {cabin.tagline}
          </p>

          {/* Stats badges */}
          <div
            className={`mt-8 flex items-center gap-6 text-sm text-white/60 transition-all delay-400 duration-1000 ease-out md:gap-8 ${
              loaded
                ? "translate-y-0 opacity-100"
                : "translate-y-6 opacity-0"
            }`}
          >
            <div className="flex items-center gap-2">
              <Users className="size-4" />
              <span>{cabin.details.guests} guests</span>
            </div>
            <div className="h-3 w-px bg-white/20" />
            <div className="flex items-center gap-2">
              <BedDouble className="size-4" />
              <span>{cabin.details.bedrooms} bedrooms</span>
            </div>
            <div className="h-3 w-px bg-white/20" />
            <div className="flex items-center gap-2">
              <Bath className="size-4" />
              <span>{cabin.details.bathrooms} baths</span>
            </div>
            <div className="hidden h-3 w-px bg-white/20 sm:block" />
            <div className="hidden items-center gap-2 sm:flex">
              <Bed className="size-4" />
              <span>{cabin.details.beds} beds</span>
            </div>
          </div>

          {/* CTA Button */}
          <a
            href="#booking"
            className={`mt-10 inline-flex h-14 items-center justify-center rounded-full bg-cabin-cream px-10 text-base font-semibold tracking-tight text-cabin-dark transition-all delay-500 duration-1000 ease-out hover:bg-white hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] active:scale-[0.98] ${
              loaded
                ? "translate-y-0 opacity-100"
                : "translate-y-6 opacity-0"
            }`}
          >
            Book your stay
          </a>
        </div>

        {/* Scroll indicator */}
        <div
          className={`absolute bottom-8 flex flex-col items-center gap-2 transition-all delay-700 duration-1000 ease-out ${
            loaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <span className="text-xs font-medium uppercase tracking-widest text-white/40">
            Explore
          </span>
          <ChevronDown className="size-4 animate-bounce text-white/40" />
        </div>
      </div>
    </section>
  );
}
