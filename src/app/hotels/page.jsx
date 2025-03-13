'use client'
import React,{useState, useEffect} from 'react'
import axios from 'axios';
import HotelCard from './HotelCard';

function Hotels() {
    const [hotelList, setHotelList] = useState([]);

    const getAllHotels = async ()=>{
        try{
            const resp = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}api/hotels`);
            setHotelList(resp.data)
        }catch(err){

        }
    }

    useEffect(()=>{
        getAllHotels()
    },[])

  return (
    <div className='flex flex-wrap gap-10 items-center justify-center p-10'>
        {hotelList.map((hotel)=>{
            return <HotelCard key={hotel._id} hotel={hotel}/>
        })}
    </div>
  )
}

export default Hotels