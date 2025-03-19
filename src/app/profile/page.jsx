'use client';
import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/components/useAuthStore';
import api from '@/components/api';
import Image from 'next/image';
import { FaCamera } from 'react-icons/fa';

export default function UserProfile() {
    const { user, isAuthenticated, logout, setUser } = useAuthStore();
    const router = useRouter();
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout'); // Backend logout (optional)
            logout();
            router.push('/login');
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('profileImage', file);

        try {
            setUploading(true);
            const response = await api.post('/profile/upload-profile-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response)
            setUser({ ...user, profileImg: response.data.profileImg }); // Update Zustand store
        } catch (error) {
            console.error('Image upload failed:', error);
        } finally {
            setUploading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-lg text-gray-700">Please <span className="text-blue-500 cursor-pointer" onClick={() => router.push('/login')}>Login</span> to view your profile.</p>
            </div>
        );
    }

    return (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
            {/* Avatar */}
            <div className="relative flex justify-center">
                <Image
                    className="rounded-full border-2 border-white"
                    src={user?.profileImg || "/userAvatar.png"}
                    alt="Profile"
                    width={140}
                    height={140}
                />
                {/* Edit Icon */}
                <button 
                    className="absolute bottom-2  bg-gray-700 text-white p-2 rounded-full shadow-md hover:bg-gray-800"
                    onClick={handleImageClick}
                >
                    <FaCamera />
                </button>
                <input 
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                />
            </div>

            {/* User Info */}
            <h2 className="text-2xl font-semibold text-center mt-4">{user?.name}</h2>
            <p className="text-gray-600 text-center">{user?.email}</p>
            {user?.role === 'admin' &&             <p className="font-bold text-gray-500 text-center text-sm mt-1 capitalize">{user?.role}</p>}


            {/* Logout Button */}
            <div className="mt-6">
                <button
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 w-full"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
