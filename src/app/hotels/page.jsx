'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import HotelCard from './HotelCard'
import Loader from '@/components/Loader'

function Hotels() {
    const [hotelList, setHotelList] = useState([]);
    const [loading, setLoading] = useState(true);

    const getAllHotels = async () => {
        try {
            const resp = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}api/hotels`);
            setHotelList(resp.data);
        } catch (err) {
            console.error("Error fetching hotels:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllHotels();
    }, []);

    return (
        <div className='flex flex-col flex-wrap gap-10 items-center justify-center p-10'>
            {loading ? <Loader className='mt-12' /> : hotelList.map((hotel) => <HotelCard key={hotel._id} hotel={hotel} />)
            }
        </div>
    );
}

export default Hotels;
