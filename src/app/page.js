"use client";
import { useEffect } from "react";
import useAuthStore from "@/components/useAuthStore";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  // if (!isAuthenticated) {
  //   return <div>Redirecting to login...</div>;
  // }

  return <div>Welcome to CheckInn!</div>;
}
