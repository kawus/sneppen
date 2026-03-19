"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { cabin } from "@/lib/cabin";

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
}

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError("No booking session found");
      setLoading(false);
      return;
    }

    fetch(`/api/booking?session_id=${sessionId}`)
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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading your booking...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-2">Something went wrong</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (!booking) return null;

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="space-y-2">
          <div className="text-4xl mb-4">&#10003;</div>
          <h1 className="text-2xl font-semibold">Booking Confirmed</h1>
          <p className="text-muted-foreground">
            Your stay at {booking.cabinName || cabin.name} is confirmed.
          </p>
        </div>

        <div className="border rounded-lg p-6 text-left space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Check-in</span>
            <span className="font-medium">{booking.checkIn}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Check-out</span>
            <span className="font-medium">{booking.checkOut}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Guests</span>
            <span className="font-medium">{booking.guests}</span>
          </div>
          <div className="border-t pt-3 flex justify-between">
            <span className="text-muted-foreground">Total paid</span>
            <span className="font-semibold">
              ${booking.amountTotal.toFixed(2)}
            </span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          A confirmation email has been sent to {booking.email}. Check-in
          instructions will be shared closer to your arrival date.
        </p>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
