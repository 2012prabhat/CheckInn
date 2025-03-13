import React,{useState} from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation';

function HotelCard({hotel}) {
    const router = useRouter();
    const [mainImg, setMainImg] = useState(0);
    const getIcon = (amenitie)=>{
        switch(amenitie){
            case 'pool':
                return '🏊‍♂️'
            case 'wifi':
                return '🛜'
            case 'spa':
                return '🧖'
             case 'restaurant':
                return '🍽️'
              case 'fine dining':
                return '🍽️'
             case 'fitness center':
                return '💪'
             case 'gym':
                return '💪'
            case 'boating':
                return '🚣'
        }
    }
  return (
    <div className='flex p-4 bg-[var(--mainCo)] w-[80vw]'>
        <div className='flex items-center'>
      <Image className='min-w-[300px]' width={300} height={10} src={`/hotels/${hotel.images[0]}`} alt='' />
        </div>
        <div className='p-4'>
            <div className='font-semibold text-xl'>{hotel.name}</div>
            <div className='italic mt-1'>{hotel.description}</div>
            <div className=''>{`${hotel.address}, ${hotel.city}, ${hotel.state}, ${hotel.country}, ${hotel.zipCode}` }</div>
            <div className=''>
                <div className='mt-2'>Amenities</div>
                <div className='flex gap-3'>{hotel.amenities.map((m,i)=>{
                    return <div key={i}>{m} {getIcon(m.toLowerCase())}</div>
                })}</div>
            </div>
            <div className='flex gap-5 items-center mt-6'>
            <div className='font-semibold text-3xl'>₹ {hotel.pricePerNight}</div>
            <div className='flex gap-2'>
                <button className='secBtn' onClick={()=>router.push(`/hotels/${hotel.slug}`)}>View Details</button>
                <button className='priBtn'>Book Now</button>
            </div>
            </div>
            
        </div>
    </div>
  )
}

export default HotelCard