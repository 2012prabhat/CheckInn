"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import Logo from "/public/logo.png";
import LoginBg from "/public/loginBg.jpg";

const VerifyEmailContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState(null);
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    setToken(searchParams.get("token"));
  }, [searchParams]);

  useEffect(() => {
    if (!token) return;

    const verifyEmail = async () => {
      try {
        const response = await axios.post("/api/auth/verify-email", { token });
        setMessage(response.data.message || "Email verified successfully!");
      } catch (error) {
        setMessage(error.response?.data?.message || "Verification failed.");
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="relative flex items-center justify-center min-h-screen">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center before:absolute before:inset-0 before:bg-black/40 before:backdrop-blur-sm"
        style={{ backgroundImage: `url(${LoginBg.src})` }}
      />

      {/* Verification Message Box */}
      <div className="relative z-10 w-full max-w-md p-6 rounded-lg shadow-lg bg-black/20 backdrop-blur-sm text-center">
        <Image
          onClick={() => router.push("/")}
          className="bg-white rounded-md cursor-pointer mx-auto"
          src={Logo}
          alt="Logo"
          width={80}
          height={80}
        />
        <h2 className="text-2xl font-bold text-white mt-4">Email Verification</h2>
        <p className="text-white text-lg font-semibold mt-4">{message}</p>
      </div>
    </div>
  );
};

// ✅ Suspense Wrapper for `useSearchParams()`
const VerifyEmail = () => {
  return (
    <Suspense fallback={<div className="text-white text-center">Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
};

export default VerifyEmail;
