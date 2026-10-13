import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

// Brand colors pulled from OliveLogo.jsx
const BRAND_GREEN = [0, 96, 10];      // #00600a
const BRAND_GREEN_LIGHT = [27, 138, 36]; // #1b8a24
const TEXT_MUTED = [110, 110, 110];

/**
 * Generates a branded PDF audit report and triggers a download.
 * @param {Array} reportData - rows: { date, startKwh, endKwh, usage, remarks }
 * @param {Object} meta - { siteLabel, meterLabel, startDate, endDate }
 */
export function exportReportToPDF(reportData, meta) {
  const { siteLabel, meterLabel, startDate, endDate } = meta;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;

  // ---- Header band ----
  doc.setFillColor(...BRAND_GREEN);
  doc.rect(0, 0, pageWidth, 70, 'F');

  // Wordmark (vector logo is complex to embed directly; render styled text instead)
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('OliveIoT', margin, 35);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Industrial Energy & Telemetry Platform', margin, 50);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('System Audit Report', pageWidth - margin, 35, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - margin, 50, { align: 'right' });

  // ---- Report meta block ----
  let y = 95;
  doc.setTextColor(...TEXT_MUTED);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('PLANT ZONE', margin, y);
  doc.text('ENERGY METER', margin + 170, y);
  doc.text('PERIOD', margin + 340, y);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(10);
  doc.text(siteLabel || 'All Plants', margin, y + 14);
  doc.text(meterLabel || 'All Associated Meters', margin + 170, y + 14);
  doc.text(`${startDate} to ${endDate}`, margin + 340, y + 14);

  doc.setDrawColor(...BRAND_GREEN_LIGHT);
  doc.setLineWidth(1);
  doc.line(margin, y + 28, pageWidth - margin, y + 28);

  // ---- Table ----
  const totalUsage = reportData.reduce((sum, r) => sum + r.usage, 0);

  autoTable(doc, {
    startY: y + 42,
    margin: { left: margin, right: margin },
    head: [['Audit Date', 'Start Index (kWh)', 'End Index (kWh)', 'Net Consumption', 'Shift Remarks']],
    body: reportData.map(r => [
      r.date,
      r.startKwh.toFixed(1),
      r.endKwh.toFixed(1),
      `+${r.usage.toFixed(1)} kWh`,
      r.remarks,
    ]),
    headStyles: {
      fillColor: BRAND_GREEN,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [40, 40, 40],
    },
    alternateRowStyles: {
      fillColor: [244, 249, 244],
    },
    columnStyles: {
      1: { halign: 'right' },
      2: { halign: 'right' },
      3: { halign: 'right', textColor: BRAND_GREEN, fontStyle: 'bold' },
    },
    didDrawPage: (data) => {
      // Footer on every page
      const pageCount = doc.internal.getNumberOfPages();
      const currentPage = doc.internal.getCurrentPageInfo().pageNumber;
      doc.setFontSize(8);
      doc.setTextColor(...TEXT_MUTED);
      doc.text(
        'OliveIoT \u2014 Confidential System Audit',
        margin,
        pageHeight - 20
      );
      doc.text(
        `Page ${currentPage} of ${pageCount}`,
        pageWidth - margin,
        pageHeight - 20,
        { align: 'right' }
      );
    },
  });

  // ---- Summary block ----
  const finalY = doc.lastAutoTable.finalY + 25;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...BRAND_GREEN);
  doc.text(`Total Net Consumption: ${totalUsage.toFixed(1)} kWh`, margin, finalY);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...TEXT_MUTED);
  doc.setFontSize(8);
  doc.text(`Across ${reportData.length} audit record(s)`, margin, finalY + 13);

  const filename = `OliveIoT_Audit_${(meterLabel || 'AllMeters').replace(/\s+/g, '_')}_${startDate}_to_${endDate}.pdf`;
  doc.save(filename);
  return filename;
}

/**
 * Generates an Excel (.xlsx) audit report and triggers a download.
 */
export function exportReportToExcel(reportData, meta) {
  const { siteLabel, meterLabel, startDate, endDate } = meta;

  const totalUsage = reportData.reduce((sum, r) => sum + r.usage, 0);

  // Title/meta rows above the table
  const metaRows = [
    ['OliveIoT \u2014 System Audit Report'],
    [`Plant Zone: ${siteLabel || 'All Plants'}`],
    [`Energy Meter: ${meterLabel || 'All Associated Meters'}`],
    [`Period: ${startDate} to ${endDate}`],
    [`Generated: ${new Date().toLocaleString()}`],
    [],
  ];

  const header = ['Audit Date', 'Start Meter Index (kWh)', 'End Meter Index (kWh)', 'Total Net Consumption (kWh)', 'Shift Remarks'];
  const dataRows = reportData.map(r => [r.date, r.startKwh, r.endKwh, r.usage, r.remarks]);
  const summaryRow = [];
  const totalsRow = ['', '', 'Total Consumption', totalUsage, ''];

  const sheetData = [...metaRows, header, ...dataRows, summaryRow, totalsRow];

  const ws = XLSX.utils.aoa_to_sheet(sheetData);

  // Column widths
  ws['!cols'] = [
    { wch: 14 },
    { wch: 22 },
    { wch: 22 },
    { wch: 24 },
    { wch: 32 },
  ];

  // Merge title row across columns
  ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Audit Report');

  const filename = `OliveIoT_Audit_${(meterLabel || 'AllMeters').replace(/\s+/g, '_')}_${startDate}_to_${endDate}.xlsx`;
  XLSX.writeFile(wb, filename);
  return filename;
}