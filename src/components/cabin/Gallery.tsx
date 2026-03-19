"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { cabin } from "@/lib/cabin";

function Lightbox({
  images,
  index,
  onClose,
  onNext,
  onPrev,
}: {
  images: typeof cabin.images;
  index: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onNext, onPrev]);

  const image = images[index];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-label="Image lightbox"
      aria-modal="true"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 flex size-10 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors duration-200 hover:bg-white/20 hover:text-white"
        aria-label="Close lightbox"
      >
        <X className="size-5" />
      </button>

      {/* Counter */}
      <div className="absolute top-5 left-6 text-sm font-medium text-white/50">
        {index + 1} / {images.length}
      </div>

      {/* Previous */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        className="absolute left-4 z-10 flex size-12 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors duration-200 hover:bg-white/20 hover:text-white md:left-8"
        aria-label="Previous image"
      >
        <ChevronLeft className="size-6" />
      </button>

      {/* Image */}
      <div
        className="relative h-[70vh] w-[90vw] max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          className="object-contain"
          sizes="90vw"
          priority
        />
      </div>

      {/* Next */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        className="absolute right-4 z-10 flex size-12 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors duration-200 hover:bg-white/20 hover:text-white md:right-8"
        aria-label="Next image"
      >
        <ChevronRight className="size-6" />
      </button>

      {/* Caption */}
      <p className="absolute bottom-8 max-w-lg px-6 text-center text-sm text-white/50">
        {image.alt}
      </p>
    </div>
  );
}

export function Gallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const nextImage = useCallback(() => {
    setLightboxIndex((prev) =>
      prev !== null ? (prev + 1) % cabin.images.length : null
    );
  }, []);

  const prevImage = useCallback(() => {
    setLightboxIndex((prev) =>
      prev !== null
        ? (prev - 1 + cabin.images.length) % cabin.images.length
        : null
    );
  }, []);

  const images = cabin.images;

  return (
    <section id="gallery" className="px-6 py-24 md:px-12 lg:px-20" aria-label="Photo gallery">
      {/* Section heading */}
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-medium uppercase tracking-widest text-cabin-amber">
          Gallery
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-cabin-cream md:text-4xl">
          Step inside
        </h2>
        <p className="mt-3 max-w-xl text-base text-cabin-cream/50">
          From the warmth of the fireplace to the silence of the forest —
          every corner of Sneppen has been designed for calm.
        </p>

        {/* Airbnb-style grid: 1 large + 4 smaller */}
        <div className="mt-12 grid grid-cols-1 gap-2 md:grid-cols-4 md:grid-rows-2">
          {/* Large featured image */}
          <button
            onClick={() => openLightbox(0)}
            className="group relative col-span-1 aspect-[4/3] overflow-hidden rounded-xl md:col-span-2 md:row-span-2 md:aspect-auto"
            aria-label={`View ${images[0].alt}`}
          >
            <Image
              src={images[0].src}
              alt={images[0].alt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
          </button>

          {/* 4 smaller images */}
          {images.slice(1, 5).map((img, i) => (
            <button
              key={i}
              onClick={() => openLightbox(i + 1)}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl"
              aria-label={`View ${img.alt}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
            </button>
          ))}
        </div>

        {/* Remaining images — smaller horizontal scroll on mobile, grid on desktop */}
        {images.length > 5 && (
          <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-5">
            {images.slice(5).map((img, i) => (
              <button
                key={i + 5}
                onClick={() => openLightbox(i + 5)}
                className="group relative aspect-[4/3] overflow-hidden rounded-xl"
                aria-label={`View ${img.alt}`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 50vw, 20vw"
                />
                <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
              </button>
            ))}
          </div>
        )}

        {/* Show all photos button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => openLightbox(0)}
            className="rounded-full border border-white/10 px-6 py-2.5 text-sm font-medium text-cabin-cream/70 transition-all duration-200 hover:border-white/20 hover:text-cabin-cream"
          >
            View all {images.length} photos
          </button>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          index={lightboxIndex}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}
    </section>
  );
}
