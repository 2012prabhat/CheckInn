"use client";
import { useEffect, useState } from "react";
import Head from "next/head"; // ✅ Correct way to handle <title> and <meta>
import "./globals.css";
import Navbar from "./Navbar";
import useAuthStore from "@/components/useAuthStore";

export default function RootLayout({ children }) {
  const { initializeAuth } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const authInitialized = initializeAuth();
    setIsInitialized(authInitialized);
  }, []);

  // if (!isInitialized) {
  //   return (
  //     <html lang="en">
  //       <body className="overflow-auto light">
  //         <div>Loading...</div> {/* ✅ Render something instead of null */}
  //       </body>
  //     </html>
  //   );
  // }

  return (
    <html lang="en">
      <Head> 
        <title>CheckInn - Your Hotel Booking App</title>
        <meta name="description" content="Find and book hotels easily!" />
      </Head>
      <body className="overflow-auto light">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
