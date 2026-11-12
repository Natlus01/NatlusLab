import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Modal } from '../common/Modal';
import { Camera, AlertCircle, RefreshCw } from 'lucide-react';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (decodedText: string) => void;
  title?: string;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  onScanSuccess,
  title = 'Pemindaian Kamera QR Code Perangkat',
}) => {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerId = 'qr-reader-container';

  useEffect(() => {
    if (!isOpen) {
      stopScanner();
      return;
    }

    const timer = setTimeout(() => {
      startScanner();
    }, 300);

    return () => {
      clearTimeout(timer);
      stopScanner();
    };
  }, [isOpen]);

  const startScanner = async () => {
    try {
      setErrorMessage('');
      const html5QrCode = new Html5Qrcode(containerId);
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 220, height: 220 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          stopScanner();
          onScanSuccess(decodedText);
          onClose();
        },
        () => {
          // Frame scan error biasa, abaikan
        }
      );
      setIsScanning(true);
    } catch (err: any) {
      console.error('Kamera error:', err);
      setErrorMessage(
        'Kamera tidak dapat diakses atau izin kamera belum diberikan. Pastikan izin kamera aktif pada browser Anda.'
      );
      setIsScanning(false);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (err) {
        // Safe fail
      }
      scannerRef.current = null;
      setIsScanning(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="md">
      <div className="flex flex-col items-center p-2">
        {errorMessage ? (
          <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-start gap-2 mb-4">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
            <div>
              <p className="font-bold">Gagal Mengakses Kamera</p>
              <p className="mt-1">{errorMessage}</p>
              <button
                type="button"
                onClick={startScanner}
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded text-xs font-semibold hover:bg-red-700 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Coba Lagi</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center">
            <div
              id={containerId}
              className="w-full max-w-[320px] h-[300px] bg-black rounded-lg overflow-hidden border border-blueGray-300 relative shadow-inner"
            />
            <p className="text-xs text-blueGray-500 text-center mt-3 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-lightBlue-600" />
              <span>Arahkan kamera ke stiker QR Code yang tertempel di unit perangkat.</span>
            </p>
          </div>
        )}

        <div className="mt-5 w-full flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-blueGray-200 hover:bg-blueGray-300 text-blueGray-800 text-xs font-bold uppercase rounded cursor-pointer min-h-[40px]"
          >
            Tutup Scanner
          </button>
        </div>
      </div>
    </Modal>
  );
};
