"use client"
import React from 'react'
import logo from "/public/logo.png"
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function Navbar() {
    const router = useRouter();
  return (
    <div className='bg-[var(--mainCol)] h-14 flex items-center shadow-sm justify-between p-3'>
      
    <Image
      className='w-16'
      src={logo}
      alt="CheckInn Logo"
      onClick={()=>router.push('/')}
    />

    <div>
        <button className='priBtn' onClick={()=>router.push("/login")}>Login / Signup</button>
    </div>
      
    </div>
  )
}
