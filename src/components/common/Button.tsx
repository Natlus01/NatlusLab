import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-bold uppercase tracking-wider rounded transition-all outline-none focus:outline-none select-none';

  const sizeClasses = {
    sm: 'min-h-[36px] px-3 py-1.5 text-[11px] gap-1.5',
    md: 'min-h-[44px] px-4 py-2 text-xs gap-2',
    lg: 'min-h-[48px] px-6 py-3 text-sm gap-2.5',
  };

  const variantClasses = {
    primary:
      'bg-lightBlue-500 hover:bg-lightBlue-600 active:bg-lightBlue-700 text-white shadow hover:shadow-md disabled:bg-blueGray-300 disabled:text-blueGray-400',
    secondary:
      'bg-blueGray-800 hover:bg-blueGray-900 active:bg-black text-white shadow hover:shadow-md disabled:bg-blueGray-300 disabled:text-blueGray-400',
    danger:
      'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow hover:shadow-md disabled:bg-blueGray-300 disabled:text-blueGray-400',
    outline:
      'border border-blueGray-300 bg-white text-blueGray-700 hover:bg-blueGray-50 shadow-xs disabled:border-blueGray-200 disabled:text-blueGray-400',
    ghost:
      'text-blueGray-600 hover:text-blueGray-900 hover:bg-blueGray-100 disabled:text-blueGray-400',
  };

  const cursorClass = disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer';

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${cursorClass} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0" aria-hidden="true">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
