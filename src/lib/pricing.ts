import {
  eachDayOfInterval,
  isFriday,
  isSaturday,
  getMonth,
  getDate,
} from "date-fns";
import type { PricingConfig, PricingResult, NightBreakdown, SeasonalRate } from "./types";
import { pricingConfig } from "./cabin";

// ============================================================
// Pricing Engine
// ============================================================

/**
 * Check whether a given date falls within a seasonal rate period.
 * Handles year-wrapping ranges (e.g. Dec 20 – Jan 5).
 */
function getSeasonalRate(
  date: Date,
  rates: SeasonalRate[]
): SeasonalRate | undefined {
  const month = getMonth(date) + 1; // date-fns getMonth is 0-indexed
  const day = getDate(date);

  for (const rate of rates) {
    const wrapsYear = rate.endMonth < rate.startMonth ||
      (rate.endMonth === rate.startMonth && rate.endDay < rate.startDay);

    if (wrapsYear) {
      // e.g. Dec 20 – Jan 5: in range if (month/day >= start) OR (month/day <= end)
      const afterStart =
        month > rate.startMonth ||
        (month === rate.startMonth && day >= rate.startDay);
      const beforeEnd =
        month < rate.endMonth ||
        (month === rate.endMonth && day <= rate.endDay);
      if (afterStart || beforeEnd) return rate;
    } else {
      const afterStart =
        month > rate.startMonth ||
        (month === rate.startMonth && day >= rate.startDay);
      const beforeEnd =
        month < rate.endMonth ||
        (month === rate.endMonth && day <= rate.endDay);
      if (afterStart && beforeEnd) return rate;
    }
  }

  return undefined;
}

/**
 * Calculate full pricing breakdown for a stay.
 *
 * @param checkIn  - Check-in date (the first night)
 * @param checkOut - Check-out date (the morning they leave — not charged)
 * @param guests   - Total guest count
 * @param config   - Optional override for pricing config (useful for testing)
 */
export function calculatePricing(
  checkIn: Date,
  checkOut: Date,
  guests: number,
  config: PricingConfig = pricingConfig
): PricingResult {
  // Each day from checkIn to the day *before* checkOut is a night
  const nights = eachDayOfInterval({
    start: checkIn,
    end: new Date(checkOut.getTime() - 24 * 60 * 60 * 1000), // exclude checkout day
  });

  const numNights = nights.length;
  if (numNights <= 0) {
    return emptyResult();
  }

  let baseTotal = 0;
  let weekendSurchargeTotal = 0;
  let seasonalAdjustment = 0;
  const breakdown: NightBreakdown[] = [];

  for (const night of nights) {
    const isWeekend = isFriday(night) || isSaturday(night);
    const seasonal = getSeasonalRate(night, config.seasonalRates);

    let rate = config.basePricePerNight;

    // Seasonal multiplier applied to the base rate
    if (seasonal) {
      const adjustedRate = config.basePricePerNight * seasonal.multiplier;
      seasonalAdjustment += adjustedRate - config.basePricePerNight;
      rate = adjustedRate;
    }

    baseTotal += config.basePricePerNight;

    // Weekend surcharge added on top
    if (isWeekend) {
      weekendSurchargeTotal += config.weekendSurcharge;
      rate += config.weekendSurcharge;
    }

    breakdown.push({
      date: night,
      rate: Math.round(rate * 100) / 100,
      isWeekend,
      seasonLabel: seasonal?.label,
    });
  }

  // Extra guest fee
  const extraGuests = Math.max(0, guests - config.baseOccupancy);
  const guestSurcharge = extraGuests * config.extraGuestFee * numNights;

  // Subtotal before service fee
  const subtotal =
    baseTotal + weekendSurchargeTotal + seasonalAdjustment + config.cleaningFee + guestSurcharge;

  // Service fee
  const serviceFee = Math.round(subtotal * (config.serviceFeePercent / 100) * 100) / 100;

  const total = Math.round((subtotal + serviceFee) * 100) / 100;
  const perNightAverage = Math.round((total / numNights) * 100) / 100;

  return {
    nights: numNights,
    baseTotal,
    weekendSurcharge: weekendSurchargeTotal,
    seasonalAdjustment: Math.round(seasonalAdjustment * 100) / 100,
    cleaningFee: config.cleaningFee,
    serviceFee,
    guestSurcharge,
    total,
    perNightAverage,
    breakdown,
  };
}

function emptyResult(): PricingResult {
  return {
    nights: 0,
    baseTotal: 0,
    weekendSurcharge: 0,
    seasonalAdjustment: 0,
    cleaningFee: 0,
    serviceFee: 0,
    guestSurcharge: 0,
    total: 0,
    perNightAverage: 0,
    breakdown: [],
  };
}
