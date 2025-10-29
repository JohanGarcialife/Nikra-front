import React from 'react'

export default function ThirdStep(props) {
    const {setActiveStep} = props
  return (
    <div>
         <div className='flex justify-start items-center gap-2 text-[#133D74]'>
        <svg onClick={() => setActiveStep(0)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-chevron-compact-left"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M13 20l-3 -8l3 -8" /></svg>
      </div>
       <p className='text-base my-24 text-center px-24 text-[#133D74]'>
        Crear nueva contraseña. Su nueva contraseña debe ser única de las utilizadas anteriormente.
      </p>
      <div className='w-full mt-16 border border-[#133D74] rounded-lg '>
<input 
            id="password" 
            name="password"
            type="password" 
            className="  text-[#133D74] w-full py-3 px-4 font-sans text-base  leading-5  placeholder:text-[#133D74] " 
            placeholder="Nueva contraseña" 
          />
</div>
<div className='w-full mt-16 border border-[#133D74] rounded-lg '>
<input 
            id="confirmPassword" 
            name="confirmPassword"
            type="confirmPassword" 
            className="  text-[#133D74] w-full py-3 px-4 font-sans text-base  leading-5  placeholder:text-[#133D74] " 
            placeholder="Confirmar nueva contraseña" 
          />
</div>
<button onClick={() => setActiveStep(3)} className='w-full mt-28 border border-[#133D74] text-[#133D74]  py-3 rounded-lg font-sans font-medium text-base'>
    Cambiar contraseña
</button>
    </div>
  )
}
