import Link from 'next/link';
import React, { useState } from 'react';
import { InputOtp } from "@heroui/input-otp";

export default function SecondStep(props) {
  const {setActiveStep} = props;
  const [otp, setOtp] = useState(''); // Start with empty string for user to type

  // Determine if the button should be disabled
  const isButtonDisabled = otp.length !== 4;

  return (
    <div>
      <div className='flex justify-start items-center gap-2 text-[#133D74]'>
        <svg onClick={() => setActiveStep(0)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-chevron-compact-left"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M13 20l-3 -8l3 -8" /></svg>
      </div>

      <p className='text-base my-24 text-center px-10 text-[#133D74]'>
        Ingrese el código de verificación que acabamos de enviar a su dirección de correo electrónico.
      </p>

      <div className='w-full mt-16 flex justify-center'>
       <InputOtp
        classNames={{
          segmentWrapper: "gap-x-4  w-full flex flex-row justify-center",
          segment: [
            "relative",
            "h-14",
            "w-14",
            "border",
            "border-[#133D74]", // Fixed typo here
            "text-center",
            "text-[#133D74]",
            "font-sans",
            "text-lg",
            "leading-5",
            "placeholder:text-[#133D74]",
            "rounded-lg",
            "border-default-200",
            "data-[active=true]:border",
            "data-[active=true]:z-20",
            "data-[active=true]:ring-2",
            "data-[active=true]:ring-offset-2",
            "data-[active=true]:ring-offset-background",
            "data-[active=true]:ring-foreground",
          ],
        }}
        // description="Enter the 4 digit code sent to your email"
         length={4}
         value={otp}
         onValueChange={(value) => {
            console.log("OTP Changed:", value);
            setOtp(value);
          }}
         radius="none"
         isDisabled={false}
         isReadOnly={false}
      />
      </div>

      <button
      onClick={() => setActiveStep(2)}
        className={otp.length !== 4 ? 'w-full mt-28 border border-gray-300 text-gray-300 py-3 rounded-lg font-sans font-medium text-base' : 'w-full mt-28 border border-[#133D74] text-[#133D74] py-3 rounded-lg font-sans font-medium text-base'}
        disabled={isButtonDisabled}
      >
        Verificar código
      </button>

      <div className='w-full flex justify-center items-center mt-40 '>
        <Link href="/login">
          <p className=' text-sm text-[#133D74]'>¿Recuerdas la contraseña? <span className='opacity-30 font-semibold italic'>
            Ingresar
          </span>
          </p>
        </Link>
      </div>
    </div>
  );
}