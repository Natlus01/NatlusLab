import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Item } from '../../types';
import { Modal } from '../common/Modal';
import { Printer, Download } from 'lucide-react';

interface ItemQRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Item | null;
}

export const ItemQRCodeModal: React.FC<ItemQRCodeModalProps> = ({ isOpen, onClose, item }) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!item) return null;

  // Nilai QR code yang berisi data identifikasi perangkat
  const qrPayload = JSON.stringify({
    system: 'NatlusLab',
    code: item.code,
    id: item.id,
    name: item.name,
  });

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadSVG = () => {
    const svg = printRef.current?.querySelector('svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = `QR_${item.code}_${item.name.replace(/\s+/g, '_')}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Stiker QR Code Inventaris: ${item.code}`}
      maxWidth="sm"
    >
      <div className="flex flex-col items-center justify-center p-4">
        {/* Printable Stiker Area */}
        <div
          ref={printRef}
          className="bg-white p-5 rounded-lg border-2 border-dashed border-blueGray-300 flex flex-col items-center text-center shadow-sm w-full max-w-[260px]"
        >
          <div className="text-[11px] font-bold uppercase tracking-wider text-blueGray-600 mb-2">
            Laboratorium Komputer
          </div>
          
          <QRCodeSVG
            value={qrPayload}
            size={160}
            level="H"
            includeMargin={true}
            className="my-1"
          />

          <div className="text-sm font-extrabold text-blueGray-800 mt-2 tracking-wide">
            {item.code}
          </div>
          <div className="text-xs text-blueGray-600 font-medium truncate max-w-full">
            {item.name}
          </div>
          <div className="text-[10px] text-blueGray-400 mt-0.5">
            {item.category}
          </div>
        </div>

        <p className="text-xs text-blueGray-500 text-center mt-4">
          Cetak dan tempelkan stiker QR Code ini pada unit perangkat untuk proses pemindaian cepat (*scan*) saat sirkulasi peminjaman.
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-6 w-full">
          <button
            type="button"
            onClick={handleDownloadSVG}
            className="flex-1 bg-blueGray-100 hover:bg-blueGray-200 text-blueGray-700 text-xs font-bold uppercase px-3 py-2.5 rounded shadow-sm inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer min-h-[40px]"
          >
            <Download className="w-4 h-4" />
            <span>Unduh SVG</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 bg-lightBlue-600 hover:bg-lightBlue-700 text-white text-xs font-bold uppercase px-3 py-2.5 rounded shadow inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer min-h-[40px]"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Stiker</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
