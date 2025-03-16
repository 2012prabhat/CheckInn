"use client";
import { useRouter } from "next/navigation";

export default function NotAuthenticated() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px]">
      <p className="text-xl font-semibold mb-4 text-red-600">You are not logged in.</p>
      <button
        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700"
        onClick={() => router.push("/login")}
      >
        Login Now
      </button>
    </div>
  );
}
