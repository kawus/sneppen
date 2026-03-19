import {
  isWithinInterval,
  isBefore,
  isEqual,
  startOfDay,
  eachDayOfInterval,
  differenceInCalendarDays,
  addDays,
} from "date-fns";
import type { DateRange, ValidationError } from "./types";
import { availabilityConfig, cabin } from "./cabin";

// ============================================================
// Availability System
// ============================================================

/**
 * Check if a single date is available (not blocked).
 */
export function isDateAvailable(date: Date): boolean {
  const day = startOfDay(date);
  return !availabilityConfig.blockedDates.some((range) =>
    isWithinInterval(day, {
      start: startOfDay(range.start),
      end: startOfDay(range.end),
    })
  );
}

/**
 * Return all blocked date ranges.
 */
export function getBlockedDates(): DateRange[] {
  return availabilityConfig.blockedDates;
}

/**
 * Get the minimum stay requirement (number of nights).
 */
export function getMinStay(): number {
  return availabilityConfig.minStay;
}

/**
 * Get all individual blocked dates as an array (useful for calendar disabling).
 */
export function getBlockedDatesList(): Date[] {
  const dates: Date[] = [];
  for (const range of availabilityConfig.blockedDates) {
    const days = eachDayOfInterval({
      start: startOfDay(range.start),
      end: startOfDay(range.end),
    });
    dates.push(...days);
  }
  return dates;
}

/**
 * Check if any date in a range is blocked.
 */
export function hasBlockedDateInRange(checkIn: Date, checkOut: Date): boolean {
  // Check every night of the stay (checkIn through checkOut - 1)
  const lastNight = addDays(checkOut, -1);
  if (isBefore(lastNight, checkIn)) return false;

  const stayNights = eachDayOfInterval({
    start: startOfDay(checkIn),
    end: startOfDay(lastNight),
  });

  return stayNights.some((night) => !isDateAvailable(night));
}

/**
 * Validate a complete booking request. Returns an array of errors (empty = valid).
 */
export function validateBooking(
  checkIn: Date,
  checkOut: Date,
  guests: number
): ValidationError[] {
  const errors: ValidationError[] = [];
  const today = startOfDay(new Date());
  const checkInDay = startOfDay(checkIn);
  const checkOutDay = startOfDay(checkOut);

  // Check-in not in the past
  if (isBefore(checkInDay, today) && !isEqual(checkInDay, today)) {
    errors.push({
      field: "checkIn",
      message: "Check-in date cannot be in the past",
    });
  }

  // Check-out must be after check-in
  if (!isBefore(checkInDay, checkOutDay)) {
    errors.push({
      field: "checkOut",
      message: "Check-out must be after check-in",
    });
  }

  // Minimum stay
  const nights = differenceInCalendarDays(checkOutDay, checkInDay);
  if (nights > 0 && nights < availabilityConfig.minStay) {
    errors.push({
      field: "checkOut",
      message: `Minimum stay is ${availabilityConfig.minStay} nights`,
    });
  }

  // No blocked dates in range
  if (nights > 0 && hasBlockedDateInRange(checkIn, checkOut)) {
    errors.push({
      field: "checkIn",
      message: "Some dates in your selected range are unavailable",
    });
  }

  // Guest count
  if (guests < 1) {
    errors.push({
      field: "guests",
      message: "At least 1 guest is required",
    });
  }

  if (guests > cabin.houseRules.maxGuests) {
    errors.push({
      field: "guests",
      message: `Maximum ${cabin.houseRules.maxGuests} guests allowed`,
    });
  }

  return errors;
}
