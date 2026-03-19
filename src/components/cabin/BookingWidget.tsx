"use client";

import { useState, useMemo } from "react";
import { format, differenceInCalendarDays, addDays, isBefore, startOfDay } from "date-fns";
import { CalendarDays, Minus, Plus, ChevronDown, Info, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { calculatePricing } from "@/lib/pricing";
import { pricingConfig, cabin } from "@/lib/cabin";
import { getBlockedDatesList, getMinStay, validateBooking } from "@/lib/availability";
import type { DateRange } from "react-day-picker";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: pricingConfig.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function GuestCounter({
  label,
  description,
  value,
  onIncrement,
  onDecrement,
  min,
  max,
}: {
  label: string;
  description: string;
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  min: number;
  max: number;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium text-cabin-cream">{label}</p>
        <p className="text-xs text-cabin-cream/40">{description}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onDecrement}
          disabled={value <= min}
          className="flex size-8 items-center justify-center rounded-full border border-white/10 text-cabin-cream/60 transition-all duration-150 hover:border-white/20 hover:text-cabin-cream disabled:cursor-not-allowed disabled:opacity-30"
          aria-label={`Decrease ${label.toLowerCase()}`}
        >
          <Minus className="size-3.5" />
        </button>
        <span className="w-6 text-center text-sm font-medium text-cabin-cream tabular-nums">
          {value}
        </span>
        <button
          onClick={onIncrement}
          disabled={value >= max}
          className="flex size-8 items-center justify-center rounded-full border border-white/10 text-cabin-cream/60 transition-all duration-150 hover:border-white/20 hover:text-cabin-cream disabled:cursor-not-allowed disabled:opacity-30"
          aria-label={`Increase ${label.toLowerCase()}`}
        >
          <Plus className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

export function BookingWidget() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [guestPickerOpen, setGuestPickerOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const totalGuests = adults + children;
  const blockedDates = useMemo(() => getBlockedDatesList(), []);
  const minStay = getMinStay();
  const today = startOfDay(new Date());

  const checkIn = dateRange?.from;
  const checkOut = dateRange?.to;

  const pricing = useMemo(() => {
    if (!checkIn || !checkOut) return null;
    const nights = differenceInCalendarDays(checkOut, checkIn);
    if (nights < 1) return null;
    return calculatePricing(checkIn, checkOut, totalGuests);
  }, [checkIn, checkOut, totalGuests]);

  const handleReserve = async () => {
    setErrors([]);

    if (!checkIn || !checkOut) {
      setErrors(["Please select check-in and check-out dates"]);
      return;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors(["Please enter a valid email address"]);
      return;
    }

    const validationErrors = validateBooking(checkIn, checkOut, totalGuests);
    if (validationErrors.length > 0) {
      setErrors(validationErrors.map((e) => e.message));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checkIn: checkIn.toISOString(),
          checkOut: checkOut.toISOString(),
          guests: totalGuests,
          email,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrors([data.error || "Something went wrong"]);
        return;
      }

      // Redirect to Stripe Checkout — don't reset loading, we're navigating away
      window.location.href = data.url;
    } catch {
      setErrors(["Failed to connect to payment service"]);
      setLoading(false);
    }
  };

  return (
    <section
      id="booking"
      className="px-6 py-24 md:px-12 lg:px-20"
      aria-label="Book your stay"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr,480px] lg:gap-16">
          {/* Left — heading + info */}
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-cabin-amber">
              Book
            </p>
            <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-cabin-cream md:text-4xl">
              Reserve your dates
            </h2>
            <p className="mt-4 max-w-lg text-base text-cabin-cream/50">
              Minimum {minStay}-night stay. Pricing adjusts for weekends and
              seasonal periods. Final total includes all fees.
            </p>

            {/* Per-night rate teaser */}
            <div className="mt-8 inline-flex items-baseline gap-1.5">
              <span className="font-serif text-4xl font-semibold tracking-tight text-cabin-cream">
                {formatCurrency(pricingConfig.basePricePerNight)}
              </span>
              <span className="text-base text-cabin-cream/40">/ night</span>
            </div>

            {/* Seasonal note */}
            <div className="mt-4 flex items-start gap-2 rounded-xl bg-white/[0.03] p-4">
              <Info className="mt-0.5 size-4 shrink-0 text-cabin-amber/60" />
              <p className="text-xs leading-relaxed text-cabin-cream/40">
                Rates vary by season. Peak summer (Jun-Aug) and holiday season
                (Dec-Jan) have higher rates. Spring and autumn offer the best
                value.
              </p>
            </div>
          </div>

          {/* Right — booking card */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 backdrop-blur-sm lg:p-8">
            {/* Date selection */}
            <div className="space-y-4">
              <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                <PopoverTrigger
                  className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3.5 text-left transition-colors duration-150 hover:border-white/[0.12]"
                  aria-label="Select dates"
                >
                  <CalendarDays className="size-4 shrink-0 text-cabin-cream/40" />
                  <div className="flex flex-1 items-center gap-2">
                    <div className="flex-1">
                      <p className="text-[10px] font-medium uppercase tracking-wider text-cabin-cream/40">
                        Check-in
                      </p>
                      <p className="mt-0.5 text-sm text-cabin-cream">
                        {checkIn
                          ? format(checkIn, "MMM d, yyyy")
                          : "Add date"}
                      </p>
                    </div>
                    <div className="h-8 w-px bg-white/[0.06]" />
                    <div className="flex-1">
                      <p className="text-[10px] font-medium uppercase tracking-wider text-cabin-cream/40">
                        Check-out
                      </p>
                      <p className="mt-0.5 text-sm text-cabin-cream">
                        {checkOut
                          ? format(checkOut, "MMM d, yyyy")
                          : "Add date"}
                      </p>
                    </div>
                  </div>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto border-white/[0.06] bg-cabin-charcoal p-0"
                  align="start"
                  sideOffset={8}
                >
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={(range) => {
                      setDateRange(range);
                      // Auto-close when both dates selected
                      if (range?.from && range?.to) {
                        setTimeout(() => setDatePickerOpen(false), 300);
                      }
                    }}
                    numberOfMonths={2}
                    disabled={[
                      { before: today },
                      ...blockedDates.map((d) => d),
                    ]}
                    className="bg-transparent text-cabin-cream"
                  />
                </PopoverContent>
              </Popover>

              {/* Guest selector */}
              <Popover open={guestPickerOpen} onOpenChange={setGuestPickerOpen}>
                <PopoverTrigger
                  className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3.5 text-left transition-colors duration-150 hover:border-white/[0.12]"
                  aria-label="Select guests"
                >
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-cabin-cream/40">
                      Guests
                    </p>
                    <p className="mt-0.5 text-sm text-cabin-cream">
                      {totalGuests} guest{totalGuests !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <ChevronDown className="size-4 text-cabin-cream/40" />
                </PopoverTrigger>
                <PopoverContent
                  className="w-72 border-white/[0.06] bg-cabin-charcoal"
                  align="start"
                  sideOffset={8}
                >
                  <GuestCounter
                    label="Adults"
                    description="Ages 13+"
                    value={adults}
                    onIncrement={() =>
                      setAdults((a) =>
                        a + children < cabin.houseRules.maxGuests ? a + 1 : a
                      )
                    }
                    onDecrement={() => setAdults((a) => Math.max(1, a - 1))}
                    min={1}
                    max={cabin.houseRules.maxGuests - children}
                  />
                  <div className="h-px bg-white/[0.06]" />
                  <GuestCounter
                    label="Children"
                    description="Ages 2-12"
                    value={children}
                    onIncrement={() =>
                      setChildren((c) =>
                        adults + c < cabin.houseRules.maxGuests ? c + 1 : c
                      )
                    }
                    onDecrement={() => setChildren((c) => Math.max(0, c - 1))}
                    min={0}
                    max={cabin.houseRules.maxGuests - adults}
                  />
                  <p className="mt-2 text-xs text-cabin-cream/30">
                    Maximum {cabin.houseRules.maxGuests} guests total
                  </p>
                </PopoverContent>
              </Popover>
            </div>

            {/* Pricing breakdown */}
            {pricing && pricing.nights > 0 && (
              <div className="mt-6 space-y-3 border-t border-white/[0.06] pt-6" aria-live="polite">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-cabin-cream/50">
                    {formatCurrency(pricingConfig.basePricePerNight)} x{" "}
                    {pricing.nights} night{pricing.nights !== 1 ? "s" : ""}
                  </span>
                  <span className="text-cabin-cream">
                    {formatCurrency(pricing.baseTotal)}
                  </span>
                </div>

                {pricing.weekendSurcharge > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-cabin-cream/50">
                      Weekend surcharge
                    </span>
                    <span className="text-cabin-cream">
                      {formatCurrency(pricing.weekendSurcharge)}
                    </span>
                  </div>
                )}

                {pricing.seasonalAdjustment !== 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-cabin-cream/50">
                      Seasonal adjustment
                    </span>
                    <span
                      className={
                        pricing.seasonalAdjustment < 0
                          ? "text-green-400"
                          : "text-cabin-cream"
                      }
                    >
                      {pricing.seasonalAdjustment < 0 ? "-" : ""}
                      {formatCurrency(Math.abs(pricing.seasonalAdjustment))}
                    </span>
                  </div>
                )}

                {pricing.guestSurcharge > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-cabin-cream/50">
                      Extra guest fee
                    </span>
                    <span className="text-cabin-cream">
                      {formatCurrency(pricing.guestSurcharge)}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <span className="text-cabin-cream/50">Cleaning fee</span>
                  <span className="text-cabin-cream">
                    {formatCurrency(pricing.cleaningFee)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-cabin-cream/50">Service fee</span>
                  <span className="text-cabin-cream">
                    {formatCurrency(pricing.serviceFee)}
                  </span>
                </div>

                <div className="h-px bg-white/[0.06]" />

                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold tracking-tight text-cabin-cream">
                    Total
                  </span>
                  <span className="text-base font-semibold tracking-tight text-cabin-cream">
                    {formatCurrency(pricing.total)}
                  </span>
                </div>

                <p className="text-right text-xs text-cabin-cream/30">
                  {formatCurrency(pricing.perNightAverage)} avg / night
                </p>
              </div>
            )}

            {/* Email input */}
            <div className="mt-4">
              <input
                type="email"
                placeholder="Your email for confirmation"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3.5 text-sm text-cabin-cream placeholder:text-cabin-cream/30 transition-colors duration-150 hover:border-white/[0.12] focus:border-cabin-amber/40 focus:outline-none focus:ring-0"
                aria-label="Email address"
              />
            </div>

            {/* Errors */}
            {errors.length > 0 && (
              <div className="mt-4 rounded-xl bg-red-500/10 p-3">
                {errors.map((error, i) => (
                  <p key={i} className="text-xs text-red-400">
                    {error}
                  </p>
                ))}
              </div>
            )}

            {/* Reserve button */}
            <button
              onClick={handleReserve}
              disabled={loading}
              className="mt-6 flex h-14 w-full items-center justify-center rounded-xl bg-cabin-cream text-base font-semibold tracking-tight text-cabin-dark transition-all duration-200 hover:bg-white hover:shadow-[0_0_40px_rgba(255,255,255,0.08)] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                "Reserve"
              )}
            </button>

            <p className="mt-3 text-center text-xs text-cabin-cream/30">
              You won&apos;t be charged yet
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
