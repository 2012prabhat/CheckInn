// components/BookHotelForm.js
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import useAuthStore from "@/components/useAuthStore";
import api from "@/components/api";

const BookHotelForm = ({ hotelId, totalPrice }) => {
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    if (!checkInDate || !checkOutDate || !guests || !name || !address) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Check if user is logged in
      if (!user) {
        setError("Please log in to book a hotel.");
        return;
      }

      // Prepare booking data
      const finalData = {
        hotelId,
        checkInDate,
        checkOutDate,
        guests,
        totalPrice,
        name, // Customer name
        address, // Customer address
        origin: window.location.origin, // Pass the origin for Stripe URLs
      };

      // Call the API to create a booking
      const response = await api.post("/bookings/create", finalData);
      console.log("API Response:", response);

      if (!response.data.sessionId) {
        throw new Error("Failed to create booking.");
      }

      // Redirect to Stripe Checkout
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
      await stripe.redirectToCheckout({ sessionId: response.data.sessionId });
    } catch (err) {
      setError(err.response?.data?.error || err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 px-12 space-y-4 flex-col flex justify-center">
      {/* Customer Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          required
        />
      </div>

      {/* Customer Address */}
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Address
        </label>
        <input
          type="text"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          required
        />
      </div>

      {/* Check-In Date */}
      <div>
        <label htmlFor="checkInDate" className="block text-sm font-medium text-gray-700">
          Check-In Date
        </label>
        <input
          type="date"
          id="checkInDate"
          value={checkInDate}
          onChange={(e) => setCheckInDate(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          required
        />
      </div>

      {/* Check-Out Date */}
      <div>
        <label htmlFor="checkOutDate" className="block text-sm font-medium text-gray-700">
          Check-Out Date
        </label>
        <input
          type="date"
          id="checkOutDate"
          value={checkOutDate}
          onChange={(e) => setCheckOutDate(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          required
        />
      </div>

      {/* Number of Guests */}
      <div>
        <label htmlFor="guests" className="block text-sm font-medium text-gray-700">
          Number of Guests
        </label>
        <input
          type="number"
          id="guests"
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          min="1"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          required
        />
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="priBtn"
      >
        {loading ? "Processing..." : "Book Now"}
      </button>
    </form>
  );
};

export default BookHotelForm;