import React, { useId } from 'react';

interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Option[];
  error?: string;
  helperText?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  helperText,
  id: explicitId,
  className = '',
  disabled,
  ...props
}) => {
  const generatedId = useId();
  const selectId = explicitId || generatedId;
  const errorId = `${selectId}-error`;
  const helperId = `${selectId}-helper`;

  return (
    <div className="w-full">
      <label
        htmlFor={selectId}
        className="block uppercase text-blueGray-600 text-xs font-bold mb-1.5"
      >
        {label}
        {props.required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
      </label>
      <div className="relative">
        <select
          id={selectId}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          className={`w-full min-h-[44px] px-3.5 py-2.5 text-sm rounded border bg-white text-blueGray-700 shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-lightBlue-500 ${
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-blueGray-300'
          } ${disabled ? 'bg-blueGray-100 text-blueGray-400 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <p id={errorId} className="mt-1.5 text-xs text-red-500 font-bold" role="alert">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={helperId} className="mt-1 text-xs text-blueGray-400">
          {helperText}
        </p>
      )}
    </div>
  );
};
