"use client";
import Link from "next/link";
import React from "react";
import axios from "axios";
import { InputOtp } from "@heroui/input-otp";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function SecondStep(props) {
  const { setActiveStep, setCode } = props;

  const validationSchema = Yup.object({
    otp: Yup.string()
      .required("Requerido")
      .matches(/^\d{4}$/, "El código debe tener 4 dígitos"),
  });

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    setSubmitting(true);
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/validate-reset-code/${values.otp}`;
      console.log(url);

      const res = await axios.get(url);
      console.log(res);
      if (res.status === 200) {
        // código válido
        setCode(values.otp);
        setActiveStep(2);
      } else {
        setFieldError("otp", "Código inválido");
      }
    } catch (error) {
      // manejar error (ej. 4xx/5xx o fallo de red)
      setFieldError("otp", "Código inválido");
      console.error("validate-reset-code error:", error);
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
        initialValues={{ otp: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, isSubmitting, isValid }) => (
          <Form className="flex flex-col h-full flex-1">
            <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
              <p className="text-base mb-8 text-rigth text-primary">
                Hemos enviado un código de verificación de 4 dígitos a la
                dirección de correo electrónico asociada a tu cuenta. Si el
                correo está registrado, lo recibirás en breve.
              </p>

              <div className="w-full flex justify-center">
                <InputOtp
                  classNames={{
                    segmentWrapper:
                      "gap-x-4  w-full flex flex-row justify-center",
                    segment: [
                      "relative",
                      "h-14",
                      "w-14",
                      "border",
                      "border-[#133D74]",
                      "text-center",
                      "text-[#133D74]",
                      "font-sans",
                      "text-lg",
                      "leading-5",
                      "placeholder:text-[#133D74]",
                      "rounded-lg",
                      "border-default-200",
                      "data-[active=true]:border",
                      "data-[active=true]:z-20",
                      "data-[active=true]:ring-2",
                      "data-[active=true]:ring-offset-2",
                      "data-[active=true]:ring-offset-background",
                      "data-[active=true]:ring-foreground",
                    ],
                  }}
                  length={4}
                  value={values.otp}
                  onValueChange={(value) => setFieldValue("otp", value)}
                  radius="none"
                  isDisabled={isSubmitting}
                  isReadOnly={false}
                />
              </div>

              <div className="text-red-500 mt-2 text-center min-h-[24px]">
                <ErrorMessage name="otp" />
              </div>

              <button
                type="submit"
                className={
                  isValid
                    ? "w-full mt-6 border border-primary text-primary py-3 rounded-lg font-sans font-medium text-base"
                    : "w-full mt-6 border border-gray-300 text-gray-300 py-3 rounded-lg font-sans font-medium text-base"
                }
                disabled={isSubmitting || !isValid}
              >
                Verificar código
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

//   Ingrese el código de verificación que acabamos de enviar a su
//dirección de correo electrónico.
