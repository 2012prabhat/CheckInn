'use client'
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import api from '@/components/api';
import Image from 'next/image';

export default function HotelDetail() {
    const { slug } = useParams();
    const [hotel, setHotel] = useState(null);
    const [mainImg, setMainImg] = useState(null);

    const getHotel = async () => {
        try {
            const resp = await api.get(`/hotels?slug=${slug}`);
            setHotel(resp.data);
            setMainImg(resp.data.images[0]);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getHotel();
    }, []);

    if (!hotel) {
        return <div className="text-center text-xl py-10">Loading...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto p-5">
            <h1 className="text-3xl font-bold text-center my-5">{hotel.name}</h1>
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <Image className="rounded-lg shadow-lg w-full" width={600} height={400} src={`/hotels/${mainImg}`} alt={hotel.name} />
                    <div className="flex gap-2 mt-4">
                        {hotel.images.map((img, i) => (
                            <Image 
                                key={i} 
                                className={`cursor-pointer rounded-lg border-2 ${mainImg === img ? 'border-blue-500' : 'border-transparent'}`} 
                                width={80} 
                                height={50} 
                                src={`/hotels/${img}`} 
                                onClick={() => setMainImg(img)} 
                                alt="Hotel Preview"
                            />
                        ))}
                    </div>
                </div>
                <div>
                    <p className="text-gray-700 italic">{hotel.description}</p>
                    <p className="mt-2"><strong>📍 Address:</strong> {hotel.address}, {hotel.city}, {hotel.state}, {hotel.country}, {hotel.zipCode}</p>
                    <div className="mt-4">
                        <h2 className="text-lg font-semibold">Amenities</h2>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {hotel.amenities.map((amenity, i) => (
                                <span key={i} className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md">{amenity}</span>
                            ))}
                        </div>
                    </div>
                    <div className="mt-6 flex items-center justify-between">
                        <div className="text-2xl font-bold text-green-600">₹ {hotel.pricePerNight} / night</div>
                        <button className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700">Book Now</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
