import Link from 'next/link'
import React from 'react'

export default function FirstStep(props) {
    const {setActiveStep} = props
  return (
    <div>        <p className='text-base mt-24 mb-12 text-[#133D74]'>
¿Has olvidado tu contraseña?
</p>
<p className='text-base text-[#133D74]'>
¡No te preocupes! eso ocurre, Ingrese la dirección de correo electrónico vinculada con su cuenta.
</p>

<div className='w-full mt-16 border border-[#133D74] rounded-lg '>
<input 
            id="email" 
            name="email"
            type="email" 
            className="  text-[#133D74] w-full py-3 px-4 font-sans text-base  leading-5  placeholder:text-[#133D74] " 
            placeholder="Ingresa tu correo email" 
          />
</div>
<button onClick={() => setActiveStep(1)} className='w-full mt-28 border border-[#133D74] text-[#133D74]  py-3 rounded-lg font-sans font-medium text-base'>
    Enviar código
</button>
<div className='w-full flex justify-center items-center mt-56 '>
<Link href="/login">
<p className=' text-sm text-[#133D74]'>¿Recuerdas la contraseña? <span className='opacity-30 font-semibold italic'>
    
    Ingresar
    </span>
    </p>
</Link>
</div>
</div>
  )
}
