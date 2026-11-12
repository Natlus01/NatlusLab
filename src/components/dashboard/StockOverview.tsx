import React from 'react';
import { Item } from '../../types';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Badge } from '../common/Badge';

interface StockOverviewProps {
  items: Item[];
  onSelectItem: (itemId: string) => void;
}

export const StockOverview: React.FC<StockOverviewProps> = ({ items }) => {
  // Find items where stock is 0 or low (<= 2)
  const lowStockItems = items.filter((item) => item.stock <= 2);

  // Group items by category with counts
  const categoryCounts: Record<string, { totalItems: number; availableStock: number }> = {};
  items.forEach((item) => {
    if (!categoryCounts[item.category]) {
      categoryCounts[item.category] = { totalItems: 0, availableStock: 0 };
    }
    categoryCounts[item.category].totalItems += 1;
    categoryCounts[item.category].availableStock += item.stock;
  });

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-slate-500" aria-hidden="true" />
          Status Ketersediaan & Stok Menipis
        </h2>
        <span className="text-xs text-slate-500 tabular-nums">
          {items.length} total jenis
        </span>
      </div>

      <div className="mt-3 space-y-4 flex-1">
        {/* Low Stock Warning Box */}
        <div>
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Perhatian Stok Kritis (Stok &le; 2)
          </p>
          {lowStockItems.length === 0 ? (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Semua peralatan saat ini memiliki ketersediaan yang mencukupi.</span>
            </div>
          ) : (
            <div className="space-y-1.5">
              {lowStockItems.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <span className="font-semibold text-slate-900 dark:text-slate-100 block truncate">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      Kode: {item.code}
                    </span>
                  </div>
                  <Badge variant={item.stock === 0 ? 'danger' : 'warning'} className="shrink-0 text-[10px]">
                    {item.stock === 0 ? 'Habis (0)' : `Tersisa ${item.stock}`}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Category Breakdown */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Ringkasan Berdasarkan Kategori
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {Object.entries(categoryCounts).slice(0, 4).map(([category, count]) => (
              <div
                key={category}
                className="p-2 rounded-lg bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60"
              >
                <span className="text-[11px] text-slate-600 dark:text-slate-400 block truncate font-medium">
                  {category}
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-xs text-slate-500">{count.totalItems} jenis</span>
                  <span className="text-xs font-bold text-teal-700 dark:text-teal-400 tabular-nums">
                    {count.availableStock} siap
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
