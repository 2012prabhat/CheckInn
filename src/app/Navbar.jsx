"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import useAuthStore from "@/components/useAuthStore";
import api from "@/components/api";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const path = usePathname();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-menu")) {
        setDropdownOpen(false);
      }
      if (!event.target.closest(".mobile-menu") && menuOpen) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const handleLogout = async () => {
    try {
      setDropdownOpen(false);
      await api.post("/auth/logout");
      logout();
      router.push("/login");
    } catch (err) {
      console.log(err);
    }
  };

  const hiddenPaths = ["/login", "/register", "/reset-password", "/verify-email"];
  if (hiddenPaths.includes(path)) return null;

  return (
    <div className="bg-[var(--mainCol)] h-14 flex items-center shadow-sm justify-between px-4 sticky top-0 z-50">
      {/* Left Section: Logo & Mobile Menu Button */}
      <div className="flex items-center gap-4">
        <Image
          className="w-10 md:w-14 lg:w-14 cursor-pointer bg-white border-0 rounded-sm"
          width={200}
          height={200}
          src="/logo.png"
          alt="CheckInn Logo"
          onClick={() => router.push("/")}
        />

        {/* Mobile Menu Button */}
        {user?.role === "admin" && (
          <button className="lg:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}
      </div>

      {/* Center Section: Navigation Links */}
      {user?.role === "admin" && (
        <div className="hidden lg:flex gap-x-8 flex-grow pl-10">
          <div
            className={`text-[var(--textCol)] cursor-pointer p-2 border-b-4 ${
              path === "/bookings" ? "border-[var(--priBtn)]" : "border-transparent"
            }`}
            onClick={() => router.push("/bookings")}
          >
            My Bookings
          </div>

          <div
            className={`text-[var(--textCol)] cursor-pointer p-2 border-b-4 ${
              path.startsWith("/hotels") ? "border-[var(--priBtn)]" : "border-transparent"
            }`}
            onClick={() => router.push("/hotels")}
          >
            Book hotels
          </div>

          <div
            className={`text-[var(--textCol)] cursor-pointer p-2 border-b-4 ${
              path.startsWith("/admin") ? "border-[var(--priBtn)]" : "border-transparent"
            }`}
            onClick={() => router.push("/admin")}
          >
            Admin Panel
          </div>
        </div>
      )}

      {/* Right Section: Auth/User Profile */}
      <div className="relative flex items-center gap-4">
        {isAuthenticated ? (
          <>
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
              <div className="absolute right-0 top-12 bg-white shadow-lg rounded-lg w-40 py-2 dropdown-menu z-50">
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

      {/* Mobile Menu */}
      {menuOpen && user?.role === "admin" && (
        <div className="absolute top-14 left-0 w-full bg-gray-800 text-white shadow-md flex flex-col lg:hidden mobile-menu">
          <div
            className={`p-4 border-b border-gray-700 cursor-pointer ${
              path === "/bookings" ? "bg-gray-700" : ""
            }`}
            onClick={() => {
              router.push("/bookings");
              setMenuOpen(false);
            }}
          >
            My Bookings
          </div>
          <div
            className={`p-4 border-b border-gray-700 cursor-pointer ${
              path.startsWith("/hotels") ? "bg-gray-700" : ""
            }`}
            onClick={() => {
              router.push("/hotels");
              setMenuOpen(false);
            }}
          >
            Book hotels
          </div>
          <div
            className={`p-4 cursor-pointer ${path === "/admin" ? "bg-gray-700" : ""}`}
            onClick={() => {
              router.push("/admin");
              setMenuOpen(false);
            }}
          >
            Admin Panel
          </div>
        </div>
      )}
    </div>
  );
}
