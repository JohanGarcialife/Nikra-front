"use client";

export default function OCRFallback({ isOpen, onRescan, onManual, error }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            No se pudo escanear
          </h3>
          <p className="text-gray-600 text-sm">
            {error || "La imagen está borrosa o no se detectaron datos"}
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={onRescan}
            className="w-full p-3 bg-[#3E6FA7] text-white rounded-xl font-semibold hover:bg-[#2d5280]"
          >
            Reescanear
          </button>
          <button
            onClick={onManual}
            className="w-full p-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300"
          >
            Llenar Manualmente
          </button>
        </div>
      </div>
    </div>
  );
}
