"use client";

export default function CameraHelp({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl my-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Ayuda: Permisos de Cámara
        </h2>

        <div className="space-y-6 text-sm text-gray-700">
          <div>
            <h3 className="font-bold text-lg mb-2 text-[#3E6FA7]">
              Chrome en Android:
            </h3>
            <ol className="list-decimal list-inside space-y-2 ml-2">
              <li>Toca el ícono del candado 🔒 en la barra de direcciones</li>
              <li>Selecciona "Permisos" o "Configuración del sitio"</li>
              <li>Encuentra "Cámara" y selecciona "Permitir"</li>
              <li>Recarga la página y vuelve a intentar</li>
            </ol>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2 text-[#3E6FA7]">
              Safari en iOS:
            </h3>
            <ol className="list-decimal list-inside space-y-2 ml-2">
              <li>Ve a Ajustes → Safari → Cámara</li>
              <li>Selecciona "Preguntar" o "Permitir"</li>
              <li>Vuelve al navegador y recarga la página</li>
            </ol>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 p-3 bg-[#3E6FA7] text-white rounded-xl font-semibold hover:bg-[#2d5280]"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
