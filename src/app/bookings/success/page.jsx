// app/bookings/success/page.js
"use client"; // Mark the component as a Client Component
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/components/api";
import Loader from "@/components/Loader";

export const dynamic = "force-dynamic"; // Disable prerendering

// Main SuccessPage component
const SuccessPageContent = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id"); // Get the session ID from query params
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!sessionId) return;

    const fetchBookingDetails = async () => {
      try {
        // Fetch the booking details
        const bookingResponse = await api.get(`/bookings/details?sessionId=${sessionId}`);
        if (bookingResponse.data) {
          setBooking(bookingResponse.data);
        } else {
          setError("Booking details not found.");
        }
      } catch (err) {
        setError(err.response?.data?.error || err.message || "Failed to fetch booking details.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [sessionId]);

  if (loading) {
    return <Loader />
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Booking Successful!</h1>
      <p className="text-gray-700 mb-4">Thank you for booking with us. Here are your booking details:</p>

      {booking && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Hotel:</span> {booking.hotel.name}
            </p>
            <p>
              <span className="font-medium">Check-In Date:</span> {new Date(booking.checkInDate).toLocaleDateString()}
            </p>
            <p>
              <span className="font-medium">Check-Out Date:</span> {new Date(booking.checkOutDate).toLocaleDateString()}
            </p>
            <p>
              <span className="font-medium">Guests:</span> {booking.guests}
            </p>
            <p>
              <span className="font-medium">Total Price:</span> ₹{booking.totalPrice}
            </p>
            <p>
              <span className="font-medium">Status:</span> {booking.paymentStatus}
            </p>
          </div>
        </div>
      )}

      <div className="mt-6">
        <button
          onClick={() => router.push("/")}
          className="secBtn"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

// Wrap the SuccessPageContent in a Suspense boundary
const SuccessPage = () => {
  return (
    <Suspense fallback={<Loader />}>
      <SuccessPageContent />
    </Suspense>
  );
};

export default SuccessPage;