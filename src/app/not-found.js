"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-56px)] bg-gray-100  text-gray-800">
      <motion.h1
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-6xl font-bold"
      >
        404
      </motion.h1>
      <p className="text-xl mt-2">Oops! Page not found.</p>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="mt-5 px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
        onClick={() => router.push("/")}
      >
        Go Home
      </motion.button>
    </div>
  );
}
