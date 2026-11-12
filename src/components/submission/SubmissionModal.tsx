import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Copy, Check } from 'lucide-react';

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STORAGE_SUBMISSION_KEY = 'labflow_student_submission_v1';

export const SubmissionModal: React.FC<SubmissionModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [studentName, setStudentName] = useState(() => {
    try {
      const data = localStorage.getItem(STORAGE_SUBMISSION_KEY);
      return data ? JSON.parse(data).name : '';
    } catch {
      return '';
    }
  });

  const [studentNim, setStudentNim] = useState(() => {
    try {
      const data = localStorage.getItem(STORAGE_SUBMISSION_KEY);
      return data ? JSON.parse(data).nim : '';
    } catch {
      return '';
    }
  });

  const [repoUrl, setRepoUrl] = useState(() => {
    try {
      const data = localStorage.getItem(STORAGE_SUBMISSION_KEY);
      return data ? JSON.parse(data).repoUrl : '';
    } catch {
      return '';
    }
  });

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://labflow-inventory.vercel.app';

  const handleSaveStudentInfo = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem(
        STORAGE_SUBMISSION_KEY,
        JSON.stringify({ name: studentName, nim: studentNim, repoUrl })
      );
    } catch {
      // Safe fail
    }
  };

  const submissionText = `==============================
LEMBAR PENGUMPULAN TUGAS
CODING TALENT CHALLENGE
==============================
1. Nama Lengkap           : ${studentName.trim() || '[Nama Lengkap Mahasiswa]'}
2. NIM                    : ${studentNim.trim() || '[NIM Mahasiswa]'}
3. URL Aplikasi Hosting   : ${currentOrigin}
4. URL Repository GitHub  : ${repoUrl.trim() || '[URL Repository GitHub Anda]'}
5. Akun Demo Admin        :
   - Username             : admin
   - Password             : admin123
6. Akun Demo Staff        :
   - Username             : staff
   - Password             : staff123
7. Teknologi Digunakan    :
   - Framework & UI       : React 18 (TypeScript) + Tailwind CSS (Inspirasi Notus NextJS) + Vite
   - State & Persistence  : Reactive LocalStorage Engine + JSON Backup/Export
   - Hosting Platform     : Vercel / Netlify
==============================`;

  const handleCopy = () => {
    navigator.clipboard.writeText(submissionText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Lembar Format Pengumpulan Tugas"
      description="Sesuai poin G dokumen Coding Talent Challenge"
      maxWidth="lg"
    >
      <div className="space-y-5">
        {/* Student Data Form */}
        <form onSubmit={handleSaveStudentInfo} className="p-4 rounded-lg bg-blueGray-50 dark:bg-blueGray-900 border border-blueGray-200 dark:border-blueGray-700 space-y-3">
          <p className="text-xs font-bold uppercase text-blueGray-600 dark:text-blueGray-300">
            Identitas Mahasiswa Pengumpul
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Nama Lengkap"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Contoh: Muhammad Budi"
            />
            <Input
              label="NIM"
              value={studentNim}
              onChange={(e) => setStudentNim(e.target.value)}
              placeholder="Contoh: 21120120120001"
            />
          </div>
          <Input
            label="URL Repository GitHub"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="Contoh: https://github.com/username/labflow-inventory"
          />
          <div className="flex justify-end pt-1">
            <Button size="sm" variant="secondary" type="submit">
              Simpan Identitas
            </Button>
          </div>
        </form>

        {/* Demo Accounts Box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-lg border border-lightBlue-200 dark:border-lightBlue-800 bg-lightBlue-50/60 dark:bg-lightBlue-950/30">
            <p className="text-xs font-bold text-lightBlue-900 dark:text-lightBlue-200 uppercase mb-1">
              Akun Demo Admin
            </p>
            <p className="text-xs text-blueGray-700 dark:text-blueGray-300">
              Username: <code className="font-mono font-bold text-lightBlue-700 dark:text-lightBlue-300">admin</code>
            </p>
            <p className="text-xs text-blueGray-700 dark:text-blueGray-300">
              Password: <code className="font-mono font-bold text-lightBlue-700 dark:text-lightBlue-300">admin123</code>
            </p>
            <p className="text-[11px] text-blueGray-500 dark:text-blueGray-400 mt-1">
              Hak akses: CRUD barang, kelola staff, pantau semua transaksi.
            </p>
          </div>

          <div className="p-3.5 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/30">
            <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200 uppercase mb-1">
              Akun Demo Staff
            </p>
            <p className="text-xs text-blueGray-700 dark:text-blueGray-300">
              Username: <code className="font-mono font-bold text-emerald-700 dark:text-emerald-300">staff</code>
            </p>
            <p className="text-xs text-blueGray-700 dark:text-blueGray-300">
              Password: <code className="font-mono font-bold text-emerald-700 dark:text-emerald-300">staff123</code>
            </p>
            <p className="text-[11px] text-blueGray-500 dark:text-blueGray-400 mt-1">
              Hak akses: Pencatatan peminjaman, pengembalian, cek ketersediaan.
            </p>
          </div>
        </div>

        {/* Formatted Submission Text Preview */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-blueGray-600 dark:text-blueGray-300">
              Pratinjau Teks Pengumpulan
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="bg-lightBlue-500 hover:bg-lightBlue-600 text-white font-bold uppercase text-[11px] px-3 py-1.5 rounded shadow hover:shadow-md outline-none transition-all cursor-pointer flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin' : 'Salin Lembar Tugas'}</span>
            </button>
          </div>
          <pre className="p-3 bg-blueGray-900 text-blueGray-100 rounded text-[11px] font-mono leading-relaxed overflow-x-auto select-all max-h-48 border border-blueGray-700">
            {submissionText}
          </pre>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-blueGray-200 dark:border-blueGray-700 text-xs text-blueGray-500">
          <span className="flex items-center gap-1">
            Host: <strong className="text-blueGray-800 dark:text-blueGray-200">{currentOrigin}</strong>
          </span>
          <Button size="sm" variant="ghost" onClick={onClose}>
            Tutup
          </Button>
        </div>
      </div>
    </Modal>
  );
};
