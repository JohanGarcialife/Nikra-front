"use client";
import Link from "next/link";
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

export default function FirstStep(props) {
  const { setActiveStep } = props;

  const validationSchema = Yup.object({
    email: Yup.string().email("Correo inválido").required("Requerido"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`;
      await axios.post(url, { email: values.email });
      // Si la petición es exitosa avanzamos al siguiente paso
      setActiveStep(1);
    } catch (error) {
      console.error("Forgot password error:", error);
      const msg = error?.response?.data?.message || "Error al enviar el correo";
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-180px)]">
      <Formik
        initialValues={{ email: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, isValid, dirty }) => (
          <Form className="flex flex-col h-full">
            <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
              <p className="text-base mb-4 text-primary">
                ¿Has olvidado tu contraseña?
              </p>
              <p className="text-base mb-8 text-primary">
                ¡No te preocupes! eso ocurre, Ingrese la dirección de correo
                electrónico vinculada con su cuenta.
              </p>

              <div className="w-full border border-primary rounded-lg">
                <Field
                  id="email"
                  name="email"
                  type="email"
                  className=" text-primary w-full py-3 px-4 font-sans text-base leading-5 placeholder:text-primary"
                  placeholder="Ingresa tu correo email"
                />
              </div>
              <div className="text-red-500 mt-2 min-h-[24px]">
                <ErrorMessage name="email" />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !(isValid && dirty)}
                className="w-full mt-6 border border-primary text-primary py-3 rounded-lg font-sans font-medium text-base disabled:opacity-50"
              >
                Enviar código
              </button>
            </div>

            <div className="w-full flex justify-center items-center py-22">
              <Link href="/login">
                <p className=" text-sm text-primary">
                  ¿Recuerdas la contraseña?{" "}
                  <span className="opacity-30 font-semibold italic">
                    Ingresar
                  </span>
                </p>
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
