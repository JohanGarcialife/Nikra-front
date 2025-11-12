import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function FourthStep(props) {
  const { setActiveStep } = props;
  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-180px)] items-center justify-center">
      <div className="flex-1 flex flex-col items-center justify-center space-y-8 max-w-md mx-auto w-full">
        <div className="flex w-full items-center justify-center">
          <Image width={120} height={180} src={`/Success.png`} alt="Logo" />
        </div>
        <p className="text-base text-center px-6 text-primary">
          ¡Contraseña cambiada! Tu contraseña ha sido cambiada exitosamente.
        </p>

        <Link href="/login" className="w-full">
          <button className="w-full border border-primary text-primary py-3 rounded-lg font-sans font-medium text-base">
            Regresar al inicio
          </button>
        </Link>
      </div>
    </div>
  );
}
