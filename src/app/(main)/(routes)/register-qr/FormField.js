"use client";

import { Field, ErrorMessage, useField, useFormikContext } from "formik";
import { useState, useRef, useEffect } from "react";
import { MobileSelect } from "./MobileSelect";

export default function FormField({
  label,
  name,
  type = "text",
  placeholder = "",
  as = "input",
  options = [],
  step,
  isAmount = false,
}) {
  const [field, meta] = useField(name);
  const { setFieldValue } = useFormikContext();
  const [isOpen, setIsOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState("");
  const selectRef = useRef(null);

  const inputClasses =
    "rounded-lg shadow-lg bg-white/80 text-[rgba(54,69,79)] w-full py-3 px-4 font-sans text-base border-primary border outline-none leading-5 box-border mb-2";
  const selectClasses =
    "rounded-lg shadow-lg bg-white/80 text-[rgba(54,69,79)] w-full py-3 px-4 pr-10 font-sans text-base border-primary border outline-none leading-5 box-border mb-2 appearance-none cursor-pointer transition-all hover:shadow-xl active:scale-[0.99]";
  const placeholderClasses =
    type !== "date" ? "placeholder:text-[rgba(54,69,79,0.5)]" : "";
  const labelClasses =
    "text-[#133D74] my-0 mx-0 mb-2 font-sans font-medium text-base block mt-6 first:mt-0";

  // Función para formatear el valor con dos decimales desde centavos
  const formatAmountFromCents = (cents) => {
    const amount = (cents / 100).toFixed(2);
    return amount;
  };

  // Inicializar displayValue cuando el campo tiene valor inicial o cambia
  useEffect(() => {
    if (isAmount) {
      if (field.value) {
        // Convertir el valor existente a centavos
        const value = parseFloat(field.value) || 0;
        const cents = Math.round(value * 100);
        const formatted = formatAmountFromCents(cents);
        setDisplayValue(formatted);
      } else {
        setDisplayValue("0.00");
      }
    }
  }, [field.value, isAmount]);

  // Manejar cambios en el input con máscara estilo calculadora
  const handleAmountChange = (e) => {
    const key = e.nativeEvent.data;

    // Si es null (backspace/delete), manejar borrado
    if (key === null) {
      const currentValue = displayValue.replace(".", "");
      const newValue = currentValue.slice(0, -1) || "0";
      const cents = parseInt(newValue);
      const formatted = formatAmountFromCents(cents);
      setDisplayValue(formatted);
      setFieldValue(name, formatted);
      return;
    }

    // Solo permitir números
    if (!/^\d$/.test(key)) {
      e.preventDefault();
      return;
    }

    // Obtener los dígitos actuales (sin el punto)
    const currentDigits = displayValue.replace(".", "");

    // Agregar el nuevo dígito al final
    const newDigits = currentDigits + key;

    // Convertir a número (representando centavos)
    const cents = parseInt(newDigits);

    // Formatear con dos decimales (sin límite)
    const formatted = formatAmountFromCents(cents);
    setDisplayValue(formatted);
    setFieldValue(name, formatted);
  };

  // Manejar teclas especiales (backspace, delete, etc)
  const handleAmountKeyDown = (e) => {
    // Permitir: backspace, delete, tab, escape, enter
    if (
      [8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
      // Permitir: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (e.keyCode === 65 && e.ctrlKey === true) ||
      (e.keyCode === 67 && e.ctrlKey === true) ||
      (e.keyCode === 86 && e.ctrlKey === true) ||
      (e.keyCode === 88 && e.ctrlKey === true)
    ) {
      return;
    }

    // Permitir solo números
    if (
      (e.keyCode < 48 || e.keyCode > 57) &&
      (e.keyCode < 96 || e.keyCode > 105)
    ) {
      e.preventDefault();
    }
  };

  // Manejar el enfoque del campo
  const handleAmountFocus = (e) => {
    // Mover el cursor al final
    setTimeout(() => {
      e.target.setSelectionRange(e.target.value.length, e.target.value.length);
    }, 0);
  };

  // Formatear al salir del campo (blur)
  const handleAmountBlur = () => {
    // Ya está formateado, solo aseguramos que tenga el formato correcto
    if (displayValue) {
      const value = parseFloat(displayValue) || 0;
      const formatted = value.toFixed(2);
      setDisplayValue(formatted);
      setFieldValue(name, formatted);
    }
  };

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelectOption = (optionId) => {
    setFieldValue(name, optionId);
    setIsOpen(false);
  };

  const getSelectedOptionName = () => {
    if (!field.value) return placeholder || `Selecciona ${label.toLowerCase()}`;
    const selectedOption = options.find(
      (opt) => opt.id.toString() === field.value.toString()
    );
    return selectedOption
      ? selectedOption.name
      : placeholder || `Selecciona ${label.toLowerCase()}`;
  };

  return (
    <div className="mb-4">
      <label htmlFor={name} className={labelClasses}>
        {label}
      </label>

      {as === "select" ? (
        <div className="relative" ref={selectRef}>
          {/* Campo visual del select */}
          <div
            onClick={() => setIsOpen(!isOpen)}
            className={`${selectClasses} ${
              !field.value ? "text-[rgba(54,69,79,0.5)]" : ""
            }`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setIsOpen(!isOpen);
              }
            }}
          >
            {getSelectedOptionName()}
          </div>

          {/* Ícono de flecha con animación */}
          <div
            className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M5 7.5L10 12.5L15 7.5"
                stroke="#133D74"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Dropdown mejorado */}
          <MobileSelect
            open={isOpen}
            value={field.value}
            options={options}
            placeholder={placeholder}
            onOptionSelect={handleSelectOption}
            onClose={() => setIsOpen(false)}
            searchable={options.length > 5}
            label={label}
          />

          {/* Campo hidden para Formik */}
          <Field type="hidden" name={name} />
        </div>
      ) : isAmount ? (
        <input
          id={name}
          name={name}
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={handleAmountChange}
          onKeyDown={handleAmountKeyDown}
          onFocus={handleAmountFocus}
          onBlur={handleAmountBlur}
          placeholder={placeholder}
          className={`${inputClasses} ${placeholderClasses}`}
        />
      ) : (
        <Field
          id={name}
          name={name}
          type={type}
          step={step}
          placeholder={placeholder}
          className={`${inputClasses} ${placeholderClasses}`}
        />
      )}

      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-sm mb-4 px-2"
      />
    </div>
  );
}
