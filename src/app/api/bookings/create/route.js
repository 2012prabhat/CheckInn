// src/app/api/bookings/create/route.js
import connectDB from "@/lib/db";
import Booking from "@/models/Booking";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST method to handle booking creation
export async function POST(req) {
  await connectDB();

  try {
    const body = await req.json();
    const { hotelId, checkInDate, checkOutDate, guests, totalPrice, name, address, origin } = body;

    // Get user from the header
    const userHeader = req.headers.get("x-user");
    console.log("User from header:", userHeader); // 🔍 Debugging

        if (!userHeader) {
            return Response.json({ message: "User not found in headers" }, { status: 400 });
        }
        
    const user = userHeader ? JSON.parse(userHeader) : null;
     console.log("this is user ",user)
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized! Please log in." }), {
        status: 401,
      });
    }

    // Create a new booking
    const newBooking = new Booking({
      user: user.userId,
      hotel: hotelId,
      checkInDate,
      checkOutDate,
      guests,
      totalPrice,
      paymentStatus: "pending",
    });

    await newBooking.save();

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `Booking for Hotel ID: ${hotelId}`,
            },
            unit_amount: totalPrice * 100, // Convert to paise
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/bookings/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/bookings/cancel`,
      customer_email: user.email, // Use the user's email
      metadata: {
        bookingId: newBooking._id.toString(),
      },
      billing_address_collection: "required", // Collect billing address
      shipping_address_collection: {
        allowed_countries: ["IN"], // Allow only Indian addresses
      },
    });

    // Update booking with Stripe session ID
    newBooking.stripeSessionId = session.id;
    await newBooking.save();

    // Return Stripe session ID to the frontend
    return new Response(JSON.stringify({ sessionId: session.id }), {
      status: 200,
    });
  } catch (err) {
    console.error("Error creating booking:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}