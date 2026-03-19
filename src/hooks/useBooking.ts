"use client";

import { useState, useMemo, useCallback } from "react";
import { parseISO, formatISO } from "date-fns";
import { calculatePricing } from "@/lib/pricing";
import { validateBooking } from "@/lib/availability";
import type { PricingResult, ValidationError } from "@/lib/types";

// ============================================================
// useBooking — Client-side booking state and actions
// ============================================================

interface UseBookingReturn {
  // State
  checkIn: Date | undefined;
  checkOut: Date | undefined;
  guests: number;

  // Derived
  pricing: PricingResult | null;
  errors: ValidationError[];
  isValid: boolean;

  // Actions
  setCheckIn: (date: Date | undefined) => void;
  setCheckOut: (date: Date | undefined) => void;
  setDates: (checkIn: Date | undefined, checkOut: Date | undefined) => void;
  setGuests: (count: number) => void;

  // Checkout
  isCheckingOut: boolean;
  checkoutError: string | null;
  initiateCheckout: (email: string) => Promise<void>;
}

export function useBooking(): UseBookingReturn {
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined);
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined);
  const [guests, setGuests] = useState(2);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Validate whenever inputs change
  const errors = useMemo(() => {
    if (!checkIn || !checkOut) return [];
    return validateBooking(checkIn, checkOut, guests);
  }, [checkIn, checkOut, guests]);

  const isValid = useMemo(() => {
    return !!checkIn && !!checkOut && errors.length === 0;
  }, [checkIn, checkOut, errors]);

  // Calculate pricing whenever inputs change
  const pricing = useMemo(() => {
    if (!checkIn || !checkOut || errors.length > 0) return null;
    return calculatePricing(checkIn, checkOut, guests);
  }, [checkIn, checkOut, guests, errors]);

  const setDates = useCallback(
    (newCheckIn: Date | undefined, newCheckOut: Date | undefined) => {
      setCheckIn(newCheckIn);
      setCheckOut(newCheckOut);
    },
    []
  );

  const initiateCheckout = useCallback(
    async (email: string) => {
      if (!checkIn || !checkOut || !isValid) return;

      setIsCheckingOut(true);
      setCheckoutError(null);

      try {
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            checkIn: formatISO(checkIn, { representation: "date" }),
            checkOut: formatISO(checkOut, { representation: "date" }),
            guests,
            email,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Checkout failed");
        }

        // Redirect to Stripe
        if (data.url) {
          window.location.href = data.url;
        }
      } catch (err) {
        setCheckoutError(
          err instanceof Error ? err.message : "Something went wrong"
        );
      } finally {
        setIsCheckingOut(false);
      }
    },
    [checkIn, checkOut, guests, isValid]
  );

  return {
    checkIn,
    checkOut,
    guests,
    pricing,
    errors,
    isValid,
    setCheckIn,
    setCheckOut,
    setDates,
    setGuests,
    isCheckingOut,
    checkoutError,
    initiateCheckout,
  };
}
