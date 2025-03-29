'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import api from '@/components/api';
import ReviewCard from '@/app/hotels/[slug]/ReviewCard';
import { alertError } from '@/components/Alert';
import useAuthStore from '@/components/useAuthStore';

function PostReview() {
    const { slug } = useParams();
    const { user } = useAuthStore(); // Get current user
    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    useEffect(() => {
        fetchHotelDetails();
    }, [slug]);

    const fetchHotelDetails = async () => {
        try {
            const res = await api.get(`/hotels?slug=${slug}`);
            setHotel(res.data);
            setReviews(res.data.reviews);
        } catch (err) {
            console.error("Error fetching hotel details:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/reviews', {
                hotelId: hotel._id,
                rating,
                comment,
            });

            setReviews([res.data.review, ...reviews]); // Add new review at the top
            setRating(5);
            setComment('');
        } catch (err) {
            alertError(err.response?.data?.message || "Failed to post review");
            console.error("Error posting review:", err);
        }
    };

    if (loading) return <p className="text-center mt-10">Loading...</p>;

    // Find if current user has already posted a review
    const userReview = user ? reviews.find((r) => r.user._id === user.id) : null;

    // Filter out user's review from the list
    const filteredReviews = reviews.filter((r) => r.user._id !== user?.id);

    return (
        <div className="max-w-3xl mx-auto p-6">
            {/* Hotel Details */}
            {hotel && (
                <div className="mb-6">
                    <img src={hotel.images[0]} alt={hotel.name} className="w-full h-56 object-cover rounded-lg" />
                    <h1 className="text-2xl font-bold mt-3">{hotel.name}</h1>
                </div>
            )}

            {/* Review Form (Hidden if user already posted) */}
            {!userReview ? (
                <form onSubmit={handleSubmit} className="mb-6">
                    <h2 className="text-xl font-semibold mb-3">Write a Review</h2>
                    <label className="block mb-2">
                        Rating:
                        <select
                            value={rating}
                            onChange={(e) => setRating(Number(e.target.value))}
                            className="border p-2 rounded w-full mt-1"
                        >
                            {[1, 2, 3, 4, 5].map((num) => (
                                <option key={num} value={num}>{num} ⭐</option>
                            ))}
                        </select>
                    </label>
                    <label className="block mb-2">
                        Comment:
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="border p-2 rounded w-full mt-1 h-24"
                        />
                    </label>
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Submit Review
                    </button>
                </form>
            ) : (
                <div className="mb-6 p-4 border rounded bg-gray-100">
                    <p className="text-gray-700">✅ You have already posted a review for this hotel.</p>
                </div>
            )}

            {/* Reviews List */}
            <h2 className="text-xl font-semibold mb-3">Reviews</h2>
            {userReview && (
                <div className="p-4 rounded mb-3 bg-yellow-100 border border-yellow-300">
                    <h3 className="font-semibold text-yellow-700">Your Review</h3>
                    <ReviewCard review={userReview} />
                </div>
            )}
            {filteredReviews.length > 0 ? (
                filteredReviews.map((review, index) => (
                    <div key={index} className="p-4 rounded mb-3">
                        <ReviewCard review={review} />
                    </div>
                ))
            ) : (
                <>
                {userReview==null && <p>No reviews yet. Be the first to review!</p>}
                
                </>
            )}
        </div>
    );
}

export default PostReview;
