import React from 'react';
import { Item } from '../../types';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Badge } from '../common/Badge';

interface StockOverviewProps {
  items: Item[];
  onSelectItem: (itemId: string) => void;
}

export const StockOverview: React.FC<StockOverviewProps> = ({ items }) => {
  const lowStockItems = items.filter((item) => item.stock <= 2);

  const categoryCounts: Record<string, { totalItems: number; availableStock: number }> = {};
  items.forEach((item) => {
    if (!categoryCounts[item.category]) {
      categoryCounts[item.category] = { totalItems: 0, availableStock: 0 };
    }
    categoryCounts[item.category].totalItems += 1;
    categoryCounts[item.category].availableStock += item.stock;
  });

  return (
    <div className="relative flex flex-col min-w-0 break-words bg-white w-full shadow-lg rounded-lg border border-blueGray-100">
      {/* Notus Card Header */}
      <div className="rounded-t mb-0 px-5 py-4 border-b border-solid border-blueGray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-blueGray-400" aria-hidden="true" />
          <h3 className="font-bold text-sm uppercase text-blueGray-700 tracking-wider">
            Ketersediaan & Stok Kritis
          </h3>
        </div>
        <span className="text-[11px] font-bold uppercase text-blueGray-400 tabular-nums">
          {items.length} jenis aset
        </span>
      </div>

      <div className="p-5 space-y-5">
        {/* Low Stock Warning Section */}
        <div>
          <h6 className="text-[11px] font-bold uppercase text-blueGray-400 tracking-wider mb-2">
            Peralatan dengan Stok Kritis (&le; 2 unit)
          </h6>
          {lowStockItems.length === 0 ? (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded flex items-center gap-2 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" aria-hidden="true" />
              <span>Semua peralatan laboratorium memiliki ketersediaan yang mencukupi.</span>
            </div>
          ) : (
            <div className="space-y-2">
              {lowStockItems.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2.5 rounded bg-blueGray-50 border border-blueGray-100 text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <span className="font-bold text-blueGray-800 block truncate">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-blueGray-400 font-mono">
                      Kode: {item.code}
                    </span>
                  </div>
                  <Badge variant={item.stock === 0 ? 'danger' : 'warning'} className="shrink-0 text-[10px]">
                    {item.stock === 0 ? 'Habis (0)' : `Sisa ${item.stock} unit`}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Category Breakdown */}
        <div className="pt-3 border-t border-blueGray-100">
          <h6 className="text-[11px] font-bold uppercase text-blueGray-400 tracking-wider mb-2.5">
            Sebaran Berdasarkan Kategori
          </h6>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {Object.entries(categoryCounts).slice(0, 4).map(([category, count]) => (
              <div
                key={category}
                className="p-2.5 rounded bg-blueGray-50/70 border border-blueGray-100"
              >
                <span className="text-[11px] text-blueGray-500 block truncate font-bold">
                  {category}
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-[11px] text-blueGray-400">{count.totalItems} jenis</span>
                  <span className="text-xs font-bold text-lightBlue-600 tabular-nums">
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
