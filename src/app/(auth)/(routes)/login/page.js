'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import useAuthStore from '@/store/auth';
import axios from 'axios';

export default function Login() {
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Required'),
    password: Yup.string().required('Required'),
  });

  const handleLogin = async (values, { setSubmitting } = {}) => {
    setSubmitting?.(true);
    setLoading(true);
    setSubmitError('');

    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`;
      const response = await axios.post(
        url,
        { email: values.email, password: values.password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      // Asumimos que el backend devuelve { token, user } o similar
      const token = response?.data?.token || response?.data?.accessToken || null;
      const user = response?.data?.user || { email: values.email };

      if (token) {
        document.cookie = `token=${encodeURIComponent(token)}; path=/`;
      } else {
        // fallback mínimo si no hay token
        document.cookie = `token=${encodeURIComponent(values.email)}; path=/`;
      }

      login(user);
      router.push('/');
    } catch (error) {
      console.error('Login error:', error);
      setSubmitError(
        error?.response?.data?.message ||
        error?.message ||
        'Error al iniciar sesión. Intenta de nuevo.'
      );
    } finally {
      setLoading(false);
      setSubmitting?.(false);
    }
  };

  return (
    <div className='w-full max-w-full flex flex-col items-center min-h-screen justify-start box-border  m-0 p-0'>
      <Image 
        src={`/Logo_Intro.svg`} 
        width={160}
        height={72}
        alt="Error cargando"
      /> 

      <h1 className="text-center self-center font-sans font-bold text-2xl text-[#133D74] mt-[45px]"> 
        Iniciar Sesión
      </h1>

      {submitError && <p className="text-red-500">{submitError}</p>}

      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleLogin}
      >
        <Form className="w-full">
          <label className="text-[#133D74] my-0 mx-0 mb-2 font-sans font-medium text-lg block px-2 mt-5"> 
            Correo electrónico
          </label>
          <Field 
            id="email" 
            name="email"
            type="email" 
            className="rounded-2xl bg-[#d3d3d3] text-[rgba(54,69,79)] w-full py-3 px-4 font-sans text-base border-none outline-none leading-5 box-border placeholder:text-[rgba(54,69,79,0.5)] [&:-internal-autofill-selected]:!bg-[#d3d3d3]" 
            placeholder="ejemplo@gmail.com" 
          />
          <ErrorMessage name="email" component="div" className="text-red-500" />

          <label className="text-[#133D74] my-0 mx-0 mb-2 font-sans font-medium text-lg block px-2 mt-5">
            Contraseña
          </label>
          <Field 
            id="password"
            name="password"
            type="password" 
            className="rounded-2xl bg-[#d3d3d3] text-[rgba(54,69,79)] w-full py-3 px-4 font-sans text-base border-none outline-none leading-5 box-border placeholder:text-[rgba(54,69,79,0.5)] [&:-internal-autofill-selected]:!bg-[#d3d3d3]" 
            placeholder="Contraseña" 
          />
          <ErrorMessage name="password" component="div" className="text-red-500" />

          <button 
            type="submit"
            disabled={loading}
            className="mt-5 mb-2 w-full h-full font-sans p-5 font-medium text-lg bg-[#3E6FA7]  border-none rounded-2xl cursor-pointer transition duration-300 relative disabled:opacity-60" 
          >
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-base font-bold text-white pointer-events-none">
              {loading ? 'Ingresando...' : 'Accede'}
            </span>
          </button>
        </Form>
      </Formik>

      <div className="flex justify-center items-center m-0 gap-0.5 text-[#133D74] text-sm font-sans font-medium text-center">
        <span className="font-semibold cursor-pointer underline whitespace-nowrap" onClick={() => {alert("hola")}}>
          Olvidaste tu contraseña?
        </span>
      </div>

      <div className="pt-[18px] border-t border-[#D9D9D9] mt-7 max-w-[300px]"> 
        <div className="flex justify-center items-center m-0 gap-0.5 text-[#133D74] text-sm font-sans font-medium text-center">
          No tienes cuenta 
          <Link href="/register" className="font-semibold cursor-pointer underline whitespace-nowrap">
            <span tabIndex={0}> Regístrate</span>
          </Link>
        </div>
        <Image 
          className="mt-5 max-w-[150px] w-full block mx-auto" 
          src="/Logos_inferior_Login.png" 
          alt="Logo Junta de la Consejería de Empleo" 
          width={250} 
          height={220} 
        />
      </div>
    </div>
  )
}
