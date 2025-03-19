'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import api from '@/components/api';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Keyboard, EffectFade, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import Emoji from '@/components/Emoji';
import Loader from '@/components/Loader';
import BookHotelForm from './BookHotelForm';
import useAuthStore from '@/components/useAuthStore';
import NotAuthenticated from '@/components/NotAuthenticated';
import Reviews from './Reviews';

export default function Page() {
    const scrollRef = useRef(null);
    const { slug } = useParams();
    const searchParams = useSearchParams();
    const query = searchParams.get("book");
    const { isAuthenticated } = useAuthStore();

    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (query) {
            setTimeout(() => handleBookNow(), 1000);
        }
    }, [query]);

    useEffect(() => {
        if (slug && isAuthenticated) {
            fetchHotel();
        }
    }, [slug, isAuthenticated]);

    const fetchHotel = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/hotels?slug=${slug}`);
            setHotel(data);
        } catch (err) {
            console.error("Error fetching hotel:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleBookNow = () => {
        scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
    };

    if (!isAuthenticated) return <NotAuthenticated />;
    if (loading) return <Loader className="mt-6" />;
    if (!hotel) return <div className="text-center text-lg mt-6">No hotel found.</div>;

    return (
        <div className="max-w-6xl mx-auto p-5">
            {/* Swiper Image Carousel */}
            <Swiper
                modules={[Navigation, Pagination, Keyboard, EffectFade, Autoplay]}
                navigation
                autoplay
                pagination={{ clickable: true }}
                keyboard={{ enabled: true, onlyInViewport: true }}
                effect="fade"
                className="rounded-lg shadow-lg"
            >
                {hotel?.images.map((img, i) => (
                    <SwiperSlide key={i}>
                        <Image
                            className="w-full h-[400px] object-cover rounded-lg"
                            width={800}
                            height={500}
                            src={img}
                            alt={hotel.name}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

            <h1 className="text-3xl font-bold text-center my-5">{hotel?.name}</h1>

            {/* Address */}
            <p className="mt-4 text-gray-700">
                <strong>📍 Address:</strong> {hotel?.address}, {hotel?.city}, {hotel?.state}, {hotel?.country}, {hotel?.zipCode}
            </p>

            {/* Description */}
            <p className="mt-2 text-gray-700 italic">{hotel?.description}</p>

            {/* Amenities */}
            <div className="mt-4">
                <h2 className="text-lg font-semibold">Amenities</h2>
                <div className="flex flex-wrap gap-2 mt-2">
                    {hotel?.amenities.map((amenity, i) => (
                        <span key={i} className="px-3 py-1 bg-gray-200 text-sm rounded-md flex items-center gap-2">
                            {Emoji(amenity)} {amenity}
                        </span>
                    ))}
                </div>
            </div>

            {/* Price & Book Now */}
            <div className="mt-6 flex items-center justify-between">
                <div className="text-2xl font-bold text-[var(--priBtn)]">₹ {hotel.price} / night</div>
                <button
                    className="px-6 py-2 bg-[var(--priBtn)] text-white font-semibold rounded-lg shadow-md hover:bg-[var(--priBtnHover)]"
                    onClick={handleBookNow}
                >
                    Book Now
                </button>
            </div>

            <Reviews hotelId={hotel?._id} />

            {/* Booking Form */}
            <div ref={scrollRef}>
                <BookHotelForm hotelId={hotel?._id} totalPrice={hotel?.price} />
            </div>
        </div>
    );
}
