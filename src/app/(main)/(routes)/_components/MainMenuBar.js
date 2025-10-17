import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function MainMenuBar(props) {
    const {images} = props


    
  return (
    <div 
  className="flex justify-between items-center w-full  h-full bg-white rounded-xl  py-2 px-3  shadow-lg s my-5 mx-autoz-10"
>
  {/* .box: flex, justify-between, items-center, max-w-[450px], h-[90px], bg-white, border custom, padding custom, shadow, centrado, z-index */}
 
    <div  className="flex flex-col items-center justify-center flex-1">
      {/* .item: flex-col, centrado, flex-1 (distribuye el espacio) */}
      
      
      <Image
      width={30}
      height={30}
        
        src={"/Vector(4).svg"}
        alt={"menu"}
      
        
       
        
      />
      
      <span 
        className="text-xs font-bold text-[#133D74] mt-1" 
        /* .imagefoot: text-xs (12px), font-bold, color custom, mt-1 (4px) */
       
        
      >
        Bases
      </span>
    </div>

    <div  className="flex flex-col items-center justify-center flex-1">
      {/* .item: flex-col, centrado, flex-1 (distribuye el espacio) */}
      

      <div className='absolute '>

      <Image
      width={82}
      height={82}
        src={"/bi_qr-code-scan.png"}
        alt={"menu"}
        className='w-32 h-32 object-cover'
      />
      </div>
     
     
      
    </div>

   <div  className="flex flex-col items-center justify-center flex-1">
      {/* .item: flex-col, centrado, flex-1 (distribuye el espacio) */}
      
      <Link href={"/businesses"}>
      <Image
      width={30}
      height={30}
        
        src={"/Vector(3).svg"}
        alt={"menu"}
      
        
       
        
      />
      
      
      <span 
        className="text-xs font-bold text-[#133D74] mt-1" 
        /* .imagefoot: text-xs (12px), font-bold, color custom, mt-1 (4px) */
       
        
      >
        Comercios
      </span>
      </Link>
    </div>

</div>
  )
}
