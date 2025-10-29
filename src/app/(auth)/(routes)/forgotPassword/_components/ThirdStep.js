'use client'
import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

export default function ThirdStep(props) {
    const {setActiveStep} = props

    const validationSchema = Yup.object({
      password: Yup.string().required('Requerido').min(6, 'Mínimo 6 caracteres'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Las contraseñas deben coincidir')
        .required('Requerido'),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
      setSubmitting(true);
      // enviar nueva contraseña al backend si procede
      setActiveStep(3);
      setSubmitting(false);
    };

  return (
    <div>
      <div className='flex justify-start items-center gap-2 text-[#133D74]'>
        <svg onClick={() => setActiveStep(0)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-compact-left"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M13 20l-3 -8l3 -8" /></svg>
      </div>

      <p className='text-base my-24 text-center px-24 text-[#133D74]'>
        Crear nueva contraseña. Su nueva contraseña debe ser única de las utilizadas anteriormente.
      </p>

      <Formik
        initialValues={{ password: '', confirmPassword: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, isValid, dirty }) => (
          <Form>
            <div className='w-full mt-16 border border-[#133D74] rounded-lg '>
              <Field 
                id="password" 
                name="password"
                type="password" 
                className=" text-[#133D74] w-full py-3 px-4 font-sans text-base leading-5 placeholder:text-[#133D74]" 
                placeholder="Nueva contraseña" 
              />
            </div>
            <div className="text-red-500 mt-2">
              <ErrorMessage name="password" />
            </div>

            <div className='w-full mt-16 border border-[#133D74] rounded-lg '>
              <Field 
                id="confirmPassword" 
                name="confirmPassword"
                type="password" 
                className=" text-[#133D74] w-full py-3 px-4 font-sans text-base leading-5 placeholder:text-[#133D74]" 
                placeholder="Confirmar nueva contraseña" 
              />
            </div>
            <div className="text-red-500 mt-2">
              <ErrorMessage name="confirmPassword" />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !(isValid && dirty)}
              className='w-full mt-28 border border-[#133D74] text-[#133D74] py-3 rounded-lg font-sans font-medium text-base disabled:opacity-50'
            >
              Cambiar contraseña
            </button>
          </Form>
        )}
      </Formik>
    </div>
  )
}
