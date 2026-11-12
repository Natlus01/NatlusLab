import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 border-2 border-dashed border-blueGray-200 rounded-lg bg-white shadow-xs">
      <div className="p-3 bg-blueGray-50 rounded-lg border border-blueGray-200 text-blueGray-500 mb-4 shadow-xs" aria-hidden="true">
        {icon}
      </div>
      <h3 className="text-base font-bold uppercase tracking-wider text-blueGray-700 mb-1">
        {title}
      </h3>
      <p className="text-xs text-blueGray-500 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
