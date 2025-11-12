"use client";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useState, useEffect, useRef } from "react";
import FormField from "./FormField";
import { useRouter } from "next/navigation";
import Image from "next/image";
import apiClient from "@/lib/axios";
import { toast } from "sonner";
import ScanButton from "./_components/ScanButton";
import CameraCapture from "./_components/CameraCapture";
import OCRFallback from "./_components/OCRFallback";
import CameraHelp from "./_components/CameraHelp";
import { useOCRProcessor } from "./_hooks/useOCRProcessor";
import { parseInvoiceData } from "./_utils/parseInvoiceData";

export default function RegisterQR() {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [comercios, setComercios] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Estados para OCR
  const [showCamera, setShowCamera] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [ocrError, setOcrError] = useState("");
  const formikRef = useRef(null);
  const { processImage, isProcessing, progress } = useOCRProcessor();

  // Obtener lista de comercios del API
  useEffect(() => {
    const fetchComercios = async () => {
      try {
        const response = await apiClient.get("/api/associates", {
          params: {
            limit: 1000,
            activo: true,
          },
        });

        // Transformar los datos para el select
        const comerciosData = response.data.associates.map((associate) => ({
          id: associate.id,
          name: associate.nombre,
        }));

        setComercios(comerciosData);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener comercios:", error);
        setLoading(false);
      }
    };

    fetchComercios();
  }, []);

  const validationSchema = Yup.object({
    comercio: Yup.string().required("Selecciona un comercio"),
    ticketNumber: Yup.string().required("El número de ticket es requerido"),
    ticketDate: Yup.date()
      .required("La fecha del ticket es requerida")
      .max(new Date(), "La fecha no puede ser futura"),
    totalAmount: Yup.number()
      .required("El importe total es requerido")
      .positive("El importe debe ser positivo")
      .min(0.01, "El importe debe ser mayor a 0"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Limpiar mensajes previos
      setSuccessMessage("");
      setErrorMessage("");

      // Mapear los campos del formulario a los nombres que espera el backend
      const participationData = {
        associateId: values.comercio,
        numeroTicket: values.ticketNumber,
        fechaTicket: values.ticketDate,
        importeTotal: parseFloat(values.totalAmount),
      };

      // Enviar al backend
      await apiClient.post("/api/participations", participationData);

      // Mensaje de éxito
      const msg = "¡Participación registrada exitosamente!";
      setSuccessMessage(msg);

      // Mostrar toast de sonner con el successMessage
      toast.success(msg);

      // Resetear formulario después de 5 segundos
      setTimeout(() => {
        resetForm();
        setSuccessMessage("");
      }, 5000);
    } catch (error) {
      console.error("Error al registrar participación:", error);

      // Mostrar mensaje de error
      const errorMsg =
        error.response?.data?.message ||
        "Error al registrar la participación. Intenta nuevamente.";
      setErrorMessage(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  // Funciones para OCR
  const handleScanClick = () => {
    setShowCamera(true);
    setOcrError("");
  };

  const handleCameraCapture = async (imageDataUrl) => {
    setShowCamera(false);

    try {
      toast.info("Procesando imagen...");
      const text = await processImage(imageDataUrl);

      // Log para debug
      console.log("=== TEXTO EXTRAÍDO POR OCR ===");
      console.log(text);
      console.log("=== FIN DEL TEXTO ===");

      if (!text || text.trim().length < 10) {
        throw new Error("No se detectó suficiente texto en la imagen");
      }

      const parsedData = parseInvoiceData(text, comercios);

      // Log de datos parseados
      console.log("=== DATOS PARSEADOS ===");
      console.log("Comercio ID:", parsedData.comercioId);
      console.log("Número Ticket:", parsedData.ticketNumber);
      console.log("Fecha:", parsedData.ticketDate);
      console.log("Total:", parsedData.totalAmount);
      console.log("=== FIN DATOS ===");

      // Verificar que al menos se extrajo algún dato
      if (!parsedData.ticketNumber && !parsedData.totalAmount) {
        throw new Error("No se pudieron extraer los datos de la factura");
      }

      // Auto-rellenar formulario usando Formik
      if (formikRef.current) {
        const { setFieldValue } = formikRef.current;
        if (parsedData.comercioId)
          setFieldValue("comercio", parsedData.comercioId);
        if (parsedData.ticketNumber)
          setFieldValue("ticketNumber", parsedData.ticketNumber);
        if (parsedData.ticketDate)
          setFieldValue("ticketDate", parsedData.ticketDate);
        if (parsedData.totalAmount)
          setFieldValue("totalAmount", parsedData.totalAmount);

        toast.success("¡Datos escaneados! Verifica la información");
      }
    } catch (error) {
      console.error("Error en OCR:", error);
      setOcrError(error.message);
      setShowFallback(true);
    }
  };

  const handleRescan = () => {
    setShowFallback(false);
    setShowCamera(true);
  };

  const handleManualFill = () => {
    setShowFallback(false);
  };

  return (
    <div className="fixed inset-0 z-20 w-full h-full overflow-y-auto">
      <div className="font-sans items-center justify-items-center min-h-full p-8 sm:py-20  sm:pb-20 relative">
        <div className="flex flex-row w-full justify-between items-center  gap-1 mb-10">
          <div
            onClick={() => router.back()}
            className=" bg-primary p-3 shadow rounded text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="icon icon-tabler icons-tabler-outline icon-tabler-chevron-compact-left"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M13 20l-3 -8l3 -8" />
            </svg>
          </div>
          <Image
            width={120}
            height={180}
            src={`/CCA-800X600-(2).png`}
            alt="Logo"
          />
          <div />
        </div>

        {/* Formulario */}
        <div className="w-full max-w-full rounded-lg border-t-4 border-b-4 border-t-primary border-b-primary bg-white/70 drop-shadow-lg p-6 mt-4">
          {/* Ícono de comercios */}
          <div className="flex justify-center mb-6">
            <img
              src={"Vector(3).svg"}
              alt="Ícono de comercios"
              className="w-15 h-15"
            />
          </div>

          {/* Botón de escaneo OCR */}
          {!loading && (
            <div className="relative">
              <ScanButton onClick={handleScanClick} disabled={isProcessing} />
              <button
                onClick={() => setShowHelp(true)}
                className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition"
                title="Ayuda con permisos de cámara"
              >
                <svg
                  className="w-5 h-5 text-[#3E6FA7]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            </div>
          )}

          {/* Indicador de procesamiento */}
          {isProcessing && (
            <div className="mb-4 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg text-center">
              <div className="flex items-center justify-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-700"></div>
                <span>Procesando imagen... {progress}%</span>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-center">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
              {errorMessage}
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Cargando comercios...</p>
            </div>
          ) : (
            <Formik
              innerRef={formikRef}
              initialValues={{
                comercio: "",
                ticketNumber: "",
                ticketDate: "",
                totalAmount: "",
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="w-full ">
                  <FormField
                    label="Listado de Comercios:"
                    name="comercio"
                    as="select"
                    placeholder="Selecciona un comercio"
                    options={comercios}
                  />

                  <FormField
                    label="Nº de ticket de compra:"
                    name="ticketNumber"
                    type="text"
                    placeholder="Introduzca el número del ticket a registrar"
                  />

                  <FormField
                    label="Fecha del ticket de compra:"
                    name="ticketDate"
                    type="date"
                  />
                  <div className="flex items-center w-[60%] m-auto">
                    <FormField
                      label="Importe total:"
                      name="totalAmount"
                      type="text"
                      placeholder="0.00"
                      isAmount={true}
                    />
                  </div>
                  {/* Botón de envío */}
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="mt-5 mb-2 w-full h-full font-sans p-5 font-medium text-lg bg-[#3E6FA7]  border-none rounded-2xl cursor-pointer transition duration-300 relative disabled:opacity-60"
                    >
                      <span className=" top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-base font-bold text-white pointer-events-none">
                        {isSubmitting
                          ? "Registrando..."
                          : "Registrar Participación"}
                      </span>
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          )}
        </div>
      </div>

      {/* Modales OCR */}
      <CameraCapture
        isOpen={showCamera}
        onCapture={handleCameraCapture}
        onClose={() => setShowCamera(false)}
      />

      <OCRFallback
        isOpen={showFallback}
        onRescan={handleRescan}
        onManual={handleManualFill}
        error={ocrError}
      />

      <CameraHelp isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
}
