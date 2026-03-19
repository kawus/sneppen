// ============================================================
// Sneppen — Shared Types
// ============================================================

// -- Cabin --

export interface CabinLocation {
  address: string;
  city: string;
  country: string;
  coordinates: { lat: number; lng: number };
  directions: string;
}

export interface CabinDetails {
  guests: number;
  bedrooms: number;
  bathrooms: number;
  beds: number;
}

export type AmenityCategory =
  | "essentials"
  | "kitchen"
  | "outdoor"
  | "comfort"
  | "safety";

export interface Amenity {
  name: string;
  icon: string; // lucide-react icon name
  category: AmenityCategory;
}

export interface HouseRules {
  checkIn: string; // "15:00"
  checkOut: string; // "11:00"
  maxGuests: number;
  petsAllowed: boolean;
  smoking: boolean;
  quietHours: string; // "22:00-08:00"
}

export interface Host {
  name: string;
  avatar: string;
  bio: string;
  responseTime: string;
  joinedYear: number;
}

export type ImageCategory = "exterior" | "interior" | "bedroom" | "bathroom" | "outdoor" | "kitchen";

export interface CabinImage {
  src: string;
  alt: string;
  category: ImageCategory;
}

export interface CheckInInfo {
  address: string;
  keyCode: string;
  hostPhone: string;
  wifiName: string;
  wifiPassword: string;
  emergencyContact: string;
}

export interface Cabin {
  name: string;
  tagline: string;
  description: string;
  location: CabinLocation;
  details: CabinDetails;
  amenities: Amenity[];
  houseRules: HouseRules;
  host: Host;
  images: CabinImage[];
}

// -- Pricing --

export interface SeasonalRate {
  startMonth: number; // 1-12
  startDay: number;
  endMonth: number; // 1-12
  endDay: number;
  multiplier: number;
  label: string;
}

export interface PricingConfig {
  basePricePerNight: number;
  weekendSurcharge: number;
  seasonalRates: SeasonalRate[];
  cleaningFee: number;
  serviceFeePercent: number;
  extraGuestFee: number;
  baseOccupancy: number;
  currency: string;
}

export interface NightBreakdown {
  date: Date;
  rate: number;
  isWeekend: boolean;
  seasonLabel?: string;
}

export interface PricingResult {
  nights: number;
  baseTotal: number;
  weekendSurcharge: number;
  seasonalAdjustment: number;
  cleaningFee: number;
  serviceFee: number;
  guestSurcharge: number;
  total: number;
  perNightAverage: number;
  breakdown: NightBreakdown[];
}

// -- Availability --

export interface DateRange {
  start: Date;
  end: Date;
  reason?: string;
}

export interface AvailabilityConfig {
  blockedDates: DateRange[];
  minStay: number;
}

// -- Booking --

export interface BookingRequest {
  checkIn: string; // ISO date
  checkOut: string; // ISO date
  guests: number;
  email: string;
}

export interface BookingDetails {
  checkIn: string;
  checkOut: string;
  guests: number;
  email: string;
  pricing: PricingResult;
  status: "pending" | "confirmed" | "cancelled";
  stripeSessionId?: string;
}

export interface CheckoutResponse {
  sessionId: string;
  url: string;
}

export type ValidationError = {
  field: string;
  message: string;
};
