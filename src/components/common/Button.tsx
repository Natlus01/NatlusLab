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
  // Base classes with 44px minimum tap target on mobile according to R-03
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 select-none';

  const sizeClasses = {
    sm: 'min-h-[40px] px-3 py-1.5 text-xs gap-1.5 sm:min-h-[36px]',
    md: 'min-h-[44px] px-4 py-2 text-sm gap-2',
    lg: 'min-h-[48px] px-5 py-2.5 text-base gap-2.5',
  };

  const variantClasses = {
    primary:
      'bg-teal-700 text-white hover:bg-teal-800 active:bg-teal-900 dark:bg-teal-600 dark:hover:bg-teal-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-500 shadow-sm',
    secondary:
      'bg-slate-800 text-white hover:bg-slate-900 active:bg-slate-950 dark:bg-slate-700 dark:hover:bg-slate-600 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-500 shadow-sm',
    danger:
      'bg-rose-700 text-white hover:bg-rose-800 active:bg-rose-900 dark:bg-rose-600 dark:hover:bg-rose-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-500 shadow-sm',
    outline:
      'border border-slate-300 bg-white text-slate-800 hover:bg-slate-100 active:bg-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 disabled:border-slate-200 dark:disabled:border-slate-800 disabled:text-slate-400',
    ghost:
      'text-slate-700 hover:bg-slate-100 active:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800 disabled:text-slate-400',
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
