"use client"
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

export default function MainMenuBar(props) {
    const {images} = props
    const [showModal, setShowModal] = useState(false)
    const [pdfLoadError, setPdfLoadError] = useState(false)


    
  return (
    <>
    <div 
  className="grid grid-cols-3 w-full  h-full bg-white rounded-xl  py-2 px-3  shadow s my-5 "
>
  {/* .box: flex, justify-between, items-center, max-w-[450px], h-[90px], bg-white, border custom, padding custom, shadow, centrado, z-index */}
 
    <div onClick={() => setShowModal(true)}  className="flex  flex-col items-center justify-center text-[#133D74] flex-1">
      {/* .item: flex-col, centrado, flex-1 (distribuye el espacio) */}
      
      
      <Image
      width={30}
      height={30}
        
        src={"/icono-legal.svg"}
        alt={"menu"}
      
        
       
        
      />
      
      <span 
        className="text-xs font-bold text-[#133D74] mt-1" 
        /* .imagefoot: text-xs (12px), font-bold, color custom, mt-1 (4px) */
       
        
      >
        Bases
      </span>
    </div>

    <div  className="flex  flex-col items-center justify-center text-[#133D74] flex-1">
      {/* .item: flex-col, centrado, flex-1 (distribuye el espacio) */}
      
      <div className='absolute ≈'>
<Link href={"/register-qr"}> 
<div className='bg-yellow-500 !shadow-2xl rounded-full p-5 flex items-center justify-center '>

      <Image
      width={50}
      height={50}
        src={"/icono-registrar.svg"}
        alt={"menu"}
      />
</div>  
</Link>
      </div>
     
     
      
    </div>

      <Link href={"/businesses"}>
   <div  className="flex flex-col  items-center justify-center text-[#133D74] flex-1">
      {/* .item: flex-col, centrado, flex-1 (distribuye el espacio) */}
      
      <Image
      width={30}
      height={30}
        
        src={"/icono-comercios.svg"}
        alt={"menu"}
      
        
       
        
      />
      
      
      <span 
        className="text-xs font-bold text-[#133D74] mt-1" 
        /* .imagefoot: text-xs (12px), font-bold, color custom, mt-1 (4px) */
       
        
      >
        Comercios
      </span>
    </div>
      </Link>

</div>
{showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-4 max-w-3xl w-full max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between mb-2">
              <div>
                <button onClick={() => setShowModal(false)} className="text-white px-3 py-1 rounded-md bg-red-400">
                  Cerrar
                </button>
              </div>
              <div className="flex gap-2">
                <a
                  href="/bases_sorteo.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 underline"
                >
                  Abrir en nueva pestaña
                </a>
              </div>
            </div>

            <div className="w-full h-[70vh] sm:h-[80vh] md:h-[85vh]">
              {!pdfLoadError ? (
                <iframe
                  src="/bases_sorteo.pdf"
                  title="Bases sorteo"
                  className="w-full h-full border-none"
                  onLoad={() => setPdfLoadError(false)}
                  onError={() => setPdfLoadError(true)}
                />
              ) : (
                <div className="p-4 text-center">
                  <p className="mb-2">No fue posible cargar el PDF en este visor.</p>
                  <a href="/BASES_LEGALES_REGISTRO_“COMPRA,_CONECTA_Y_GANA_MANZANA_–_EDICIÓN-(NUEVA).pdf" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Descargar / Abrir PDF</a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
</>
  )
}