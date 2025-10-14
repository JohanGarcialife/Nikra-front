import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function MainMenuBar(props) {
    const {images} = props


    
  return (
    <div 
  className="flex justify-between items-center w-full  h-[90px] bg-white rounded-xl border border-[#133D74] p-[20px] px-9 shadow-lg s my-5 mx-autoz-10"
>
  {/* .box: flex, justify-between, items-center, max-w-[450px], h-[90px], bg-white, border custom, padding custom, shadow, centrado, z-index */}
  {images.map((img, index) => (
    <div key={index} className="flex flex-col items-center justify-center flex-1">
      {/* .item: flex-col, centrado, flex-1 (distribuye el espacio) */}
      <Link href={img.route ? img.route : "#"} >
      
      <Image
      width={40}
      height={40}
        key={index}
        src={img.src}
        alt={img.alt}
        className="w-10 h-10 object-contain"
        
       
        style={{ cursor: img.onClick ? "pointer" : "default" }}
      />
      </Link>
      <span 
        className="text-xs font-bold text-[#133D74] mt-1" 
        /* .imagefoot: text-xs (12px), font-bold, color custom, mt-1 (4px) */
       
        style={{ cursor: img.onClick ? "pointer" : "default" }}
      >
        {img.foot}
      </span>
    </div>
  ))}
</div>
  )
}
