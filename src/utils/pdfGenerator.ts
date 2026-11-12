import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Item, Transaction } from '../types';

export const generateBorrowReceiptPDF = (transaction: Transaction) => {
  const doc = new jsPDF();

  // Header Kop Surat Lab
  doc.setFillColor(30, 41, 59); // blueGray-800
  doc.rect(0, 0, 210, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('LABORATORIUM KOMPUTER & JARINGAN', 105, 12, { align: 'center' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Sistem Informasi Inventaris & Peminjaman Perangkat (NatlusLab)', 105, 18, { align: 'center' });
  doc.text('Domain: lab.natlus.my.id', 105, 23, { align: 'center' });

  // Judul Dokumen
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('BUKTI RESMI PEMINJAMAN ALAT LABORATORIUM', 105, 38, { align: 'center' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Nomor Transaksi: ${transaction.transactionCode}`, 105, 44, { align: 'center' });

  // Informasi Peminjaman
  const infoData = [
    ['Nama Peminjam', `: ${transaction.borrowerName}`],
    ['Tanggal Peminjaman', `: ${transaction.borrowDate}`],
    ['Status Sirkulasi', `: ${transaction.status}`],
    ['Petugas Validasi', `: ${transaction.processedByUserName}`],
    ['Tanggal Dibuat', `: ${new Date(transaction.createdAt).toLocaleString('id-ID')}`],
  ];

  if (transaction.returnDate) {
    infoData.push(['Tanggal Pengembalian', `: ${transaction.returnDate}`]);
    infoData.push(['Petugas Penerima', `: ${transaction.returnedByUserName || '-'}`]);
  }

  autoTable(doc, {
    startY: 48,
    body: infoData,
    theme: 'plain',
    styles: { fontSize: 9, cellPadding: 1.5, textColor: [51, 65, 85] },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { cellWidth: 130 },
    },
  });

  // Tabel Barang yang Dipinjam
  const currentY = (doc as any).lastAutoTable.finalY + 6;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Rincian Perangkat Laboratorium:', 14, currentY);

  autoTable(doc, {
    startY: currentY + 3,
    head: [['No', 'Kode Barang', 'Nama Perangkat', 'Jumlah Unit', 'Catatan / Kondisi']],
    body: [
      [
        '1',
        transaction.itemCode,
        transaction.itemName,
        `${transaction.quantity} Unit`,
        transaction.notes || 'Kondisi operasional normal',
      ],
    ],
    headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 9, cellPadding: 3 },
  });

  // Ketentuan & Tanda Tangan
  const signY = (doc as any).lastAutoTable.finalY + 12;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text('* Ketentuan: Peminjam bertanggung jawab penuh atas keutuhan dan kebersihan perangkat laboratorium.', 14, signY);

  const ttdY = signY + 14;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Peminjam Perangkat,', 40, ttdY, { align: 'center' });
  doc.text('Petugas Laboratorium,', 170, ttdY, { align: 'center' });

  doc.text('______________________', 40, ttdY + 22, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.text(transaction.borrowerName.split('(')[0].trim(), 40, ttdY + 27, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.text('______________________', 170, ttdY + 22, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.text(transaction.processedByUserName, 170, ttdY + 27, { align: 'center' });

  // Unduh Berkas PDF
  doc.save(`Bukti_Pinjam_${transaction.transactionCode}.pdf`);
};

export const generateInventoryReportPDF = (items: Item[]) => {
  const doc = new jsPDF('landscape');

  // Header
  doc.setFillColor(30, 41, 59);
  doc.rect(0, 0, 297, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('REKAPITULASI ASET INVENTARIS LABORATORIUM KOMPUTER', 148.5, 11, { align: 'center' });

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`NatlusLab (lab.natlus.my.id) | Tanggal Cetak: ${new Date().toLocaleString('id-ID')}`, 148.5, 17, { align: 'center' });

  // Tabel Items
  const tableData = items.map((it, idx) => [
    idx + 1,
    it.code,
    it.name,
    it.category,
    `${it.stock} Unit`,
    `${it.borrowedCount} Unit`,
    `${it.totalStock} Unit`,
    it.stock === 0 ? 'HABIS' : it.stock < 3 ? 'MENIPIS' : 'TERSEDIA',
  ]);

  autoTable(doc, {
    startY: 30,
    head: [['No', 'Kode', 'Nama Barang', 'Kategori', 'Stok Siap', 'Dipinjam', 'Total Aset', 'Status']],
    body: tableData,
    headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 8, cellPadding: 2.5 },
  });

  doc.save(`Laporan_Inventaris_Lab_${new Date().toISOString().slice(0, 10)}.pdf`);
};
