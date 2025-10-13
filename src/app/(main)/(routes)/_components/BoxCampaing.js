import Image from 'next/image';
import React from 'react'

export default function BoxCampaing(props) {
    const { src, alt = "Campaing Image" } = props;
   
    
  return (
    <div><div 
  className="relative w-full h-[486px] bg-white/30 border-t-4 border-b-4 border-[#133D74] border-l-0 border-r-0 flex justify-center items-center overflow-hidden rounded-lg"
>
  {/* .box: relative, width y height fijos, fondo semitransparente, bordes personalizados, flexbox y overflow */}
  <Image
  width={327}
  height={486}
    src={src} 
    alt={alt} 
    className="w-full h-full object-contain" 
  />
  {/* .image: max-width/height al 100% y object-fit: contain */}
  
</div></div>
  )
}
