import { NextResponse } from "next/server";
import Stripe from "stripe";
import { calculatePricing } from "@/lib/pricing";
import { validateBooking } from "@/lib/availability";
import { cabin } from "@/lib/cabin";
import { parseISO } from "date-fns";

// ============================================================
// POST /api/checkout — Create Stripe Checkout Session
// ============================================================

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { checkIn, checkOut, guests, email } = body;

    // Validate required fields
    if (!checkIn || !checkOut || !guests || !email) {
      return NextResponse.json(
        { error: "Missing required fields: checkIn, checkOut, guests, email" },
        { status: 400 }
      );
    }

    const checkInDate = parseISO(checkIn);
    const checkOutDate = parseISO(checkOut);
    const guestCount = Number(guests);

    // Validate booking
    const errors = validateBooking(checkInDate, checkOutDate, guestCount);
    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    // Calculate pricing server-side (never trust client)
    const pricing = calculatePricing(checkInDate, checkOutDate, guestCount);

    if (pricing.nights === 0) {
      return NextResponse.json(
        { error: "Invalid date range" },
        { status: 400 }
      );
    }

    // Initialize Stripe
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      console.error("STRIPE_SECRET_KEY is not set");
      return NextResponse.json(
        { error: "Payment service is not configured" },
        { status: 500 }
      );
    }

    const stripe = new Stripe(stripeSecretKey);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // Build line items
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${cabin.name} — ${pricing.nights} night${pricing.nights > 1 ? "s" : ""}`,
            description: `${checkIn} to ${checkOut} · ${guestCount} guest${guestCount > 1 ? "s" : ""}`,
          },
          unit_amount: Math.round(pricing.baseTotal * 100), // cents
        },
        quantity: 1,
      },
    ];

    // Weekend surcharge
    if (pricing.weekendSurcharge > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: { name: "Weekend surcharge" },
          unit_amount: Math.round(pricing.weekendSurcharge * 100),
        },
        quantity: 1,
      });
    }

    // Seasonal adjustment
    if (pricing.seasonalAdjustment !== 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name:
              pricing.seasonalAdjustment > 0
                ? "Seasonal rate adjustment"
                : "Off-season discount",
          },
          unit_amount: Math.round(Math.abs(pricing.seasonalAdjustment) * 100),
        },
        quantity: 1,
      });
    }

    // Guest surcharge
    if (pricing.guestSurcharge > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: `Extra guest fee (${guestCount - 4} extra × ${pricing.nights} nights)`,
          },
          unit_amount: Math.round(pricing.guestSurcharge * 100),
        },
        quantity: 1,
      });
    }

    // Cleaning fee
    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: { name: "Cleaning fee" },
        unit_amount: Math.round(pricing.cleaningFee * 100),
      },
      quantity: 1,
    });

    // Service fee
    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: { name: "Service fee" },
        unit_amount: Math.round(pricing.serviceFee * 100),
      },
      quantity: 1,
    });

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      customer_email: email,
      success_url: `${baseUrl}/booking/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: baseUrl,
      metadata: {
        checkIn,
        checkOut,
        guests: String(guestCount),
        cabinName: cabin.name,
        totalPrice: String(pricing.total),
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
