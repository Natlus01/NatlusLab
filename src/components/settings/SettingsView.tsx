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
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Pengaturan & Pemeliharaan Sistem
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Pencadangan basis data, pemulihan data inventaris, dan informasi pengujian.
        </p>
      </div>

      {statusMessage && (
        <div
          role="status"
          className={`p-3 rounded-lg text-xs font-medium border flex items-center gap-2 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-200 dark:border-emerald-800'
              : 'bg-rose-50 text-rose-900 border-rose-200 dark:bg-rose-950/50 dark:text-rose-200 dark:border-rose-800'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Backup and Restore Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
          <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold text-sm">
            <Download className="w-4 h-4 text-teal-600" aria-hidden="true" />
            <span>Ekspor & Cadangkan Data (JSON)</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Unduh seluruh berkas data inventaris, transaksi, dan akun staff dalam format JSON untuk arsip atau pemindahan ke perangkat lain.
          </p>
          <Button
            variant="outline"
            size="sm"
            icon={<Download className="w-3.5 h-3.5" />}
            onClick={handleExport}
          >
            Unduh Cadangan JSON
          </Button>
        </div>

        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
          <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold text-sm">
            <Upload className="w-4 h-4 text-teal-600" aria-hidden="true" />
            <span>Pulihkan Data dari Berkas JSON</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Muat ulang data inventaris laboratorium dari berkas JSON cadangan yang telah dibuat sebelumnya.
          </p>
          <label className="inline-flex items-center justify-center min-h-[36px] px-3 py-1.5 text-xs font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5 mr-1.5" aria-hidden="true" />
            <span>Pilih Berkas JSON</span>
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
      <div className="p-5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-white dark:bg-slate-900 space-y-3">
        <div className="flex items-center gap-2 text-rose-900 dark:text-rose-200 font-bold text-sm">
          <RotateCcw className="w-4 h-4 text-rose-600" aria-hidden="true" />
          <span>Atur Ulang Data ke Standar Awal Soal</span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Mengembalikan seluruh data inventaris ke 5 data barang awal wajib (BR001 Laptop Lenovo, BR002 Mouse Logitech, BR003 Keyboard Mechanical, BR004 Proyektor Epson, BR005 Monitor LG) serta mereset transaksi.
        </p>
        <Button
          variant="danger"
          size="sm"
          icon={<RotateCcw className="w-3.5 h-3.5" />}
          onClick={handleReset}
        >
          Reset ke Data Awal Pabrik
        </Button>
      </div>

      {/* Submission Quick Access */}
      <div className="p-5 rounded-xl border border-teal-200 dark:border-teal-800 bg-teal-50/50 dark:bg-teal-950/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-teal-900 dark:text-teal-200">
            Lembar Tugas Pengumpulan (Coding Talent Challenge)
          </p>
          <p className="text-xs text-teal-800/80 dark:text-teal-300/80 mt-0.5">
            Salin format jawaban nama, NIM, URL hosting, repositori, dan akun demo.
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
