"use client";

import {
  Wifi,
  Flame,
  Bath,
  ChefHat,
  Car,
  WashingMachine,
  Thermometer,
  ThermometerSun,
  Tv,
  Coffee,
  Utensils,
  Cross,
  Shield,
  Siren,
  Puzzle,
  Waves,
  Clock,
  Users,
  PawPrint,
  Cigarette,
  Volume2,
  MapPin,
  Star,
  MessageCircle,
} from "lucide-react";
import Image from "next/image";
import { cabin } from "@/lib/cabin";
import type { Amenity } from "@/lib/types";

const ICON_MAP: Record<string, React.ElementType> = {
  wifi: Wifi,
  flame: Flame,
  bath: Bath,
  "chef-hat": ChefHat,
  car: Car,
  "washing-machine": WashingMachine,
  thermometer: Thermometer,
  "thermometer-sun": ThermometerSun,
  tv: Tv,
  coffee: Coffee,
  utensils: Utensils,
  cross: Cross,
  shield: Shield,
  siren: Siren,
  puzzle: Puzzle,
  waves: Waves,
};

function AmenityIcon({ name }: { name: string }) {
  const Icon = ICON_MAP[name];
  if (!Icon) return <div className="size-5 rounded bg-white/5" />;
  return <Icon className="size-5" />;
}

function AmenityItem({ amenity }: { amenity: Amenity }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
        <AmenityIcon name={amenity.icon} />
      </div>
      <span className="text-sm text-cabin-cream/80">{amenity.name}</span>
    </div>
  );
}

export function PropertyDetails() {
  return (
    <section className="px-6 py-24 md:px-12 lg:px-20" aria-label="Property details">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr,400px] lg:gap-24">
          {/* Left column — description + amenities + rules */}
          <div className="space-y-16">
            {/* Description */}
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-cabin-amber">
                About
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-cabin-cream md:text-4xl">
                The cabin
              </h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-cabin-cream/60">
                {cabin.description.split("\n").filter(Boolean).map((paragraph, i) => (
                  <p key={i}>{paragraph.trim()}</p>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-white/[0.06]" />

            {/* Amenities */}
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-cabin-amber">
                Amenities
              </p>
              <h3 className="mt-3 text-2xl font-bold tracking-tight text-cabin-cream">
                Everything you need
              </h3>
              <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2">
                {cabin.amenities.map((amenity, i) => (
                  <AmenityItem key={i} amenity={amenity} />
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-white/[0.06]" />

            {/* House Rules */}
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-cabin-amber">
                House Rules
              </p>
              <h3 className="mt-3 text-2xl font-bold tracking-tight text-cabin-cream">
                A few things to know
              </h3>
              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
                    <Clock className="size-5 text-cabin-cream/60" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-cabin-cream">Check-in / Check-out</p>
                    <p className="mt-0.5 text-sm text-cabin-cream/50">
                      Check-in after {cabin.houseRules.checkIn} &middot; Check-out before{" "}
                      {cabin.houseRules.checkOut}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
                    <Users className="size-5 text-cabin-cream/60" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-cabin-cream">Maximum guests</p>
                    <p className="mt-0.5 text-sm text-cabin-cream/50">
                      Up to {cabin.houseRules.maxGuests} guests
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
                    <PawPrint className="size-5 text-cabin-cream/60" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-cabin-cream">Pets</p>
                    <p className="mt-0.5 text-sm text-cabin-cream/50">
                      {cabin.houseRules.petsAllowed
                        ? "Pets welcome"
                        : "No pets allowed"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
                    <Cigarette className="size-5 text-cabin-cream/60" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-cabin-cream">Smoking</p>
                    <p className="mt-0.5 text-sm text-cabin-cream/50">
                      {cabin.houseRules.smoking
                        ? "Smoking allowed in designated areas"
                        : "No smoking on the property"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
                    <Volume2 className="size-5 text-cabin-cream/60" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-cabin-cream">Quiet hours</p>
                    <p className="mt-0.5 text-sm text-cabin-cream/50">
                      {cabin.houseRules.quietHours}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-white/[0.06]" />

            {/* Location */}
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-cabin-amber">
                Location
              </p>
              <h3 className="mt-3 text-2xl font-bold tracking-tight text-cabin-cream">
                Where you will be
              </h3>
              <div className="mt-6 flex items-start gap-3">
                <MapPin className="mt-0.5 size-5 shrink-0 text-cabin-amber" />
                <div>
                  <p className="text-sm font-medium text-cabin-cream">
                    {cabin.location.city}, {cabin.location.country}
                  </p>
                  <p className="mt-1 text-sm text-cabin-cream/50">
                    {cabin.location.directions}
                  </p>
                </div>
              </div>
              {/* Map placeholder */}
              <div className="mt-6 aspect-[16/9] overflow-hidden rounded-xl bg-white/[0.04]">
                <div className="flex h-full items-center justify-center text-sm text-cabin-cream/30">
                  <div className="text-center">
                    <MapPin className="mx-auto mb-2 size-8" />
                    <p>Map view</p>
                    <p className="mt-1 text-xs">
                      {cabin.location.coordinates.lat.toFixed(4)},{" "}
                      {cabin.location.coordinates.lng.toFixed(4)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column — Host card (sticky on desktop) */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8">
              {/* Host avatar */}
              <div className="flex items-center gap-4">
                <div className="relative size-16 overflow-hidden rounded-full">
                  <Image
                    src={cabin.host.avatar}
                    alt={`Host ${cabin.host.name}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div>
                  <p className="text-lg font-semibold tracking-tight text-cabin-cream">
                    {cabin.host.name}
                  </p>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-cabin-cream/50">
                    <Star className="size-3 fill-cabin-amber text-cabin-amber" />
                    <span>Superhost</span>
                    <span>&middot;</span>
                    <span>Hosting since {cabin.host.joinedYear}</span>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <p className="mt-6 text-sm leading-relaxed text-cabin-cream/60">
                {cabin.host.bio}
              </p>

              {/* Response info */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3">
                  <MessageCircle className="size-4 text-cabin-cream/40" />
                  <span className="text-sm text-cabin-cream/60">
                    Response time: {cabin.host.responseTime}
                  </span>
                </div>
              </div>

              {/* Contact button */}
              <button className="mt-6 w-full rounded-xl border border-white/10 py-3 text-sm font-medium text-cabin-cream transition-all duration-200 hover:border-white/20 hover:bg-white/[0.04]">
                Message host
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
