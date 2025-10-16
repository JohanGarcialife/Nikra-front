import Image from 'next/image';
import Link from 'next/link';
import React from 'react'



export default function Business(props) {
  const { business } = props;
  console.log(business);
  
  return (
    <div 
  className="relative w-full bg-white my-5 border-t-4 border-b-4 border-[#133D74] border-x-0 flex flex-col items-center overflow-hidden rounded-lg transition duration-200 ease-in-out hover:-translate-y-0.5"
>
  {/* .box: w-[350px], bg-white/30, bordes personalizados, flex-col, rounded-lg (8px), transición y hover effect (transform: translateY(-2px) -> -translate-y-0.5) */}
  
  {/* Imagen: contenedor con altura fija */}
  <div className="relative w-full h-[150px] bg-white/0">
    <Image 
      src={`/comercios/${business.imagen}`} 
      fill
      alt={business.nombre || "Imagen comercio"} 
      className="object-cover w-full h-full"
    />
  </div>
  {/* .imgCommerce: h-[150px] fijo, object-cover para ocupar todo el ancho y la altura */}

  <div className="text-center bg-white py-1.5 px-2.5 text-[#133D74] text-sm font-bold">
    {/* .titleBusiness: text-center, py-1.5 (6px), px-2.5 (10px), color custom, text-sm (small) */}
    {business.nombre}
  </div>

  <div className="text-center py-1.5 px-2.5 text-[#133D74] text-xs">
    {/* .textBusiness: text-center, py-1.5 (6px), px-2.5 (10px), color custom, text-xs (x-small) */}
    {business.descripcion}
  </div>

  <div className="flex flex-col pt-1.5 pl-[30px] gap-1.5 self-start">
    {/* .finalTable: flex-col, pt-1.5 (6px), pl-[30px] (custom), gap-1.5 (6px), self-start */}
    
    <div className="flex flex-row gap-2.5">
      {/* .linesTable: flex-row, gap-2.5 (10px) */}
      <img src={'Vector(4).svg'} className="w-5 h-5"/>
      {/* .linesTable img: w-5 (20px), h-5 (20px) */}
      <span className="text-[#133D74] text-xs font-bold">
        {/* .linesTable span: color custom, text-xs (x-small), font-bold */}
      {  business.telefono }
      </span>
    </div>
    
    <div className="flex flex-row gap-2.5">
      <img src={'Vector(6).svg'} className="w-5 h-5"/>
      <Link href={business.maps_url} target="_blank" rel="noopener noreferrer">
      <span className="text-[#133D74] text-xs font-bold">
        { business.direccion }
      </span>
      </Link>
    </div>
    
    <div className="flex flex-row gap-2.5">
      <img src={'fluent-mdl2_website(1).svg'} className="w-5 h-5"/>
      <span className="text-[#133D74] text-xs font-bold">
        { business.web_url }
      </span>
    </div>
    
      <div className="flex flex-row gap-2.5">
        {business.rrss_url &&
          business.rrss_url.split(' | ').map((url, index) => (
            <Link key={index} href={url} target="_blank" rel="noopener noreferrer" className="flex flex-row gap-2.5 items-center">
              {url.includes('facebook') ? (
                <img src={'/facebook.svg'} className="w-5 h-5"/>
              ) : url.includes('instagram') ? (
                <img src={'/instagram.svg'} className="w-5 h-5"/>
              ) : null}
            </Link>
          ))}
      </div>
  </div>
</div>
  )
}
