import React, { useState, useEffect } from 'react';
import { useIoT } from '../context/IoTContext';
import { FileSpreadsheet, Download, RefreshCw, FileText, CheckCircle2 } from 'lucide-react';
import { exportReportToPDF, exportReportToExcel } from '../utils/reportExport';

const ReportsPage = () => {
  const { sites, meters } = useIoT();

  // Filters
  const [selectedSite, setSelectedSite] = useState('All');
  const [selectedMeter, setSelectedMeter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [generating, setGenerating] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [exportMessage, setExportMessage] = useState('');

  // Set default dates to past week
  useEffect(() => {
    const today = new Date();
    const lastWeek = new Date(Date.now() - 7 * 24 * 3600 * 1000);
    setStartDate(lastWeek.toISOString().substring(0, 10));
    setEndDate(today.toISOString().substring(0, 10));
  }, []);

  // Filter available meters based on selected site
  const availableMeters = meters.filter(m => selectedSite === 'All' || m.siteId === selectedSite);

  // If selectedSite changes and selectedMeter is not in the filtered list, reset it
  useEffect(() => {
    if (selectedSite !== 'All') {
      const match = availableMeters.some(m => m.id === selectedMeter);
      if (!match && selectedMeter !== 'All') {
        setSelectedMeter('All');
      }
    }
  }, [selectedSite]);

  // Handle report generation
  const handleGenerate = (e) => {
    e.preventDefault();
    setGenerating(true);

    setTimeout(() => {
      // Simulate generating 7 days of audit records
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

      // Base usage based on selected meter
      let baseUsage = 120; // kWh average per day
      if (selectedMeter !== 'All') {
        const meterObj = meters.find(m => m.id === selectedMeter);
        if (meterObj) {
          if (meterObj.name.includes('Main Grid')) baseUsage = 850;
          else if (meterObj.name.includes('CNC')) baseUsage = 240;
          else if (meterObj.name.includes('Welding')) baseUsage = 310;
          else if (meterObj.name.includes('Cold')) baseUsage = 420;
          else if (meterObj.name.includes('HVAC')) baseUsage = 150;
        }
      }

      const generatedRows = [];
      let cumulativeKwh = 10000; // starting pivot

      for (let i = 0; i <= diffDays; i++) {
        const recordDate = new Date(start);
        recordDate.setDate(start.getDate() + i);
        if (recordDate > end) break;

        const dayOfWeek = recordDate.getDay();
        const factor = dayOfWeek === 0 ? 0.2 : dayOfWeek === 6 ? 0.5 : 1.0; // low load on weekends
        const dailyUsage = parseFloat((baseUsage * factor + (Math.random() - 0.5) * (baseUsage * 0.1)).toFixed(1));
        
        const startKwh = cumulativeKwh;
        const endKwh = startKwh + dailyUsage;
        cumulativeKwh = endKwh;

        let remarks = 'Operational Shift Normal';
        if (dayOfWeek === 0) remarks = 'Plant Idle / Maintenance Standby';
        else if (dailyUsage > baseUsage * 1.05) remarks = 'Peak Manufacturing Load Detected';

        generatedRows.push({
          date: recordDate.toISOString().substring(0, 10),
          startKwh: parseFloat(startKwh.toFixed(1)),
          endKwh: parseFloat(endKwh.toFixed(1)),
          usage: dailyUsage,
          remarks
        });
      }

      setReportData(generatedRows.reverse());
      setGenerating(false);
    }, 1200);
  };

  const handleExport = (type) => {
    if (reportData.length === 0) return;

    const siteObj = sites.find(s => s.id === selectedSite);
    const meterObj = meters.find(m => m.id === selectedMeter);
    const siteLabel = selectedSite === 'All' ? 'All Plants' : (siteObj?.name || selectedSite);
    const meterLabel = selectedMeter === 'All' ? 'All Associated Meters' : (meterObj?.name || selectedMeter);

    const meta = { siteLabel, meterLabel, startDate, endDate };

    try {
      const filename = type === 'PDF'
        ? exportReportToPDF(reportData, meta)
        : exportReportToExcel(reportData, meta);

      setExportMessage(`${type} audit file "${filename}" downloaded successfully.`);
    } catch (err) {
      console.error('Export failed:', err);
      setExportMessage(`Failed to generate ${type} export. Please try again.`);
    }

    setTimeout(() => {
      setExportMessage('');
    }, 4000);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-main font-serif">
            System Auditing & Reports
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Query sensory telemetry archives and compile structured consumption reports.
          </p>
        </div>
      </div>

      {/* Export Alert banner */}
      {exportMessage && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-stitch text-xs text-green-800 font-bold shadow-sm animate-bounce">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-primary" />
          <span>{exportMessage}</span>
        </div>
      )}

      {/* Filter Options */}
      <form onSubmit={handleGenerate} className="bg-background-lowest border border-outline/10 p-6 rounded-stitch shadow-stitch grid grid-cols-1 sm:grid-cols-5 gap-4 items-end">
        {/* Plant */}
        <div>
          <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1">
            Plant Zone
          </label>
          <select
            value={selectedSite}
            onChange={(e) => setSelectedSite(e.target.value)}
            className="w-full pl-3 pr-8 py-2 bg-background-container border border-outline/10 rounded-stitch text-xs text-text-main focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="All">All Plants</option>
            {sites.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        {/* Meter */}
        <div>
          <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1">
            Energy Meter
          </label>
          <select
            value={selectedMeter}
            onChange={(e) => setSelectedMeter(e.target.value)}
            className="w-full pl-3 pr-8 py-2 bg-background-container border border-outline/10 rounded-stitch text-xs text-text-main focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="All">All Associated Meters</option>
            {availableMeters.map(m => (
              <option key={m.id} value={m.id}>{m.name} ({m.id})</option>
            ))}
          </select>
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1">
            Start Date
          </label>
          <input
            type="date"
            required
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-1.5 bg-background-container border border-outline/10 rounded-stitch text-xs text-text-main focus:outline-none"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1">
            End Date
          </label>
          <input
            type="date"
            required
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-1.5 bg-background-container border border-outline/10 rounded-stitch text-xs text-text-main focus:outline-none"
          />
        </div>

        {/* Buttons */}
        <div>
          <button
            type="submit"
            disabled={generating}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white text-xs font-bold rounded-stitch shadow hover:bg-primary/95 transition-all"
          >
            {generating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Compiling...
              </>
            ) : (
              <>
                <FileSpreadsheet className="w-3.5 h-3.5" />
                Compile Report
              </>
            )}
          </button>
        </div>
      </form>

      {/* Reports Table / Output */}
      {reportData.length > 0 && (
        <div className="bg-background-lowest border border-outline/10 rounded-stitch shadow-stitch overflow-hidden">
          {/* Action Buttons */}
          <div className="p-4 bg-background-container/20 border-b border-outline/10 flex justify-between items-center">
            <span className="text-xs font-bold text-text-main">Generated Query Results ({reportData.length} records)</span>
            
            <div className="flex gap-2">
              <button
                onClick={() => handleExport('PDF')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-background-lowest border border-outline/10 hover:bg-background-high text-red-600 rounded-md text-[10px] font-bold transition-all"
              >
                <FileText className="w-3.5 h-3.5" />
                Export PDF
              </button>
              <button
                onClick={() => handleExport('Excel')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-background-lowest border border-outline/10 hover:bg-background-high text-primary rounded-md text-[10px] font-bold transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                Export Excel
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-background-container/45 text-text-muted text-[10px] uppercase font-bold tracking-wider border-b border-outline/10">
                  <th className="py-3 px-4">Audit Date</th>
                  <th className="py-3 px-4 text-right">Start Meter Index (kWh)</th>
                  <th className="py-3 px-4 text-right">End Meter Index (kWh)</th>
                  <th className="py-3 px-4 text-right">Total Net Consumption</th>
                  <th className="py-3 px-4">Shift Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline/10 text-xs font-semibold">
                {reportData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-background-high/35 transition-colors">
                    <td className="py-3 px-4 text-text-main">{row.date}</td>
                    <td className="py-3 px-4 text-right text-text-muted font-mono">{row.startKwh.toLocaleString(undefined, { minimumFractionDigits: 1 })}</td>
                    <td className="py-3 px-4 text-right text-text-muted font-mono">{row.endKwh.toLocaleString(undefined, { minimumFractionDigits: 1 })}</td>
                    <td className="py-3 px-4 text-right text-primary font-mono font-bold">+{row.usage.toLocaleString(undefined, { minimumFractionDigits: 1 })} kWh</td>
                    <td className="py-3 px-4 text-text-muted font-normal">{row.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {reportData.length === 0 && !generating && (
        <div className="py-16 text-center border border-dashed border-outline/25 rounded-stitch bg-background-container/20">
          <FileSpreadsheet className="w-12 h-12 text-text-muted/50 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-text-main">No Report Generated Yet</h3>
          <p className="text-xs text-text-muted mt-1">Configure the plant parameters and date ranges above to compile energy audits.</p>
        </div>
      )}

    </div>
  );
};

export default ReportsPage;
