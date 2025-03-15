// app/api/webhook/route.js
import { NextResponse } from "next/server";
import Stripe from "stripe";
import connectDB from "@/lib/db";
import Booking from "@/models/Booking";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  await connectDB();

  const payload = await request.text();
  const sig = request.headers.get("stripe-signature");

  let event;

  try {
    // Verify the webhook signature
    event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;

      // Update the booking status to "paid"
      await Booking.findOneAndUpdate(
        { stripeSessionId: session.id },
        { paymentStatus: "paid" }
      );
      break;

    case "checkout.session.expired":
      const expiredSession = event.data.object;

      // Update the booking status to "failed"
      await Booking.findOneAndUpdate(
        { stripeSessionId: expiredSession.id },
        { paymentStatus: "failed" }
      );
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}