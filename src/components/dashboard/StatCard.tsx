import React from 'react';

interface StatCardProps {
  label: string;
  value: number | string;
  unit?: string;
  icon: React.ReactNode;
  description?: string;
  variant?: 'red' | 'orange' | 'emerald' | 'lightBlue';
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  unit,
  icon,
  description,
  variant = 'lightBlue',
}) => {
  const iconBackgrounds = {
    red: 'bg-red-500',
    orange: 'bg-orange-500',
    emerald: 'bg-emerald-500',
    lightBlue: 'bg-lightBlue-500',
  };

  return (
    <div className="relative flex flex-col min-w-0 break-words bg-white rounded-lg shadow-lg border border-blueGray-100 p-4 transition-all hover:shadow-xl">
      <div className="flex-auto p-1">
        <div className="flex flex-wrap items-center">
          <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
            <h5 className="text-blueGray-400 uppercase font-bold text-xs tracking-wider">
              {label}
            </h5>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-bold text-2xl text-blueGray-700 tabular-nums">
                {value}
              </span>
              {unit && (
                <span className="text-xs font-semibold text-blueGray-400">
                  {unit}
                </span>
              )}
            </div>
          </div>
          <div className="relative w-auto pl-4 flex-initial">
            <div
              className={`text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full ${iconBackgrounds[variant]}`}
              aria-hidden="true"
            >
              {icon}
            </div>
          </div>
        </div>
        {description && (
          <p className="text-xs text-blueGray-400 mt-4 pt-2 border-t border-blueGray-100 flex items-center">
            <span className="whitespace-nowrap font-medium">{description}</span>
          </p>
        )}
      </div>
    </div>
  );
};
