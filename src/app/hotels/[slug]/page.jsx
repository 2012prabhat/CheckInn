'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import api from '@/components/api';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Keyboard, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import Emoji from '@/components/Emoji';
import Loader from '@/components/Loader';
import BookHotelForm from './BookHotelForm';

export default function page() {
    const { slug } = useParams();
    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);

    const getHotel = async () => {
        try {
            const resp = await api.get(`/hotels?slug=${slug}`);
            setHotel(resp.data);
        } catch (err) {
            console.log(err);
        }finally{
            setLoading(false);
        }
    };

    useEffect(() => {
        if (slug) getHotel();
    }, [slug]);

    // if (!hotel) {
    //     return <div className="text-center text-xl py-10">Loading...</div>;
    // }

    // Function to get icon for amenities
    
if(loading) return <Loader className='mt-6' />
    return (
        <>
         <div className="max-w-6xl mx-auto p-5">
            <h1 className="text-3xl font-bold text-center my-5">{hotel.name}</h1>

            {/* Swiper Image Carousel with Keyboard Support */}
            <Swiper
                modules={[Navigation, Pagination, Keyboard, EffectFade]}
                navigation
                pagination={{ clickable: true }}
                keyboard={{ enabled: true, onlyInViewport: true }}
                effect="fade"
                className="rounded-lg shadow-lg"
            >
                {hotel.images.map((img, i) => (
                    <SwiperSlide key={i}>
                        <Image className="w-full h-[400px] object-cover rounded-lg" width={800} height={500} src={img} alt={hotel.name} />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Address */}
            <p className="mt-4 text-gray-700"><strong>📍 Address:</strong> {hotel.address}, {hotel.city}, {hotel.state}, {hotel.country}, {hotel.zipCode}</p>

            {/* Description */}
            <p className="mt-2 text-gray-700 italic">{hotel.description}</p>

            {/* Amenities */}
            <div className="mt-4">
                <h2 className="text-lg font-semibold">Amenities</h2>
                <div className="flex flex-wrap gap-2 mt-2">
                    {hotel.amenities.map((amenity, i) => (
                        <span key={i} className="px-3 py-1 bg-gray-200  text-sm rounded-md flex items-center gap-2">
                            {Emoji(amenity)} {amenity}
                        </span>
                    ))}
                </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
                <div className="text-2xl font-bold text-[var(--priBtn)]">₹ {hotel.price} / night</div>
                <button className="px-6 py-2 bg-[var(--priBtn)] text-white font-semibold rounded-lg shadow-md hover:bg-[var(--priBtnHover)]">Book Now</button>
            </div>
        </div>
        
        

        <BookHotelForm hotelId={hotel._id} totalPrice={hotel.price}/>
        </>
       
    );
}
