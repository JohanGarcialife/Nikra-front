"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import useAuthStore from "@/store/auth";
import apiClient from "@/lib/axios";

export default function Login() {
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string().required("Required"),
  });

  const handleLogin = async (values, { setSubmitting } = {}) => {
    setSubmitting?.(true);
    setLoading(true);
    setSubmitError("");

    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`;
      const response = await apiClient.post(
        url,
        { email: values.email, password: values.password },
        { headers: { "Content-Type": "application/json" } }
      );

      // Asumimos que el backend devuelve { token, user } o similar
      const token =
        response?.data?.token || response?.data?.accessToken || null;
      const user = response?.data?.user || { email: values.email };

      if (token) {
        document.cookie = `token=${encodeURIComponent(token)}; path=/`;
      } else {
        // fallback mínimo si no hay token
        document.cookie = `token=${encodeURIComponent(values.email)}; path=/`;
      }

      login(user);
      router.push("/");
    } catch (error) {
      console.error("Login error:", error);
      setSubmitError(
        error?.response?.data?.message ||
          error?.message ||
          "Error al iniciar sesión. Intenta de nuevo."
      );
    } finally {
      setLoading(false);
      setSubmitting?.(false);
    }
  };

  return (
    <div className="w-full max-w-full flex flex-col items-center justify-between h-screen overflow-hidden box-border m-0 p-0 py-4">
      <div className="flex-shrink-0">
        <Image
          src={`/CCA-APP.png`}
          width={140}
          height={63}
          alt="Error cargando"
          className="w-auto h-auto"
        />
      </div>

      <h1 className="text-center self-center font-sans font-bold text-xl sm:text-2xl text-primary mt-4 flex-shrink-0">
        Iniciar Sesión
      </h1>

      {submitError && (
        <p className="text-red-500 text-sm flex-shrink-0">{submitError}</p>
      )}

      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleLogin}
      >
        <Form className="w-full flex-shrink-0">
          <label className="text-primary my-0 mx-0 mb-1 font-sans font-medium text-base sm:text-lg block px-2 mt-3">
            Correo electrónico
          </label>
          <Field
            id="email"
            name="email"
            type="email"
            className="rounded-2xl bg-[#d3d3d3] text-[rgba(54,69,79)] w-full py-2.5 px-4 font-sans text-sm sm:text-base border-none outline-none leading-5 box-border placeholder:text-[rgba(54,69,79,0.5)] [&:-internal-autofill-selected]:!bg-[#d3d3d3]"
            placeholder="ejemplo@gmail.com"
          />
          <ErrorMessage
            name="email"
            component="div"
            className="text-red-500 text-xs mt-1"
          />

          <label className="text-primary my-0 mx-0 mb-1 font-sans font-medium text-base sm:text-lg block px-2 mt-3">
            Contraseña
          </label>
          <div className="relative">
            <Field
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              className="rounded-2xl bg-[#d3d3d3] text-[rgba(54,69,79)] w-full py-2.5 px-4 pr-12 font-sans text-sm sm:text-base border-none outline-none leading-5 box-border placeholder:text-[rgba(54,69,79,0.5)] [&:-internal-autofill-selected]:!bg-[#d3d3d3]"
              placeholder="Contraseña"
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
                  width="18"
                  height="18"
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
                  width="18"
                  height="18"
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
          <ErrorMessage
            name="password"
            component="div"
            className="text-red-500 text-xs mt-1"
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-4 mb-2 w-full font-sans py-3 font-medium text-base sm:text-lg bg-[#3E6FA7] border-none rounded-2xl cursor-pointer transition duration-300 relative disabled:opacity-60"
          >
            <span className="text-base font-bold text-white">
              {loading ? "Ingresando..." : "Accede"}
            </span>
          </button>
        </Form>
      </Formik>

      <div className="flex justify-center items-center m-0 gap-0.5 text-primary text-xs sm:text-sm font-sans font-medium text-center flex-shrink-0 mt-2">
        <Link href="/forgotPassword">
          <span className="font-semibold cursor-pointer underline whitespace-nowrap">
            Olvidaste tu contraseña?
          </span>
        </Link>
      </div>

      <div className="pt-3 border-t border-[#D9D9D9] mt-4 max-w-[300px] flex-shrink-0">
        <div className="flex justify-center items-center m-0 gap-0.5 text-primary text-xs sm:text-sm font-sans font-medium text-center">
          No tienes cuenta
          <Link
            href="/register"
            className="font-semibold cursor-pointer underline whitespace-nowrap"
          >
            <span tabIndex={0}> Regístrate</span>
          </Link>
        </div>
        <Image
          className="mt-3 w-full h-auto block mx-auto max-h-[120px] sm:max-h-[160px] object-contain"
          src={`/logos_inferior_Login.png`}
          alt="Logo Junta de la Consejería de Empleo"
          width={250}
          height={220}
        />
      </div>
    </div>
  );
}
