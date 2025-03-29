'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HotelCard from './HotelCard';
import Loader from '@/components/Loader';
import { alertError } from '@/components/Alert';

function Hotels() {
    const [hotelList, setHotelList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [radius, setRadius] = useState(10); // Default radius 10km
    const [userLocation, setUserLocation] = useState(null);

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

    const getNearbyHotels = async () => {
        if (!userLocation) {
            alertError("Location not found. Please allow location access.");
            return;
        }
        setLoading(true);
        try {
            const resp = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}api/hotels/near-by`, {
                lat: userLocation.lat,
                lng: userLocation.lng,
                radius,
            });
            setHotelList(resp.data);
        } catch (err) {
            console.error("Error fetching nearby hotels:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllHotels();
        // Get user location
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            (error) => {
                console.error("Error getting location:", error);
            }
        );
    }, []);

    return (
        <div className="flex flex-col items-center justify-center p-10">
            {/* Search Controls */}
            <div className="flex items-center gap-4 mb-6">
                <select 
                    className="border p-2 rounded" 
                    value={radius} 
                    onChange={(e) => setRadius(Number(e.target.value))}
                >
                    <option value={5}>5 km</option>
                    <option value={10}>10 km</option>
                    <option value={20}>20 km</option>
                    <option value={50}>50 km</option>
                </select>
                <button 
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" 
                    onClick={getNearbyHotels}
                >
                    Search Nearby Hotels
                </button>
            </div>

            {/* Hotel List */}
            <div className="flex flex-wrap gap-10 justify-center">
                {loading ? (
                    <Loader className="mt-12" />
                ) : (
                    <>
                    {hotelList.length===0 ? <div>No hotels Available</div> : <>
                    { hotelList.map((hotel) =><HotelCard key={hotel._id} hotel={hotel} />)}
                    </>}
                    </>
                   
            
                )}
            </div>
        </div>
    );
}

export default Hotels;
