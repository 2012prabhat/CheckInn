import React from 'react'
import BookNowImg from "/public/bookNow.avif"
import Image from 'next/image'
import { useRouter } from 'next/navigation'

function LandingPage() {
  const Router = useRouter();
  return (
    <>
    <Image className='p-4 md:rounded-[40px] rounded-[30px] cursor-pointer' onClick={()=>Router.push("/hotels")} src={BookNowImg} alt=""/>
    </>
  )
}

export default LandingPage