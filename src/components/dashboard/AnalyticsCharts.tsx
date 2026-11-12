import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Item, Transaction } from '../../types';
import { BarChart3, PieChart as PieIcon } from 'lucide-react';

interface AnalyticsChartsProps {
  items: Item[];
  transactions: Transaction[];
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ items }) => {
  // 1. Data per Kategori
  const categoryMap: { [cat: string]: { category: string; stock: number; borrowed: number } } = {};

  items.forEach((item) => {
    const cat = item.category || 'Lainnya';
    if (!categoryMap[cat]) {
      categoryMap[cat] = { category: cat, stock: 0, borrowed: 0 };
    }
    categoryMap[cat].stock += item.stock;
    categoryMap[cat].borrowed += item.borrowedCount;
  });

  const barData = Object.values(categoryMap);

  // 2. Data Pie Komposisi Total Aset
  const totalAvailable = items.reduce((sum, it) => sum + it.stock, 0);
  const totalBorrowed = items.reduce((sum, it) => sum + it.borrowedCount, 0);

  const pieData = [
    { name: 'Stok Tersedia', value: totalAvailable, color: '#059669' },
    { name: 'Sedang Dipinjam', value: totalBorrowed, color: '#d97706' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      {/* Bar Chart: Stok vs Peminjaman per Kategori */}
      <div className="lg:col-span-2 bg-white rounded-lg shadow-lg border border-blueGray-200 p-5">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-blueGray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-lightBlue-100 text-lightBlue-600 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-blueGray-700">
                Statistik Ketersediaan Per Kategori
              </h3>
              <p className="text-[11px] text-blueGray-400">
                Perbandingan unit siap di lab vs sedang dipinjam
              </p>
            </div>
          </div>
        </div>

        <div className="h-64 w-full">
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <XAxis
                  dataKey="category"
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  angle={-15}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '11px',
                    border: 'none',
                  }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="stock" name="Tersedia di Lab" fill="#0284c7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="borrowed" name="Sedang Dipinjam" fill="#d97706" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-blueGray-400">
              Belum ada data inventaris untuk ditampilkan
            </div>
          )}
        </div>
      </div>

      {/* Pie Chart: Proporsi Unit */}
      <div className="bg-white rounded-lg shadow-lg border border-blueGray-200 p-5">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-blueGray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <PieIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-blueGray-700">
                Rasio Unit Laboratorium
              </h3>
              <p className="text-[11px] text-blueGray-400">Proporsi pemanfaatan total aset</p>
            </div>
          </div>
        </div>

        <div className="h-64 w-full flex flex-col items-center justify-center">
          <ResponsiveContainer width="100%" height="80%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={75}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '11px',
                  border: 'none',
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="flex items-center justify-center gap-4 text-xs font-semibold text-blueGray-600 mt-2">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block"></span>
              <span>Tersedia ({totalAvailable})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-600 inline-block"></span>
              <span>Dipinjam ({totalBorrowed})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
