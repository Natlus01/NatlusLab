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
    <div className="relative flex flex-col min-w-0 break-words bg-white dark:bg-blueGray-800 w-full shadow-lg rounded-lg border border-blueGray-100 dark:border-blueGray-700">
      {/* Notus Card Header */}
      <div className="rounded-t mb-0 px-5 py-4 border-b border-solid border-blueGray-100 dark:border-blueGray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blueGray-400" aria-hidden="true" />
          <h3 className="font-bold text-sm uppercase text-blueGray-700 dark:text-blueGray-100 tracking-wider">
            Aktivitas Transaksi Terbaru
          </h3>
        </div>
        <button
          type="button"
          onClick={onViewAll}
          className="bg-lightBlue-500 hover:bg-lightBlue-600 text-white font-bold uppercase text-[11px] px-3 py-1.5 rounded shadow hover:shadow-md outline-none transition-all cursor-pointer"
        >
          Lihat Semua
        </button>
      </div>

      <div className="p-4 divide-y divide-blueGray-100 dark:divide-blueGray-700">
        {recent.length === 0 ? (
          <div className="py-8 text-center text-xs text-blueGray-400">
            Belum ada aktivitas transaksi yang tercatat.
          </div>
        ) : (
          recent.map((trx) => (
            <div key={trx.id} className="py-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                    trx.status === 'DIPINJAM'
                      ? 'bg-orange-500 text-white'
                      : 'bg-emerald-500 text-white'
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
                  <p className="text-xs font-bold text-blueGray-800 dark:text-blueGray-100 truncate">
                    {trx.borrowerName}
                  </p>
                  <p className="text-[11px] text-blueGray-400 truncate mt-0.5">
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
                <p className="text-[10px] text-blueGray-400 mt-1 tabular-nums font-semibold">
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
