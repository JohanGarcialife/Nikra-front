"use client";
import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function ThirdStep(props) {
  const { setActiveStep, code } = props;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  console.log(code);

  const validationSchema = Yup.object({
    password: Yup.string().required("Requerido").min(6, "Mínimo 6 caracteres"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Las contraseñas deben coincidir")
      .required("Requerido"),
  });

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    setSubmitting(true);
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password`;
      const res = await axios.post(url, {
        password: values.password,
        code: code,
      });
      if (res.status === 200 || res.status === 201) {
        setActiveStep(3);
      } else {
        setFieldError("password", "No se pudo cambiar la contraseña");
      }
    } catch (error) {
      const msg =
        error?.response?.data?.message || "Error al cambiar la contraseña";
      setFieldError("password", msg);
      console.error("reset-password error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-180px)]">
      <div className="flex justify-start items-center gap-2 text-primary cursor-pointer py-2 relative z-10">
        <svg
          onClick={() => setActiveStep(0)}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-compact-left"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M13 20l-3 -8l3 -8" />
        </svg>
      </div>

      <Formik
        initialValues={{ password: "", confirmPassword: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, isValid, dirty }) => (
          <Form className="flex flex-col h-full flex-1">
            <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
              <p className="text-base mb-6 text-center text-primary">
                Crear nueva contraseña. Su nueva contraseña debe ser única de
                las utilizadas anteriormente.
              </p>

              <div className="w-full border border-primary rounded-lg relative">
                <Field
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className=" text-primary w-full py-3 px-4 pr-12 font-sans text-base leading-5 placeholder:text-primary"
                  placeholder="Nueva contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-primary hover:text-[#3E6FA7] transition-colors duration-200"
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
              <div className="text-red-500 mt-2 min-h-[24px]">
                <ErrorMessage name="password" />
              </div>

              <div className="w-full mt-4 border border-primary rounded-lg relative">
                <Field
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  className=" text-primary w-full py-3 px-4 pr-12 font-sans text-base leading-5 placeholder:text-primary"
                  placeholder="Confirmar nueva contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-primary hover:text-[#3E6FA7] transition-colors duration-200"
                  aria-label={
                    showConfirmPassword
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"
                  }
                >
                  {showConfirmPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
              <div className="text-red-500 mt-2 min-h-[24px]">
                <ErrorMessage name="confirmPassword" />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !(isValid && dirty)}
                className="w-full mt-6 border border-primary text-primary py-3 rounded-lg font-sans font-medium text-base disabled:opacity-50"
              >
                Cambiar contraseña
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
