import { Field, ErrorMessage } from 'formik';

export default function FormField({ 
  label, 
  name, 
  type = 'text', 
  placeholder = '', 
  as = 'input',
  options = [],
  step
}) {
  const inputClasses = "rounded-lg shadow-lg bg-white/80 text-[rgba(54,69,79)] w-full py-3 px-4 font-sans text-base border-primary border outline-none leading-5 box-border mb-2";
  const selectClasses = "rounded-lg shadow-lg bg-white/80 text-[rgba(54,69,79)] w-full py-3 px-4 pr-10 font-sans text-base border-primary border outline-none leading-5 box-border mb-2 appearance-none";
  const placeholderClasses = type !== 'date' ? 'placeholder:text-[rgba(54,69,79,0.5)]' : '';
  const labelClasses = "text-primary my-0 mx-0 mb-2 font-sans font-medium text-base block mt-6 first:mt-0";

  return (
    <div className="mb-4">
      <label htmlFor={name} className={labelClasses}>
        {label}
      </label>
      
      {as === 'select' ? (
        <div className="relative">
          <Field
            as="select"
            id={name}
            name={name}
            className={selectClasses}
          >
            <option value="">{placeholder || `Selecciona ${label.toLowerCase()}`}</option>
            {options.map((option) => (
              <option key={option.id} value={option.value || option.name}>
                {option.name}
              </option>
            ))}
          </Field>
          {/* Ícono de flecha personalizado */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 7.5L10 12.5L15 7.5" stroke="#133D74" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
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

