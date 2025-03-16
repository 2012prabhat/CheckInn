"use client";
import { useEffect } from "react";
import useAuthStore from "@/components/useAuthStore";
import { useRouter } from "next/navigation";
import LandingPage from "./LandingPage";


export default function Home() {
  const router = useRouter();
  // const { isAuthenticated, initializeAuth } = useAuthStore();

  useEffect(() => {
    // checkAuth()
  }, []);

  // const checkAuth = async ()=>{
  //   const authState = await initializeAuth(); 
  //   if(!authState){
  //     router.replace("/login");
  //   }
  // }

  // if (!isAuthenticated) {
  //   return <div>Redirecting to login...</div>;
  // }

  return <>
 <LandingPage/>
  </>
}
