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
  
    // Convert dates to Date objects for comparison
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
  
    // Prevent past date selection
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Remove time part
  
    if (checkIn < today) {
      setError("Check-In date cannot be in the past.");
      return;
    }
  
    if (checkOut < today) {
      setError("Check-Out date cannot be in the past.");
      return;
    }
  
    // Allow same-day booking but not checkout before check-in
    if (checkOut < checkIn) {
      setError("Check-Out date cannot be before Check-In date.");
      return;
    }
  
    setLoading(true);
    setError("");
  
    try {
      if (!user) {
        setError("Please log in to book a hotel.");
        return;
      }
  
      const finalData = {
        hotelId,
        checkInDate,
        checkOutDate,
        guests,
        totalPrice,
        name,
        address,
        origin: window.location.origin,
      };
  
      const response = await api.post("/bookings/create", finalData);
      console.log("API Response:", response);
  
      if (!response.data.sessionId) {
        throw new Error("Failed to create booking.");
      }
  
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
      await stripe.redirectToCheckout({ sessionId: response.data.sessionId });
    } catch (err) {
      setError(err.response?.data?.error || err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="p-6 px-8 space-y-4 flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <div>
          <label htmlFor="name" className="text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Address */}
        <div>
          <label
            htmlFor="address"
            className="text-sm font-medium text-gray-700"
          >
            Address
          </label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div onClick={() => document.getElementById("checkInDate").showPicker()} className="cursor-pointer">
  <label htmlFor="checkInDate" className="text-sm font-medium text-gray-700">Check-In</label>
  <input
    type="date"
    id="checkInDate"
    value={checkInDate}
    min={new Date().toISOString().split("T")[0]} // 🔥 Prevent past date selection
    onChange={(e) => setCheckInDate(e.target.value)}
    className="mt-1 w-full p-2 border border-gray-300 rounded-md"
    required
  />
</div>

{/* Check-Out Date */}
<div onClick={() => document.getElementById("checkOutDate").showPicker()} className="cursor-pointer">
  <label htmlFor="checkOutDate" className="text-sm font-medium text-gray-700">Check-Out</label>
  <input
    type="date"
    id="checkOutDate"
    value={checkOutDate}
    min={checkInDate || new Date().toISOString().split("T")[0]} // 🔥 Prevent selecting past dates
    onChange={(e) => setCheckOutDate(e.target.value)}
    className="mt-1 w-full p-2 border border-gray-300 rounded-md"
    required
  />
</div>

        {/* Guests */}
        <div className="md:col-span-2">
          <label htmlFor="guests" className="text-sm font-medium text-gray-700">
            Guests
          </label>
          <input
            type="number"
            id="guests"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            min="1"
            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      {/* Submit Button */}
      <button type="submit" disabled={loading} className="priBtn">
        {loading ? "Processing..." : "Book Now"}
      </button>
    </form>
  );
};

export default BookHotelForm;
