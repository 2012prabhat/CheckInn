import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./Navbar";

export const metadata = {
  title: "CheckInn",
  description: "A Hotel Booking App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`light`}
      >
        <Navbar/>
        {children}
      </body>
    </html>
  );
}
