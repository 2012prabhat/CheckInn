'use client'
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import api from "@/components/api"
import HotelCard from './HotelCard'
import Loader from '@/components/Loader'
import Heading from '@/components/Heading'

export default function Hotels() {

  const getMyHotels = async () => {
    const resp = await api.get('/admin/hotels/your-hotels');
    return resp.data.data;
  };

  const { data: hotels = [], isLoading, error } = useQuery({
    queryKey: ["hotels"],  // ✅ Query key should be an array
    queryFn: getMyHotels,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return (
    <div>
      <Heading text='Your Hotels' className='mt-8' />
      {isLoading && <Loader/>}
      {error && <p>Error fetching hotels.</p>}
      <ul>
        {hotels.map((hotel) => (
          <HotelCard key={hotel._id} hotel={hotel}/>
        ))}
      </ul>
    </div>
  );
}
