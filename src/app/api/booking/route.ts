import { NextResponse } from "next/server";
import Stripe from "stripe";
import { checkInInfo } from "@/lib/cabin";

// ============================================================
// GET /api/booking?session_id=... — Retrieve booking details
// Only returns data for PAID sessions.
// ============================================================

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing session_id parameter" },
        { status: 400 }
      );
    }

    // Validate session ID format
    if (!sessionId.startsWith("cs_")) {
      return NextResponse.json(
        { error: "Invalid session" },
        { status: 400 }
      );
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: "Payment service is not configured" },
        { status: 500 }
      );
    }

    const stripe = new Stripe(stripeSecretKey);

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // Only return details for paid sessions
    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 402 }
      );
    }

    return NextResponse.json({
      id: session.id,
      status: session.payment_status,
      email: session.customer_email,
      amountTotal: session.amount_total ? session.amount_total / 100 : 0,
      currency: session.currency,
      checkIn: session.metadata?.checkIn,
      checkOut: session.metadata?.checkOut,
      guests: session.metadata?.guests ? Number(session.metadata.guests) : null,
      cabinName: session.metadata?.cabinName,
      // Check-in secrets only served after payment verification
      checkInInfo,
    });
  } catch (error) {
    console.error("Booking retrieval error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve booking details" },
      { status: 500 }
    );
  }
}
