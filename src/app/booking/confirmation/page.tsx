"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Check,
  Calendar,
  Users,
  MapPin,
  Key,
  Phone,
  Wifi,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import type { CheckInInfo } from "@/lib/types";

interface BookingData {
  id: string;
  status: string;
  email: string;
  amountTotal: number;
  currency: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  cabinName: string;
  checkInInfo: CheckInInfo;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function LoadingState() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-cabin-dark">
      <div className="flex flex-col items-center gap-4">
        <div className="size-8 animate-spin rounded-full border-2 border-cabin-cream/20 border-t-cabin-cream" />
        <p className="text-sm text-cabin-cream/40">Loading your booking...</p>
      </div>
    </main>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-cabin-dark px-6">
      <div className="flex max-w-sm flex-col items-center text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-red-500/10">
          <AlertCircle className="size-7 text-red-400" />
        </div>
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-cabin-cream">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-cabin-cream/50">{message}</p>
        <a
          href="/"
          className="mt-8 inline-flex items-center gap-2 text-sm text-cabin-cream/40 transition-colors duration-200 hover:text-cabin-cream/70"
        >
          <ArrowLeft className="size-4" />
          Back to Sneppen
        </a>
      </div>
    </main>
  );
}

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCheck, setShowCheck] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      setError("No booking session found");
      setLoading(false);
      return;
    }

    fetch(`/api/booking?session_id=${encodeURIComponent(sessionId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setBooking(data);
        }
      })
      .catch(() => setError("Failed to load booking details"))
      .finally(() => setLoading(false));
  }, [sessionId]);

  useEffect(() => {
    if (booking) {
      const timer = setTimeout(() => setShowCheck(true), 300);
      return () => clearTimeout(timer);
    }
  }, [booking]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!booking) return null;

  const info = booking.checkInInfo;

  const handleAddToCalendar = () => {
    // Use VALUE=DATE format to avoid timezone issues with all-day events
    const formatICSDate = (dateStr: string) =>
      dateStr.replace(/-/g, "").slice(0, 8);

    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Sneppen//Booking//EN",
      "BEGIN:VEVENT",
      `DTSTART;VALUE=DATE:${formatICSDate(booking.checkIn)}`,
      `DTEND;VALUE=DATE:${formatICSDate(booking.checkOut)}`,
      `SUMMARY:Stay at ${booking.cabinName}`,
      `DESCRIPTION:Address: ${info.address}\\nKey code: ${info.keyCode}\\nHost: ${info.hostPhone}`,
      `LOCATION:${info.address}`,
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
            className={`mt-6 text-3xl font-bold tracking-tight text-cabin-cream transition-all delay-500 duration-700 ease-out md:text-4xl ${
              showCheck ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            Booking confirmed
          </h1>
          <p
            className={`mt-2 text-base text-cabin-cream/50 transition-all delay-600 duration-700 ease-out ${
              showCheck ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            Your stay at {booking.cabinName} is all set.
          </p>
        </div>

        {/* Booking summary */}
        <div
          className={`mt-10 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 transition-all delay-700 duration-700 ease-out md:p-8 ${
            showCheck ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <h2 className="text-xs font-medium uppercase tracking-widest text-cabin-amber">
            Booking Summary
          </h2>

          <div className="mt-6 space-y-5">
            <div className="flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
                <Calendar className="size-5 text-cabin-cream/60" />
              </div>
              <div>
                <p className="text-sm font-medium text-cabin-cream">
                  {booking.checkIn} - {booking.checkOut}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
                <Users className="size-5 text-cabin-cream/60" />
              </div>
              <div>
                <p className="text-sm font-medium text-cabin-cream">
                  {booking.guests} guest{booking.guests !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="h-px bg-white/[0.06]" />

            <div className="flex items-center justify-between">
              <span className="text-sm text-cabin-cream/50">Total paid</span>
              <span className="text-lg font-semibold tracking-tight text-cabin-cream">
                {formatCurrency(booking.amountTotal)}
              </span>
            </div>
          </div>
        </div>

        {/* Check-in details — served from API, only after payment verified */}
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
                  {info.address}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
                <Key className="size-5 text-cabin-cream/60" />
              </div>
              <div>
                <p className="text-sm font-medium text-cabin-cream">Key code</p>
                <p className="mt-0.5 font-mono text-sm text-cabin-amber">
                  {info.keyCode}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
                <Phone className="size-5 text-cabin-cream/60" />
              </div>
              <div>
                <p className="text-sm font-medium text-cabin-cream">Host contact</p>
                <p className="mt-0.5 text-sm text-cabin-cream/50">
                  {info.hostPhone}
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
                    {info.wifiName}
                  </span>
                </p>
                <p className="text-sm text-cabin-cream/50">
                  Password:{" "}
                  <span className="font-mono text-cabin-cream/70">
                    {info.wifiPassword}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Add to calendar */}
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

        {/* Confirmation email note */}
        <p
          className={`mt-6 text-center text-xs text-cabin-cream/30 transition-all delay-[1200ms] duration-700 ease-out ${
            showCheck ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          }`}
        >
          A confirmation email has been sent to {booking.email}
        </p>
      </div>
    </main>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ConfirmationContent />
    </Suspense>
  );
}
