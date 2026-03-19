import type { Cabin, PricingConfig, AvailabilityConfig } from "./types";

// ============================================================
// Sneppen — Single Property Configuration
// ============================================================

export const cabin: Cabin = {
  name: "Sneppen",
  tagline: "A cabin in the forest",
  description:
    "Tucked between towering pines and a quiet lake, Sneppen is a modern Scandinavian cabin built for slow mornings and long evenings. Three bedrooms, a wood-fired sauna, and floor-to-ceiling windows that frame the forest like a painting. Whether you come to disconnect or simply breathe, this is the place.",
  location: {
    address: "Skogveien 42, 3580 Geilo",
    city: "Geilo",
    country: "Norway",
    coordinates: { lat: 60.5345, lng: 8.2053 },
    directions:
      "From Oslo, take the E134 west toward Geilo (approx. 3.5 hours). Turn right on Skogveien after the Coop grocery store. The cabin is 2 km down the gravel road on your left — look for the wooden Sneppen sign.",
  },
  details: {
    guests: 8,
    bedrooms: 3,
    bathrooms: 2,
    beds: 4,
  },
  amenities: [
    { name: "WiFi", icon: "wifi", category: "essentials" },
    { name: "Fireplace", icon: "flame", category: "comfort" },
    { name: "Hot Tub", icon: "bath", category: "outdoor" },
    { name: "Full Kitchen", icon: "chef-hat", category: "kitchen" },
    { name: "Free Parking", icon: "car", category: "essentials" },
    { name: "Washer & Dryer", icon: "washing-machine", category: "essentials" },
    { name: "Sauna", icon: "thermometer", category: "outdoor" },
    { name: "Lake Access", icon: "waves", category: "outdoor" },
    { name: "Heating", icon: "thermometer-sun", category: "comfort" },
    { name: "TV & Streaming", icon: "tv", category: "comfort" },
    { name: "Coffee Maker", icon: "coffee", category: "kitchen" },
    { name: "Dishwasher", icon: "utensils", category: "kitchen" },
    { name: "First Aid Kit", icon: "cross", category: "safety" },
    { name: "Fire Extinguisher", icon: "shield", category: "safety" },
    { name: "Smoke Detector", icon: "siren", category: "safety" },
    { name: "Board Games", icon: "puzzle", category: "comfort" },
  ],
  houseRules: {
    checkIn: "15:00",
    checkOut: "11:00",
    maxGuests: 8,
    petsAllowed: false,
    smoking: false,
    quietHours: "22:00-08:00",
  },
  host: {
    name: "Erik",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    bio: "I grew up spending summers in this forest. When I finally built Sneppen, I wanted a place where anyone could feel the same calm I did as a kid. I live 20 minutes away and I'm always happy to share my favorite trails and fishing spots.",
    responseTime: "Within an hour",
    joinedYear: 2021,
  },
  images: [
    {
      src: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=1200&h=800&fit=crop",
      alt: "Sneppen cabin exterior in the forest",
      category: "exterior",
    },
    {
      src: "https://images.unsplash.com/photo-1518732714860-b62714ce0c59?w=1200&h=800&fit=crop",
      alt: "Cozy living room with fireplace",
      category: "interior",
    },
    {
      src: "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=1200&h=800&fit=crop",
      alt: "Modern kitchen with wood accents",
      category: "kitchen",
    },
    {
      src: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&h=800&fit=crop",
      alt: "Primary bedroom with forest view",
      category: "bedroom",
    },
    {
      src: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&h=800&fit=crop",
      alt: "Second bedroom with twin beds",
      category: "bedroom",
    },
    {
      src: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&h=800&fit=crop",
      alt: "Bathroom with rain shower",
      category: "bathroom",
    },
    {
      src: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200&h=800&fit=crop",
      alt: "Deck with hot tub and forest views",
      category: "outdoor",
    },
    {
      src: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=1200&h=800&fit=crop",
      alt: "Cabin at dusk with warm interior light",
      category: "exterior",
    },
    {
      src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&h=800&fit=crop",
      alt: "Surrounding mountain and forest landscape",
      category: "outdoor",
    },
    {
      src: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=1200&h=800&fit=crop",
      alt: "Lake view from the cabin trail",
      category: "outdoor",
    },
  ],
  checkInInfo: {
    address: "Skogveien 42, 3580 Geilo, Norway",
    keyCode: "4829#",
    hostPhone: "+47 912 34 567",
    wifiName: "Sneppen-Guest",
    wifiPassword: "forestcabin2024",
    emergencyContact: "+47 113 (Norway emergency)",
  },
};

// ============================================================
// Pricing Configuration
// ============================================================

export const pricingConfig: PricingConfig = {
  basePricePerNight: 250,
  weekendSurcharge: 50,
  seasonalRates: [
    {
      startMonth: 6,
      startDay: 15,
      endMonth: 8,
      endDay: 15,
      multiplier: 1.3,
      label: "Peak Summer",
    },
    {
      startMonth: 12,
      startDay: 20,
      endMonth: 1,
      endDay: 5,
      multiplier: 1.5,
      label: "Holiday Season",
    },
    {
      startMonth: 2,
      startDay: 1,
      endMonth: 3,
      endDay: 31,
      multiplier: 1.2,
      label: "Ski Season",
    },
    {
      startMonth: 10,
      startDay: 15,
      endMonth: 11,
      endDay: 30,
      multiplier: 0.85,
      label: "Off-Peak Autumn",
    },
    {
      startMonth: 4,
      startDay: 1,
      endMonth: 5,
      endDay: 31,
      multiplier: 0.85,
      label: "Off-Peak Spring",
    },
  ],
  cleaningFee: 150,
  serviceFeePercent: 12,
  extraGuestFee: 25,
  baseOccupancy: 4,
  currency: "USD",
};

// ============================================================
// Availability Configuration
// ============================================================

export const availabilityConfig: AvailabilityConfig = {
  blockedDates: [
    {
      start: new Date("2026-04-10"),
      end: new Date("2026-04-15"),
      reason: "Maintenance",
    },
    {
      start: new Date("2026-07-01"),
      end: new Date("2026-07-07"),
      reason: "Owner reservation",
    },
    {
      start: new Date("2026-12-24"),
      end: new Date("2026-12-26"),
      reason: "Holiday closure",
    },
  ],
  minStay: 2,
};
