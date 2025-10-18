"use client"
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

export default function MainMenuBar(props) {
    const {images} = props
    const [showModal, setShowModal] = useState(false)


    
  return (
    <>
    <div 
  className="grid grid-cols-3 w-full  h-full bg-white rounded-xl  py-2 px-3  shadow s my-5 "
>
  {/* El contenido de la barra de menú sigue igual... */}
 
    <div onClick={() => setShowModal(true)}  className="flex  flex-col items-center justify-center text-[#133D74] flex-1">
      
      <Image
      width={30}
      height={30}
        
        src={"/Vector(4).svg"}
        alt={"menu"}
      />
      
      <span 
        className="text-xs font-bold text-[#133D74] mt-1" 
      >
        Bases
      </span>
    </div>

    <div  className="flex  flex-col items-center justify-center text-[#133D74] flex-1">
      
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

      <Link href={"/businesses"}>
   <div  className="flex flex-col  items-center justify-center text-[#133D74] flex-1">
      
      <Image
      width={30}
      height={30}
        
        src={"/Vector(3).svg"}
        alt={"menu"}
      
        
       
        
      />
      
      
      <span 
        className="text-xs font-bold text-[#133D74] mt-1" 
       
        
      >
        Comercios
      </span>
    </div>
      </Link>

</div>
{showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 bg-opacity-50">
          <div className="bg-white rounded-lg p-4 max-w-3xl w-full">
            <div className="flex justify-end">
              <button onClick={() => setShowModal(false)} className="text-black text-2xl font-bold">
                X
              </button>
            </div>
            {/* 🎯 ¡ESTE ES EL CAMBIO CLAVE! 🎯 */}
            <embed src="/bases_sorteo.pdf" type="application/pdf" width="100%" height="600px" />
          </div>
        </div>
      )}
</>
  )
}