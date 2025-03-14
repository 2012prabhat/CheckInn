'use client'
import React from 'react'
import { InfinitySpin } from 'react-loader-spinner'

export default function Loader({className}) {
  return (
      <div className={`w-full flex items-center justify-center ${className}`}>
<InfinitySpin
        visible={true}
        // width="300"
        color="var(--priBtn)"
        ariaLabel="infinity-spin-loading"
      />
      </div>
      
  )
}
