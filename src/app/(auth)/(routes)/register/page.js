'use client'
import Link from 'next/link'
import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

export default function Register() {

  const validationSchema = Yup.object({
    name: Yup.string().required('Required'),
    dni: Yup.string().required('Required'),
    phone: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email address').required('Required'),
    password: Yup.string().required('Required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Required'),
  });

  const handleRegister = (values) => {
    console.log(values);
  };

  return (
    <div className='w-full max-w-full min-h-screen flex flex-col items-center justify-start box-border  m-0 p-0'>
      <h1 className="text-center self-center font-sans font-bold text-xl text-[#133D74] mt-3">
        Hola, Regístrate para comenzar
      </h1>

      <Formik
        initialValues={{ name: '', dni: '', phone: '', email: '', password: '', confirmPassword: '' }}
        validationSchema={validationSchema}
        onSubmit={handleRegister}
      >
        <Form>
          <label className="text-[#133D74] my-0 mx-0 mb-2 font-sans font-medium text-base block px-2 mt-3">
            Nombre completo
          </label>
          <Field 
            id="name"
            name="name"
            type="text" 
            className="rounded-2xl bg-[#d3d3d3] text-[rgba(54,69,79)] w-full py-2 px-4 font-sans text-base border-none outline-none leading-5 box-border placeholder:text-[rgba(54,69,79,0.5)] [&:-internal-autofill-selected]:!bg-[#d3d3d3]" 
            placeholder="Paquita Martin" 
          />
          <ErrorMessage name="name" component="div" className="text-red-500" />

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
            <div >
              <div className="pt-2.5 font-light text-[#133D74]">
                He leído y acepto las:
              </div>
              <Link href="/politicas">
                <span 
                  className="font-sans font-bold text-[12px] text-[#133D74] underline cursor-pointer"
                >
                  Politicas de uso de la aplicación
                </span>
              </Link>
            </div>
            <div className="font-sans font-light text-[12px] bg-[#3E6FA7] text-white rounded-full py-1 px-[25px]  text-center cursor-pointer">
              <p className="p-0 m-0">Acepto</p> 
            </div>
          </div>
          <Link href="/">
            <button 
              type="submit"
              className="mt-5 mb-2 w-full h-full font-sans p-5 font-medium text-lg bg-[#3E6FA7] border-none rounded-2xl cursor-pointer transition duration-300 relative" 
            >
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-base font-bold text-white pointer-events-none ">
                Registrate
              </span>
            </button>
          </Link>
        </Form>
      </Formik>

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