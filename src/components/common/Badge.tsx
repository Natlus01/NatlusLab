import React from 'react';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  children,
  icon,
  className = '',
}) => {
  // Notus uppercase badge style with WCAG AA compliant colors
  const variantClasses = {
    success:
      'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-200 dark:border-emerald-800',
    warning:
      'bg-orange-100 text-orange-900 border-orange-300 dark:bg-orange-950/70 dark:text-orange-200 dark:border-orange-800',
    danger:
      'bg-red-100 text-red-900 border-red-300 dark:bg-red-950/70 dark:text-red-200 dark:border-red-800',
    info:
      'bg-lightBlue-100 text-lightBlue-800 border-lightBlue-300 dark:bg-lightBlue-950/70 dark:text-lightBlue-200 dark:border-lightBlue-800',
    neutral:
      'bg-blueGray-100 text-blueGray-700 border-blueGray-300 dark:bg-blueGray-700/80 dark:text-blueGray-200 dark:border-blueGray-600',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border shadow-xs ${variantClasses[variant]} ${className}`}
    >
      {icon && <span className="shrink-0" aria-hidden="true">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
