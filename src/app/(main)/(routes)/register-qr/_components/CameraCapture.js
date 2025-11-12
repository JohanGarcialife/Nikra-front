"use client";
import { useRef, useState, useEffect } from "react";

export default function CameraCapture({ isOpen, onCapture, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const startCamera = async () => {
    setIsLoading(true);
    setCameraError(null);

    try {
      // Verificar si el navegador soporta getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Tu navegador no soporta acceso a la cámara");
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
      setStream(mediaStream);
      setIsLoading(false);
    } catch (err) {
      console.error("Error al acceder a la cámara:", err);
      setIsLoading(false);

      let errorMsg = "No se pudo acceder a la cámara";
      if (
        err.name === "NotAllowedError" ||
        err.name === "PermissionDeniedError"
      ) {
        errorMsg = "Debes permitir el acceso a la cámara en tu navegador";
      } else if (err.name === "NotFoundError") {
        errorMsg = "No se encontró ninguna cámara en tu dispositivo";
      } else if (err.name === "NotReadableError") {
        errorMsg = "La cámara está siendo usada por otra aplicación";
      }
      setCameraError(errorMsg);
    }
  };

  useEffect(() => {
    if (isOpen && !stream && !capturedImage) {
      startCamera();
    }

    // Limpiar cuando se cierra
    return () => {
      if (stream && !isOpen) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen]);

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0);
      const imageDataUrl = canvas.toDataURL("image/jpeg", 0.9);
      setCapturedImage(imageDataUrl);
    }
  };

  const handleConfirm = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    onCapture(capturedImage);
    // Resetear estados
    setCapturedImage(null);
    setStream(null);
    setCameraError(null);
    setIsLoading(false);
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const handleClose = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    // Resetear todos los estados
    setCapturedImage(null);
    setCameraError(null);
    setStream(null);
    setIsLoading(false);
    onClose();
  };

  const handleRetry = () => {
    setCameraError(null);
    setStream(null);
    startCamera();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <div className="relative w-full h-full">
        {/* Info de debug temporal */}
        <div className="absolute top-4 left-4 bg-white/20 text-white text-xs p-2 rounded z-50">
          <p>isLoading: {isLoading ? "Si" : "No"}</p>
          <p>hasStream: {stream ? "Si" : "No"}</p>
          <p>hasError: {cameraError ? "Si" : "No"}</p>
          <p>hasCaptured: {capturedImage ? "Si" : "No"}</p>
        </div>

        {/* Pantalla de carga */}
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black text-white">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mb-4"></div>
            <p className="text-lg">Activando cámara...</p>
          </div>
        )}

        {/* Pantalla de error */}
        {cameraError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black text-white p-8">
            <div className="bg-red-600 rounded-full p-4 mb-6">
              <svg
                className="w-12 h-12"
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
            <h3 className="text-xl font-bold mb-3 text-center">
              Error de Cámara
            </h3>
            <p className="text-center mb-6 text-gray-300">{cameraError}</p>
            <div className="text-sm text-gray-400 mb-6 text-center max-w-sm">
              <p className="mb-2">Para Chrome en Android:</p>
              <p>1. Toca el ícono del candado en la barra de direcciones</p>
              <p>2. Ve a "Permisos"</p>
              <p>3. Activa "Cámara"</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleClose}
                className="px-6 py-3 bg-gray-600 text-white rounded-full font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handleRetry}
                className="px-6 py-3 bg-blue-600 text-white rounded-full font-semibold"
              >
                Reintentar
              </button>
            </div>
          </div>
        )}

        {/* Vista de cámara activa - siempre renderizar video */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${
            capturedImage || cameraError || isLoading ? "hidden" : ""
          }`}
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* Controles de cámara */}
        {!capturedImage && !cameraError && !isLoading && stream && (
          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4">
            <button
              onClick={handleClose}
              className="px-6 py-3 bg-red-600 text-white rounded-full font-semibold shadow-lg"
            >
              Cancelar
            </button>
            <button
              onClick={capturePhoto}
              className="px-8 py-3 bg-white text-gray-900 rounded-full font-bold text-lg shadow-lg"
            >
              Capturar
            </button>
          </div>
        )}

        {/* Vista de imagen capturada */}
        {capturedImage && (
          <>
            <img
              src={capturedImage}
              alt="Captura"
              className="w-full h-full object-contain"
            />
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4">
              <button
                onClick={handleRetake}
                className="px-6 py-3 bg-gray-600 text-white rounded-full font-semibold shadow-lg"
              >
                Repetir
              </button>
              <button
                onClick={handleConfirm}
                className="px-8 py-3 bg-green-600 text-white rounded-full font-bold shadow-lg"
              >
                Confirmar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
