import React, { useId } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  id: explicitId,
  className = '',
  disabled,
  ...props
}) => {
  const generatedId = useId();
  const inputId = explicitId || generatedId;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  return (
    <div className="w-full">
      <label
        htmlFor={inputId}
        className="block uppercase text-blueGray-600 dark:text-blueGray-300 text-xs font-bold mb-1.5"
      >
        {label}
        {props.required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
      </label>
      <input
        id={inputId}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : helperText ? helperId : undefined}
        className={`w-full min-h-[44px] px-3.5 py-2.5 text-sm rounded border bg-white dark:bg-blueGray-800 text-blueGray-700 dark:text-blueGray-100 placeholder:text-blueGray-400 shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-lightBlue-500 ${
          error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-blueGray-300 dark:border-blueGray-600'
        } ${disabled ? 'bg-blueGray-100 dark:bg-blueGray-900 text-blueGray-400 cursor-not-allowed' : ''} ${className}`}
        {...props}
      />
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
