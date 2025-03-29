import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import BookNowImg from "/public/bookNow.avif";
import landBg from "/public/landing-bg1.jpg"

function LandingPage() {
  const router = useRouter();

  return (
    <div style={{background:`url(${landBg.src})`, backgroundSize:'cover'}} className="relative w-full h-[100vh] flex flex-col items-center justify-center text-white px-6 md:px-12">
      {/* Overlay for better visibility */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          "Travel far enough, you meet yourself."
        </h1>
        <p className="mt-4 text-lg md:text-xl">
          Discover amazing destinations and book your perfect stay with ease.
        </p>

        {/* Book Now Button */}
        <button
          className="mt-6 px-6 py-3 bg-[var(--mainCol)] text-white text-lg font-semibold rounded-full shadow-lg hover:scale-105 transition-all"
          onClick={() => router.push("/hotels")}
        >
          Book Now
        </button>
      </div>

      {/* Image */}
      <Image
        className="mt-8 w-[90%]  md:w-[65%] rounded-2xl shadow-lg cursor-pointer transition-all hover:scale-105 z-10"
        src={BookNowImg}
        alt="Book Now"
        onClick={() => router.push("/hotels")}
      />
    </div>
  );
}

export default LandingPage;
