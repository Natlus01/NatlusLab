import React, { useState } from 'react';
import { storageService } from '../../services/storageService';
import { Button } from '../common/Button';
import { Download, Upload, RotateCcw, Check, AlertCircle } from 'lucide-react';

interface SettingsViewProps {
  onOpenSubmissionModal: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onOpenSubmissionModal }) => {
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showStatus = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleExport = () => {
    try {
      const json = storageService.exportDatabase();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `labflow-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      showStatus('Cadangan data berhasil diunduh ke komputer Anda.');
    } catch {
      showStatus('Gagal membuat berkas cadangan data.', 'error');
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const res = storageService.importDatabase(content);
        if (res.success) {
          showStatus(res.message);
        } else {
          showStatus(res.message, 'error');
        }
      } catch {
        showStatus('Gagal membaca berkas JSON.', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleReset = () => {
    if (window.confirm('Apakah Anda yakin ingin mengatur ulang data ke kondisi awal pabrik/laboratorium? Semua perubahan akan dikembalikan ke data awal.')) {
      storageService.resetToDefault();
      showStatus('Data laboratorium berhasil diatur ulang ke data default awal.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="p-5 rounded-lg border border-blueGray-200 dark:border-blueGray-700 bg-white dark:bg-blueGray-800 shadow-lg">
        <h6 className="text-xs uppercase font-bold text-blueGray-400">
          Pemeliharaan Sistem
        </h6>
        <h1 className="text-xl font-bold uppercase tracking-tight text-blueGray-800 dark:text-blueGray-100 mt-0.5">
          Pengaturan & Pencadangan Data
        </h1>
        <p className="text-xs text-blueGray-500 dark:text-blueGray-400 mt-1">
          Pencadangan basis data inventaris laboratorium, pemulihan data dari JSON, dan lembar tugas pengumpulan.
        </p>
      </div>

      {statusMessage && (
        <div
          role="status"
          className={`p-3.5 rounded text-xs font-bold border flex items-center gap-2 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-200 dark:border-emerald-800'
              : 'bg-red-50 text-red-900 border-red-200 dark:bg-red-950/50 dark:text-red-200 dark:border-red-800'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Backup and Restore Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative flex flex-col min-w-0 break-words bg-white dark:bg-blueGray-800 rounded-lg shadow-lg border border-blueGray-100 dark:border-blueGray-700 p-5 space-y-3">
          <div className="flex items-center gap-2 text-blueGray-800 dark:text-blueGray-100 font-bold uppercase text-xs tracking-wider">
            <Download className="w-4 h-4 text-lightBlue-600" aria-hidden="true" />
            <span>Ekspor & Cadangkan JSON</span>
          </div>
          <p className="text-xs text-blueGray-500 dark:text-blueGray-400 leading-relaxed">
            Unduh seluruh data barang, riwayat transaksi, dan akun staff dalam satu berkas JSON cadangan.
          </p>
          <button
            type="button"
            onClick={handleExport}
            className="bg-lightBlue-500 hover:bg-lightBlue-600 text-white font-bold uppercase text-xs px-4 py-2.5 rounded shadow hover:shadow-md outline-none transition-all cursor-pointer flex items-center gap-1.5 w-fit"
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Unduh Cadangan Data</span>
          </button>
        </div>

        <div className="relative flex flex-col min-w-0 break-words bg-white dark:bg-blueGray-800 rounded-lg shadow-lg border border-blueGray-100 dark:border-blueGray-700 p-5 space-y-3">
          <div className="flex items-center gap-2 text-blueGray-800 dark:text-blueGray-100 font-bold uppercase text-xs tracking-wider">
            <Upload className="w-4 h-4 text-emerald-600" aria-hidden="true" />
            <span>Pulihkan Data dari JSON</span>
          </div>
          <p className="text-xs text-blueGray-500 dark:text-blueGray-400 leading-relaxed">
            Muat ulang data laboratorium dari berkas JSON cadangan yang telah diekspor sebelumnya.
          </p>
          <label className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase text-xs px-4 py-2.5 rounded shadow hover:shadow-md outline-none transition-all cursor-pointer flex items-center gap-1.5 w-fit min-h-[36px]">
            <Upload className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
            <span>Pilih Berkas Cadangan</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Reset System Card */}
      <div className="relative flex flex-col min-w-0 break-words bg-white dark:bg-blueGray-800 rounded-lg shadow-lg border border-red-200 dark:border-red-900/60 p-5 space-y-3">
        <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-bold uppercase text-xs tracking-wider">
          <RotateCcw className="w-4 h-4 text-red-600" aria-hidden="true" />
          <span>Atur Ulang ke Data Standar Soal (Pabrik)</span>
        </div>
        <p className="text-xs text-blueGray-600 dark:text-blueGray-400 leading-relaxed">
          Mengembalikan inventaris ke 5 data barang awal wajib (BR001 Laptop Lenovo, BR002 Mouse Logitech, BR003 Keyboard Mechanical, BR004 Proyektor Epson, BR005 Monitor LG) serta mereset transaksi.
        </p>
        <button
          type="button"
          onClick={handleReset}
          className="bg-red-600 hover:bg-red-700 text-white font-bold uppercase text-xs px-4 py-2.5 rounded shadow hover:shadow-md outline-none transition-all cursor-pointer flex items-center gap-1.5 w-fit"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Reset ke Data Awal Pabrik</span>
        </button>
      </div>

      {/* Submission Information Quick Box */}
      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-lightBlue-50 dark:bg-lightBlue-950/40 border border-lightBlue-200 dark:border-lightBlue-800 rounded-lg shadow-lg p-5">
        <div>
          <h6 className="text-xs font-bold uppercase tracking-wider text-lightBlue-800 dark:text-lightBlue-300">
            Format Pengumpulan Tugas (Poin G)
          </h6>
          <p className="text-xs text-blueGray-600 dark:text-blueGray-400 mt-1">
            Salin lembar tugas berisi nama, NIM, URL hosting, repositori, dan akun demo.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={onOpenSubmissionModal}
          className="shrink-0"
        >
          Buka Lembar Pengumpulan
        </Button>
      </div>
    </div>
  );
};
