"use client";

import { useEffect, useState } from "react";
import api from "@/components/api";
import Image from "next/image";
import Pagination from "@/components/Pagination";
import Heading from "@/components/Heading";
import { useRouter } from "next/navigation";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 3; // 3 items per page
  const router = useRouter();

  const fetchBookings = async (page) => {
    if(bookings.length==0) setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/bookings/my-bookings?page=${page}&limit=${limit}`);
      setBookings(response.data.bookings);
      // assuming the API returns pagination info in this format:
      setTotalPages(response.data.pagination.totalPages);
    } catch (err) {
      setError("Failed to fetch bookings. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(currentPage);
  }, [currentPage]);

  if (loading) return <div className="text-center text-white">Loading bookings...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!bookings.length) return <div className="text-center text-gray-500">No bookings found.</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center">
      {/* <h2 className="text-2xl font-bold text-black text-center mb-6">My Bookings</h2> */}
      <Heading text="My Bookings" className='ml-2 mt-2'/>
      
      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={(page) => setCurrentPage(page)} 
      />
      </div>
     
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map((booking) => (
          <div key={booking._id} className="bg-[#2f3542] backdrop-blur-md p-4 rounded-lg shadow-lg">
            <Image
              src={booking.hotel.images[0]}
              alt={booking.hotel.name}
              width={300}
              height={200}
              className="w-full h-48 object-cover rounded-md"
            />
            <h3 className="text-lg font-semibold text-white mt-2">{booking.hotel.name}</h3>
            <p className="text-white">Check-in: {new Date(booking.checkInDate).toDateString()}</p>
            <p className="text-white">Check-out: {new Date(booking.checkOutDate).toDateString()}</p>
            <p className="text-white">Guests: {booking.guests}</p>
            <p className={`text-sm font-bold ${booking.paymentStatus === 'paid' ? 'text-green-400' : 'text-red-400'}`}>
              Payment: {booking.paymentStatus}
            </p>
            <div className="flex justify-between">
            <p className="text-white font-semibold mt-2">Total Price: ₹{booking.totalPrice}</p>
            {booking.paymentStatus==='paid' &&       <p className="secBtn cursor-pointer text-white font-semibold" onClick={()=>router.push(`/review/${booking.hotel.slug}`)} >Write review</p>}
      
            </div>
           
          </div>
        ))}
      </div>

      {/* Use Pagination component */}  
     
    </div>
  );
};

export default MyBookings;
