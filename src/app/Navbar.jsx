"use client";
import React, { useState, useEffect } from "react";
import logo from "/public/logo.png";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import useAuthStore from "@/components/useAuthStore";
import api from "@/components/api"


export default function Navbar() {
  const router = useRouter();
  const path = usePathname();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
 


  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-menu")) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try{
      setDropdownOpen(false); // Dropdown close karna
      const resp = await api.post('/auth/logout')
      logout(); // Logout function call karna
      router.push("/login"); // Login page pe redirect
    }catch(err){
      console.log(err);
    }
  };

  // **Fix: Hooks ke baad return statement likhna**
  const hiddenPaths = ["/login", "/register",'/reset-password','/verify-email'];
  if (hiddenPaths.includes(path)) {
    return null;
  }

  if (path === "/not-found") {
    return null;
  }

  return (
    <div className="bg-[var(--mainCol)] h-14 flex items-center shadow-sm justify-between px-4 sticky top-0 z-50">
      {/* Logo */}
      <Image
        className="w-16 cursor-pointer bg-[white] border-0 rounded-md"
        src={logo}
        alt="CheckInn Logo"
        onClick={() => router.push("/")}
      />

      {/* Auth Section */}
      <div className="relative flex items-center gap-4">
        {isAuthenticated ? (
          <>
            {/* User Profile */}
            <div
              className="flex items-center gap-2 cursor-pointer dropdown-menu"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div className="font-semibold text-[var(--textCol)]">{user?.name}</div>
              <Image
                className="w-10 h-10 rounded-full border-2 border-white"
                src={user?.profileImg || "/userAvatar.png"}
                alt="Profile"
                width={40}
                height={40}
              />
            </div>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 top-12 bg-white shadow-lg rounded-lg w-40 py-2 dropdown-menu">
                <div className="px-4 py-2 font-semibold border-b">{user?.name}</div>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    router.push("/profile");
                    setDropdownOpen(false);
                  }}
                >
                  Profile 👤
                </button>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                  onClick={handleLogout}
                >
                  Logout 🚀
                </button>
              </div>
            )}
          </>
        ) : (
          <button className="priBtn" onClick={() => router.push("/login")}>
            Login / Signup
          </button>
        )}
      </div>
    </div>
  );
}
