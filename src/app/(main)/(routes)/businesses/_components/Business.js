import React from 'react'



export default function Business() {
  return (
    <div 
  className="relative w-[350px] bg-white/30 border-t-4 border-b-4 border-[#133D74] border-x-0 flex flex-col items-center overflow-hidden rounded-lg transition duration-200 ease-in-out hover:-translate-y-0.5"
>
  {/* .box: w-[350px], bg-white/30, bordes personalizados, flex-col, rounded-lg (8px), transición y hover effect (transform: translateY(-2px) -> -translate-y-0.5) */}
  
  <img 
    src={'/Commerces/Copia de Carol zapatos.jpg'} 
    alt="Carol Zapatos Commerce" 
    className="p-1 h-[150px] object-contain transition duration-200 ease-in-out"
  />
  {/* .imgCommerce: p-1 (4px), h-[150px] fijo, object-contain, transición (aunque .box:hover ya aplica el efecto) */}

  <div className="text-center py-1.5 px-2.5 text-[#133D74] text-sm font-bold">
    {/* .titleBusiness: text-center, py-1.5 (6px), px-2.5 (10px), color custom, text-sm (small) */}
    Charol Zapatos
  </div>

  <div className="text-center py-1.5 px-2.5 text-[#133D74] text-xs">
    {/* .textBusiness: text-center, py-1.5 (6px), px-2.5 (10px), color custom, text-xs (x-small) */}
    Tu tienda Multimarca en Ceuta, para ellas y ellos las mejores marcas en el sector del calzado. Conoce nuestros establecimientos donde nuestro equipo de profesionales te atenderá de manera individual, profesional y cercana... Porque llevamos un largo recorrido caminando con nuestros clientes.
  </div>

  <div className="flex flex-col pt-1.5 pl-[30px] gap-1.5 self-start">
    {/* .finalTable: flex-col, pt-1.5 (6px), pl-[30px] (custom), gap-1.5 (6px), self-start */}
    
    <div className="flex flex-row gap-2.5">
      {/* .linesTable: flex-row, gap-2.5 (10px) */}
      <img src={'Vector(4).svg'} className="w-5 h-5"/>
      {/* .linesTable img: w-5 (20px), h-5 (20px) */}
      <span className="text-[#133D74] text-xs font-bold">
        {/* .linesTable span: color custom, text-xs (x-small), font-bold */}
        956514406
      </span>
    </div>
    
    <div className="flex flex-row gap-2.5">
      <img src={'Vector(6).svg'} className="w-5 h-5"/>
      <span className="text-[#133D74] text-xs font-bold">
        Paseo del Revellín, 9
      </span>
    </div>
    
    <div className="flex flex-row gap-2.5">
      <img src={'fluent-mdl2_website(1).svg'} className="w-5 h-5"/>
      <span className="text-[#133D74] text-xs font-bold">
        www.Ejemplo.com
      </span>
    </div>
    
    <div className="flex flex-row gap-2.5">
      <img src={'Calendar_Week.svg'} className="w-5 h-5"/>
      <span className="text-[#133D74] text-xs font-bold">
        Mañana: 10:00 - 14:00 Tardes: 16:00 - 20:00
      </span>
    </div>
  </div>
</div>
  )
}
