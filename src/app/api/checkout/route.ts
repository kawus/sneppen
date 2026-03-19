import { NextResponse } from "next/server";
import Stripe from "stripe";
import { calculatePricing } from "@/lib/pricing";
import { validateBooking } from "@/lib/availability";
import { cabin } from "@/lib/cabin";
import { parseISO, format } from "date-fns";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

    // Validate email format
    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
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

    const checkInFormatted = format(checkInDate, "MMM d, yyyy");
    const checkOutFormatted = format(checkOutDate, "MMM d, yyyy");

    // Single line item with the server-calculated total.
    // Avoids Stripe line-item issues with negative adjustments (discounts).
    // The client shows the full breakdown; Stripe just needs the correct total.
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${cabin.name} — ${pricing.nights} night${pricing.nights > 1 ? "s" : ""}`,
            description: `${checkInFormatted} to ${checkOutFormatted} · ${guestCount} guest${guestCount > 1 ? "s" : ""} · Includes cleaning fee, service fee, and all adjustments`,
          },
          unit_amount: Math.round(pricing.total * 100), // cents
        },
        quantity: 1,
      },
    ];

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
