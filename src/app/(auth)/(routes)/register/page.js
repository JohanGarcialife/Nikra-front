'use client'
import Link from 'next/link'
import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Register() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [pdfLoadError, setPdfLoadError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const validationSchema = Yup.object({
    fullName: Yup.string().required('Required'),
    dni: Yup.string().required('Required'),
    phone: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email address').required('Required'),
    password: Yup.string().required('Required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Required'),
  });

  const handleRegister = async (values, { setSubmitting } = {}) => {
    setSubmitting?.(true);
    setLoading(true);
    setSubmitError(null);

    const apiBaseRaw = process.env.NEXT_PUBLIC_API_URL;
    if (!apiBaseRaw) {
      setSubmitError('La URL de la API no está definida. Revisa .env');
      setLoading(false);
      setSubmitting?.(false);
      return;
    }
    const apiBase = apiBaseRaw.replace(/\/$/, ''); // remove trailing slash


    const payload = {
      fullName: values.fullName,
      dni: values.dni,
      phone: values.phone,
      email: values.email,
      password: values.password,
    };

    const endpoints = ['/api/auth/register']; // prueba primer endpoint y usa fallback
    let lastError = null;

    for (const ep of endpoints) {
      try {
        const url = `${apiBase}${ep}`;
        const response = await axios.post(url, payload, {
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          timeout: 10000,
        });

        console.log('Register response:', response.data);
        router.push('/login');
        return;
      } catch (error) {
        lastError = error;
        console.warn(`Intento fallido a ${apiBase}${ep}:`, error?.response?.status || error?.message);

        // Si es un error 4xx, no tiene sentido intentar otro endpoint
        const status = error?.response?.status;
        if (status && status >= 400 && status < 500) {
          break;
        }
        // si 5xx o error de red, continuará al siguiente endpoint (fallback)
      }
    }

    console.error('Register error final:', lastError);
    setSubmitError(
      lastError?.response?.data?.message ||
      lastError?.message ||
      'Error al registrar. Verifica que la API esté disponible.'
    );
    setLoading(false);
    setSubmitting?.(false);
  };

  return (
    <div className='w-full max-w-full min-h-screen flex flex-col items-center justify-start box-border  m-0 p-0'>
      <h1 className="text-center self-center font-sans font-bold text-xl text-[#133D74] mt-3">
        Hola, Regístrate para comenzar
      </h1>

      <Formik
        initialValues={{ fullName: '', dni: '', phone: '', email: '', password: ''}}
        validationSchema={validationSchema}
        onSubmit={handleRegister}
      >
        <Form>
          <label className="text-[#133D74] my-0 mx-0 mb-2 font-sans font-medium text-base block px-2 mt-3">
            Nombre completo
          </label>
          <Field 
            id="fullName"
            name="fullName"
            type="text" 
            className="rounded-2xl bg-[#d3d3d3] text-[rgba(54,69,79)] w-full py-2 px-4 font-sans text-base border-none outline-none leading-5 box-border placeholder:text-[rgba(54,69,79,0.5)] [&:-internal-autofill-selected]:!bg-[#d3d3d3]" 
            placeholder="Paquita Martin" 
          />
          <ErrorMessage name="fullName" component="div" className="text-red-500" />

          <label className="text-[#133D74] my-0 mx-0 mb-2 font-sans font-medium text-base block px-2 mt-3">
            Documento nacional de identidad
          </label>
          <Field 
            id="dni"
            name="dni"
            type="text" 
            className="rounded-2xl bg-[#d3d3d3] text-[rgba(54,69,79)] w-full py-2 px-4 font-sans text-base border-none outline-none leading-5 box-border placeholder:text-[rgba(54,69,79,0.5)] [&:-internal-autofill-selected]:!bg-[#d3d3d3]" 
            placeholder="00000000Y" 
          />
          <ErrorMessage name="dni" component="div" className="text-red-500" />

          <label className="text-[#133D74] my-0 mx-0 mb-2 font-sans font-medium text-base block px-2 mt-3">
            Teléfono
          </label>
          <Field 
            id="phone"
            name="phone"
            type="text" 
            className="rounded-2xl bg-[#d3d3d3] text-[rgba(54,69,79)] w-full py-2 px-4 font-sans text-base border-none outline-none leading-5 box-border placeholder:text-[rgba(54,69,79,0.5)] [&:-internal-autofill-selected]:!bg-[#d3d3d3]" 
            placeholder="345256789" 
          />
          <ErrorMessage name="phone" component="div" className="text-red-500" />

          <label className="text-[#133D74] my-0 mx-0 mb-2 font-sans font-medium text-base block px-2 mt-3">
            Correo electrónico
          </label>
          <Field 
            id="email" 
            name="email"
            type="email" 
            className="rounded-2xl bg-[#d3d3d3] text-[rgba(54,69,79)] w-full py-2 px-4 font-sans text-base border-none outline-none leading-5 box-border placeholder:text-[rgba(54,69,79,0.5)] [&:-internal-autofill-selected]:!bg-[#d3d3d3]" 
            placeholder="ejemplo@gmail.com" 
          />
          <ErrorMessage name="email" component="div" className="text-red-500" />

          <label className="text-[#133D74] my-0 mx-0 mb-2 font-sans font-medium text-base block px-2 mt-3">
            Contraseña
          </label>
          <Field 
            id="password"
            name="password"
            type="password" 
            className="rounded-2xl bg-[#d3d3d3] text-[rgba(54,69,79)] w-full py-2 px-4 font-sans text-base border-none outline-none leading-5 box-border placeholder:text-[rgba(54,69,79,0.5)] [&:-internal-autofill-selected]:!bg-[#d3d3d3]" 
            placeholder="Contraseña" 
          />
          <ErrorMessage name="password" component="div" className="text-red-500" />

          <label className="text-[#133D74] my-0 mx-0 mb-2 font-sans font-medium text-base block px-2 mt-3">
            Repetir contraseña
          </label>
          <Field 
            id="confirmPassword"
            name="confirmPassword"
            type="password" 
            className="rounded-2xl bg-[#d3d3d3] text-[rgba(54,69,79)] w-full py-2 px-4 font-sans text-base border-none outline-none leading-5 box-border placeholder:text-[rgba(54,69,79,0.5)] [&:-internal-autofill-selected]:!bg-[#d3d3d3]" 
            placeholder="Contraseña" 
          />
          <ErrorMessage name="confirmPassword" component="div" className="text-red-500" />

          <div className="font-sans font-medium text-[12px] mr-[30px] mt-3 flex gap-[10px] justify-between items-center">
            <div>
              <div className="pt-2.5 font-light text-[#133D74]">
                He leído y acepto las:
              </div>
              <span 
                  onClick={() => setShowModal(true)}
                  className="font-sans font-bold text-[12px] text-[#133D74] underline cursor-pointer"
                >
                  Politicas de uso de la aplicación
                </span>
            </div>
            <div onClick={() => setShowModal(true)} className="font-sans font-light text-[12px] bg-[#3E6FA7] text-white rounded-full py-1 px-[25px]  text-center cursor-pointer">
              <p className="p-0 m-0">Acepto</p> 
            </div>
          </div>
         
            <button 
              type="submit"
              disabled={loading}
              className="mt-5 mb-2 w-full h-full font-sans p-5 font-medium text-lg bg-[#3E6FA7] border-none rounded-2xl cursor-pointer transition duration-300 relative disabled:opacity-60" 
            >
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-base font-bold text-white pointer-events-none ">
                {loading ? 'Registrando...' : 'Registrate'}
              </span>
            </button>

            {submitError && (
              <div className="text-red-500 text-center mt-2">
                {submitError}
              </div>
            )}
         
        </Form>
      </Formik>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-4 max-w-3xl w-full max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between mb-2">
              <div>
                <button onClick={() => setShowModal(false)} className="text-white px-3 py-1 rounded-md bg-red-400">
                  Cerrar
                </button>
              </div>
              <div className="flex gap-2">
                <a
                  href="/terminos_y_condiciones.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 underline"
                >
                  Abrir en nueva pestaña
                </a>
              </div>
            </div>

            <div className="w-full h-[70vh] sm:h-[80vh] md:h-[85vh]">
              {!pdfLoadError ? (
                <iframe
                  src="/terminos_y_condiciones.pdf"
                  title="Terminos y Condiciones"
                  className="w-full h-full border-none"
                  onLoad={() => setPdfLoadError(false)}
                  onError={() => setPdfLoadError(true)}
                />
              ) : (
                <div className="p-4 text-center">
                  <p className="mb-2">No fue posible cargar el PDF en este visor.</p>
                  <a href="/terminos_y_condiciones.pdf" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Descargar / Abrir PDF</a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center items-center m-0 gap-0.5 text-[#133D74] text-sm font-sans font-medium text-center">
        <Link href="/login">
          <span 
            className="font-semibold cursor-pointer underline whitespace-nowrap" 
          >
            Ya tienes cuenta? Inicia sesión ahora
          </span>
        </Link>
      </div>
    </div>
  )
}