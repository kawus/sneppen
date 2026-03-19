"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { format, differenceInCalendarDays } from "date-fns";
import {
  Check,
  Calendar,
  Users,
  MapPin,
  Key,
  Phone,
  Wifi,
  ArrowLeft,
} from "lucide-react";
import { calculatePricing } from "@/lib/pricing";
import { cabin } from "@/lib/cabin";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const [showCheck, setShowCheck] = useState(false);

  const checkInStr = searchParams.get("checkIn");
  const checkOutStr = searchParams.get("checkOut");
  const guestsStr = searchParams.get("guests");

  const checkIn = checkInStr ? new Date(checkInStr) : null;
  const checkOut = checkOutStr ? new Date(checkOutStr) : null;
  const guests = guestsStr ? parseInt(guestsStr, 10) : 2;

  const pricing =
    checkIn && checkOut
      ? calculatePricing(checkIn, checkOut, guests)
      : null;

  const nights =
    checkIn && checkOut ? differenceInCalendarDays(checkOut, checkIn) : 0;

  useEffect(() => {
    const timer = setTimeout(() => setShowCheck(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Generate .ics calendar file content
  const handleAddToCalendar = () => {
    if (!checkIn || !checkOut) return;

    const formatICSDate = (date: Date) =>
      date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Sneppen//Booking//EN",
      "BEGIN:VEVENT",
      `DTSTART:${formatICSDate(checkIn)}`,
      `DTEND:${formatICSDate(checkOut)}`,
      `SUMMARY:Stay at ${cabin.name}`,
      `DESCRIPTION:Check-in: ${cabin.houseRules.checkIn}\\nCheck-out: ${cabin.houseRules.checkOut}\\nAddress: ${cabin.checkInInfo.address}\\nKey code: ${cabin.checkInInfo.keyCode}`,
      `LOCATION:${cabin.checkInInfo.address}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sneppen-booking.ics";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-cabin-dark px-6 py-16 md:py-24">
      <div className="w-full max-w-lg">
        {/* Back link */}
        <a
          href="/"
          className="mb-12 inline-flex items-center gap-2 text-sm text-cabin-cream/40 transition-colors duration-200 hover:text-cabin-cream/70"
        >
          <ArrowLeft className="size-4" />
          Back to Sneppen
        </a>

        {/* Success animation */}
        <div className="flex flex-col items-center text-center">
          {/* Animated check circle */}
          <div
            className={`flex size-20 items-center justify-center rounded-full bg-cabin-green/20 transition-all duration-700 ease-out ${
              showCheck ? "scale-100 opacity-100" : "scale-50 opacity-0"
            }`}
          >
            <div
              className={`flex size-14 items-center justify-center rounded-full bg-cabin-green/30 transition-all delay-200 duration-500 ease-out ${
                showCheck ? "scale-100 opacity-100" : "scale-75 opacity-0"
              }`}
            >
              <Check
                className={`size-7 text-green-400 transition-all delay-400 duration-500 ease-out ${
                  showCheck ? "scale-100 opacity-100" : "scale-0 opacity-0"
                }`}
                strokeWidth={3}
              />
            </div>
          </div>

          <h1
            className={`mt-6 font-serif text-3xl font-semibold tracking-tight text-cabin-cream transition-all delay-500 duration-700 ease-out md:text-4xl ${
              showCheck
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
          >
            Booking confirmed
          </h1>
          <p
            className={`mt-2 text-base text-cabin-cream/50 transition-all delay-600 duration-700 ease-out ${
              showCheck
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
          >
            Your stay at {cabin.name} is all set.
          </p>
        </div>

        {/* Booking summary card */}
        <div
          className={`mt-10 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 transition-all delay-700 duration-700 ease-out md:p-8 ${
            showCheck ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <h2 className="text-xs font-medium uppercase tracking-widest text-cabin-amber">
            Booking Summary
          </h2>

          <div className="mt-6 space-y-5">
            {/* Dates */}
            <div className="flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
                <Calendar className="size-5 text-cabin-cream/60" />
              </div>
              <div>
                <p className="text-sm font-medium text-cabin-cream">
                  {checkIn && checkOut
                    ? `${format(checkIn, "MMM d")} - ${format(checkOut, "MMM d, yyyy")}`
                    : "Dates not set"}
                </p>
                <p className="mt-0.5 text-xs text-cabin-cream/40">
                  {nights} night{nights !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {/* Guests */}
            <div className="flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
                <Users className="size-5 text-cabin-cream/60" />
              </div>
              <div>
                <p className="text-sm font-medium text-cabin-cream">
                  {guests} guest{guests !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {/* Total */}
            {pricing && (
              <>
                <div className="h-px bg-white/[0.06]" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-cabin-cream/50">
                    Total paid
                  </span>
                  <span className="text-lg font-semibold tracking-tight text-cabin-cream">
                    {formatCurrency(pricing.total)}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Check-in details card */}
        <div
          className={`mt-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 transition-all delay-[900ms] duration-700 ease-out md:p-8 ${
            showCheck ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <h2 className="text-xs font-medium uppercase tracking-widest text-cabin-amber">
            Check-in Details
          </h2>

          <div className="mt-6 space-y-5">
            <div className="flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
                <MapPin className="size-5 text-cabin-cream/60" />
              </div>
              <div>
                <p className="text-sm font-medium text-cabin-cream">Address</p>
                <p className="mt-0.5 text-sm text-cabin-cream/50">
                  {cabin.checkInInfo.address}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
                <Key className="size-5 text-cabin-cream/60" />
              </div>
              <div>
                <p className="text-sm font-medium text-cabin-cream">
                  Key code
                </p>
                <p className="mt-0.5 font-mono text-sm text-cabin-amber">
                  {cabin.checkInInfo.keyCode}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
                <Phone className="size-5 text-cabin-cream/60" />
              </div>
              <div>
                <p className="text-sm font-medium text-cabin-cream">
                  Host contact
                </p>
                <p className="mt-0.5 text-sm text-cabin-cream/50">
                  {cabin.host.name} &middot; {cabin.checkInInfo.hostPhone}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
                <Wifi className="size-5 text-cabin-cream/60" />
              </div>
              <div>
                <p className="text-sm font-medium text-cabin-cream">WiFi</p>
                <p className="mt-0.5 text-sm text-cabin-cream/50">
                  Network:{" "}
                  <span className="font-mono text-cabin-cream/70">
                    {cabin.checkInInfo.wifiName}
                  </span>
                </p>
                <p className="text-sm text-cabin-cream/50">
                  Password:{" "}
                  <span className="font-mono text-cabin-cream/70">
                    {cabin.checkInInfo.wifiPassword}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Add to calendar button */}
        <div
          className={`mt-6 transition-all delay-[1100ms] duration-700 ease-out ${
            showCheck ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <button
            onClick={handleAddToCalendar}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/10 text-sm font-medium text-cabin-cream transition-all duration-200 hover:border-white/20 hover:bg-white/[0.04]"
          >
            <Calendar className="size-4" />
            Add to calendar
          </button>
        </div>
      </div>
    </main>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-cabin-dark">
          <div className="size-8 animate-spin rounded-full border-2 border-cabin-cream/20 border-t-cabin-cream" />
        </main>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
