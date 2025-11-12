"use client";
import { useState, useEffect } from "react";

export default function ScanButton({ onClick, disabled }) {
  const [showWarning, setShowWarning] = useState(false);
  const [isSecureContext, setIsSecureContext] = useState(true);

  useEffect(() => {
    // Verificar si está en contexto seguro (HTTPS o localhost)
    const isSecure =
      window.isSecureContext || window.location.hostname === "localhost";
    setIsSecureContext(isSecure);
  }, []);

  const handleClick = () => {
    if (!isSecureContext) {
      setShowWarning(true);
      return;
    }
    onClick();
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={disabled}
        className="w-full mb-6 p-4 bg-[#3E6FA7] text-white rounded-xl shadow-lg flex items-center justify-center gap-3 font-semibold text-lg transition hover:bg-[#2d5280] disabled:opacity-50"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        Escanear Factura
      </button>

      {showWarning && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-gray-800 mb-3 text-center">
              Conexión no segura
            </h3>
            <p className="text-gray-600 text-sm mb-4 text-center">
              Para usar la cámara, esta página debe cargarse mediante HTTPS.
              Contacta al administrador del sitio.
            </p>
            <button
              onClick={() => setShowWarning(false)}
              className="w-full p-3 bg-[#3E6FA7] text-white rounded-xl font-semibold"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
}
