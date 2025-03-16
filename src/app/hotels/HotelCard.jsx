import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion"; // Import Framer Motion
import Emoji from '@/components/Emoji'

function HotelCard({ hotel }) {
  const router = useRouter();
  const [mainImg, setMainImg] = useState(hotel.images[0]);


  

  // Handle image change with animation
  const handleImageChange = (img) => {
    setMainImg(img);
  };



  return (
    <div className="flex flex-col lg:flex-row p-4 bg-[var(--mainCo)] w-full lg:w-[95vw] rounded-lg shadow-md">
      {/* Image Section */}
      <div className="flex flex-col items-center w-full lg:w-[40%]">
        <motion.div
          key={mainImg} // Ensures re-render on image change
          initial={{ opacity: 0, x: -50 }} // Slide from left
          animate={{ opacity: 1, x: 0 }} // Animate to normal position
          transition={{ duration: 0.3 }} // Smooth transition
          className="w-full flex justify-center"
        >
          <Image
            className="rounded-lg w-full max-w-[350px] lg:min-w-[300px]"
            width={300}
            height={200}
            src={mainImg}
            alt={hotel.name}
          />
      
        </motion.div>

        {/* Thumbnail Images */}
        <div className="flex gap-2 mt-2 w-full justify-center">
          {hotel?.images?.map((img, i) => (
            <Image
              key={i}
              className={`cursor-pointer transition-all rounded-md ${
                mainImg === img ? "border-2 border-blue-500 p-1" : ""
              }`}
              width={50}
              height={50}
              src={img}
              onClick={() => handleImageChange(img)}
              alt={`Thumbnail ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Hotel Details */}
      <div className="p-4 text-center lg:text-left w-full lg:w-[60%]">
        <h2 className="font-semibold text-2xl lg:text-xl">{hotel.name}</h2>
        <p className="italic mt-1">{hotel.description}</p>
        <p className="text-gray-700">
          📍 {hotel.address}, {hotel.city}, {hotel.state}, {hotel.country},{" "}
          {hotel.zipCode}
        </p>

        {/* Amenities */}
        <div className="mt-2">
          <h3 className="font-medium">Amenities</h3>
          <div className="flex flex-wrap justify-center lg:justify-start gap-2 mt-1">
            {hotel?.amenities?.map((m, i) => (
              <span
                key={i}
                className="bg-gray-200 px-3 py-1 rounded-md text-sm flex items-center gap-1"
              >
                {Emoji(m.toLowerCase())} {m}
              </span>
            ))}
          </div>
        </div>

        {/* Pricing & Buttons */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-center lg:justify-start mt-6">
          <div className="font-semibold text-3xl text-blue-600">
            ₹ {hotel.price}
          </div>
          <div className="flex gap-3">
            <button
              className="secBtn py-2 px-4 text-sm lg:text-base"
              onClick={() => router.push(`/hotels/${hotel.slug}`)}
            >
              View Details
            </button>
            <button className="priBtn py-2 px-4 text-sm lg:text-base"  onClick={() => router.push(`/hotels/${hotel.slug}?book=true`)}>
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HotelCard;
