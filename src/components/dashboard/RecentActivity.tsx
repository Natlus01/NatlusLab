import React from 'react';
import { Transaction } from '../../types';
import { Badge } from '../common/Badge';
import { ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';

interface RecentActivityProps {
  transactions: Transaction[];
  onViewAll: () => void;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({
  transactions,
  onViewAll,
}) => {
  const recent = transactions.slice(0, 5);

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-500" aria-hidden="true" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Aktivitas Transaksi Terbaru
          </h2>
        </div>
        <button
          type="button"
          onClick={onViewAll}
          className="text-xs text-teal-700 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 font-medium cursor-pointer"
        >
          Lihat Semua
        </button>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800 flex-1">
        {recent.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            Belum ada aktivitas transaksi yang tercatat.
          </div>
        ) : (
          recent.map((trx) => (
            <div key={trx.id} className="py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    trx.status === 'DIPINJAM'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}
                  aria-hidden="true"
                >
                  {trx.status === 'DIPINJAM' ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownLeft className="w-4 h-4" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {trx.borrowerName}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {trx.quantity} unit {trx.itemName} ({trx.itemCode})
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <Badge
                  variant={trx.status === 'DIPINJAM' ? 'warning' : 'success'}
                  className="text-[10px]"
                >
                  {trx.status === 'DIPINJAM' ? 'Dipinjam' : 'Selesai'}
                </Badge>
                <p className="text-[10px] text-slate-400 mt-1 tabular-nums">
                  {trx.borrowDate}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
