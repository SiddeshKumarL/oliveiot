import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useIoT } from '../context/IoTContext';
import { Activity, Cpu, RefreshCw, Zap, Compass, AlertCircle, Gauge, FlaskConical } from 'lucide-react';

const LiveMonitoring = () => {
  const { meters } = useIoT();
  const locationState = useLocation();
  const initialMeterId = locationState.state?.initialMeterId || '';
  const onlineMeters = meters.filter(m => m.status === 'Online');
  const [selectedMeterId, setSelectedMeterId] = useState(
    initialMeterId || (onlineMeters.length > 0 ? onlineMeters[0].id : '')
  );

  const activeMeter = meters.find(m => m.id === selectedMeterId);

  useEffect(() => {
    if (!selectedMeterId && onlineMeters.length > 0) {
      setSelectedMeterId(onlineMeters[0].id);
    }
  }, [meters, selectedMeterId]);

  const calculateKw = (m) => {
    if (!m || m.status === 'Offline') return 0;
    return parseFloat(((m.voltage * m.current * 1.732 * m.powerFactor) / 1000).toFixed(2));
  };

  const getPFColor = (pf) => {
    if (pf >= 0.9) return 'text-primary';
    if (pf >= 0.8) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPFBg = (pf) => {
    if (pf >= 0.9) return 'bg-primary/10 border-primary/20 text-primary';
    if (pf >= 0.8) return 'bg-yellow-50 border-yellow-200 text-yellow-700';
    return 'bg-red-50 border-red-200 text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-main flex items-center gap-3">
            Live Monitoring
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          </h1>
          <p className="text-sm text-text-muted mt-1">Real-time three-phase electrical parameters — updated every 5 seconds.</p>
        </div>
        <div className="flex items-center gap-2 bg-background-lowest border border-outline/10 p-2 rounded-stitch shadow-stitch w-full sm:w-auto">
          <Cpu className="w-4 h-4 text-text-muted shrink-0" />
          <select
            value={selectedMeterId}
            onChange={(e) => setSelectedMeterId(e.target.value)}
            className="text-xs font-semibold text-text-main bg-transparent border-none focus:outline-none focus:ring-0 w-full"
          >
            {onlineMeters.length === 0 ? (
              <option value="">No Online Meters</option>
            ) : (
              onlineMeters.map(m => (
                <option key={m.id} value={m.id}>{m.name} — {m.id}</option>
              ))
            )}
          </select>
        </div>
      </div>

      {!activeMeter ? (
        <div className="py-20 text-center border-2 border-dashed border-outline/20 rounded-stitch bg-background-container/20">
          <Activity className="w-12 h-12 text-text-muted/40 mx-auto mb-3" />
          <p className="text-sm font-semibold text-text-muted">No online meters available. Please check meter connectivity.</p>
        </div>
      ) : (
        <>
          {/* Meter Status Bar */}
          <div className="bg-background-lowest border border-outline/10 rounded-stitch shadow-stitch p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-50 text-green-600 border border-green-200">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-text-main">{activeMeter.name}</p>
                <p className="text-xs text-text-muted">{activeMeter.id} · {activeMeter.location} · {activeMeter.siteName}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-green-700 font-semibold">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Online — Streaming
              </div>
              <div className="flex items-center gap-1.5 text-text-muted font-medium">
                <RefreshCw className="w-3.5 h-3.5 text-primary animate-spin" style={{ animationDuration: '5s' }} />
                Auto-refresh every 5s
              </div>
              <span className="font-mono text-[10px] bg-background-high px-2 py-1 rounded text-text-muted">
                {new Date(activeMeter.lastUpdated).toLocaleTimeString()}
              </span>
            </div>
          </div>

          {/* ===== 10 PARAMETER CARDS ===== */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* R Phase Voltage */}
            <div className="bg-background-lowest border border-red-200/60 rounded-stitch shadow-stitch p-4 flex flex-col gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">R Phase Voltage</span>
              </div>
              <span className="text-2xl font-black text-red-600">{activeMeter.phases.voltageR.toFixed(1)}</span>
              <span className="text-xs text-text-muted font-semibold">Volts (L-N)</span>
              <div className="w-full bg-red-100 h-1.5 rounded-full">
                <div className="bg-red-500 h-1.5 rounded-full transition-all duration-700" style={{ width: `${(activeMeter.phases.voltageR / 260) * 100}%` }} />
              </div>
            </div>

            {/* Y Phase Voltage */}
            <div className="bg-background-lowest border border-yellow-200/60 rounded-stitch shadow-stitch p-4 flex flex-col gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 shrink-0" />
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Y Phase Voltage</span>
              </div>
              <span className="text-2xl font-black text-yellow-600">{activeMeter.phases.voltageY.toFixed(1)}</span>
              <span className="text-xs text-text-muted font-semibold">Volts (L-N)</span>
              <div className="w-full bg-yellow-100 h-1.5 rounded-full">
                <div className="bg-yellow-500 h-1.5 rounded-full transition-all duration-700" style={{ width: `${(activeMeter.phases.voltageY / 260) * 100}%` }} />
              </div>
            </div>

            {/* B Phase Voltage */}
            <div className="bg-background-lowest border border-blue-200/60 rounded-stitch shadow-stitch p-4 flex flex-col gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">B Phase Voltage</span>
              </div>
              <span className="text-2xl font-black text-blue-600">{activeMeter.phases.voltageB.toFixed(1)}</span>
              <span className="text-xs text-text-muted font-semibold">Volts (L-N)</span>
              <div className="w-full bg-blue-100 h-1.5 rounded-full">
                <div className="bg-blue-500 h-1.5 rounded-full transition-all duration-700" style={{ width: `${(activeMeter.phases.voltageB / 260) * 100}%` }} />
              </div>
            </div>

            {/* R Phase Current */}
            <div className="bg-background-lowest border border-red-200/40 rounded-stitch shadow-stitch p-4 flex flex-col gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400 shrink-0" />
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">R Phase Current</span>
              </div>
              <span className="text-2xl font-black text-red-500">{activeMeter.phases.currentR.toFixed(1)}</span>
              <span className="text-xs text-text-muted font-semibold">Amperes</span>
              <div className="w-full bg-red-100 h-1.5 rounded-full">
                <div className="bg-red-400 h-1.5 rounded-full transition-all duration-700" style={{ width: `${Math.min(100, (activeMeter.phases.currentR / 150) * 100)}%` }} />
              </div>
            </div>

            {/* Y Phase Current */}
            <div className="bg-background-lowest border border-yellow-200/40 rounded-stitch shadow-stitch p-4 flex flex-col gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 shrink-0" />
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Y Phase Current</span>
              </div>
              <span className="text-2xl font-black text-yellow-600">{activeMeter.phases.currentY.toFixed(1)}</span>
              <span className="text-xs text-text-muted font-semibold">Amperes</span>
              <div className="w-full bg-yellow-100 h-1.5 rounded-full">
                <div className="bg-yellow-400 h-1.5 rounded-full transition-all duration-700" style={{ width: `${Math.min(100, (activeMeter.phases.currentY / 150) * 100)}%` }} />
              </div>
            </div>

            {/* B Phase Current */}
            <div className="bg-background-lowest border border-blue-200/40 rounded-stitch shadow-stitch p-4 flex flex-col gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400 shrink-0" />
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">B Phase Current</span>
              </div>
              <span className="text-2xl font-black text-blue-500">{activeMeter.phases.currentB.toFixed(1)}</span>
              <span className="text-xs text-text-muted font-semibold">Amperes</span>
              <div className="w-full bg-blue-100 h-1.5 rounded-full">
                <div className="bg-blue-400 h-1.5 rounded-full transition-all duration-700" style={{ width: `${Math.min(100, (activeMeter.phases.currentB / 150) * 100)}%` }} />
              </div>
            </div>

            {/* kW — Active Power */}
            <div className="bg-background-lowest border border-primary/20 rounded-stitch shadow-stitch p-4 flex flex-col gap-2">
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Active Power</span>
              </div>
              <span className="text-2xl font-black text-primary">{calculateKw(activeMeter)}</span>
              <span className="text-xs text-text-muted font-semibold">Kilowatts (kW)</span>
              <div className="w-full bg-primary/10 h-1.5 rounded-full">
                <div className="bg-primary h-1.5 rounded-full transition-all duration-700" style={{ width: `${Math.min(100, (calculateKw(activeMeter) / 100) * 100)}%` }} />
              </div>
            </div>

            {/* kWh — Accumulated Energy */}
            <div className="bg-background-lowest border border-tertiary/20 rounded-stitch shadow-stitch p-4 flex flex-col gap-2">
              <div className="flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-tertiary shrink-0" />
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Energy (kWh)</span>
              </div>
              <span className="text-xl font-black text-tertiary font-mono">
                {activeMeter.kwh.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
              </span>
              <span className="text-xs text-text-muted font-semibold">kWh Accumulated</span>
              <div className="mt-1 text-[9px] text-tertiary/70 font-bold uppercase tracking-wider">Cumulative index</div>
            </div>

            {/* Frequency */}
            <div className="bg-background-lowest border border-indigo-200/40 rounded-stitch shadow-stitch p-4 flex flex-col gap-2">
              <div className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Frequency</span>
              </div>
              <span className="text-2xl font-black text-indigo-600">{activeMeter.frequency.toFixed(2)}</span>
              <span className="text-xs text-text-muted font-semibold">Hertz (Hz)</span>
              <div className="w-full bg-indigo-100 h-1.5 rounded-full">
                <div className="bg-indigo-500 h-1.5 rounded-full transition-all duration-700"
                  style={{ width: `${((activeMeter.frequency - 49.5) / 1) * 100}%` }} />
              </div>
            </div>

            {/* Power Factor */}
            <div className={`bg-background-lowest rounded-stitch shadow-stitch p-4 flex flex-col gap-2 border ${getPFBg(activeMeter.powerFactor)}`}>
              <div className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Power Factor</span>
              </div>
              <span className="text-2xl font-black">{activeMeter.powerFactor.toFixed(3)}</span>
              <span className="text-xs font-semibold opacity-70">Lagging — PF Index</span>
              <div className={`text-[9px] font-black uppercase tracking-wider ${activeMeter.powerFactor >= 0.9 ? 'text-primary' : activeMeter.powerFactor >= 0.8 ? 'text-yellow-600' : 'text-red-600'}`}>
                {activeMeter.powerFactor >= 0.9 ? '✓ Optimal' : activeMeter.powerFactor >= 0.8 ? '⚠ Below Target' : '✗ Poor — Action Required'}
              </div>
            </div>
          </div>

          {/* Average Summary Footer */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-background-lowest border border-outline/10 rounded-stitch shadow-stitch p-4 text-center">
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Avg. Voltage</p>
              <p className="text-lg font-black text-text-main">{activeMeter.voltage.toFixed(1)} V</p>
            </div>
            <div className="bg-background-lowest border border-outline/10 rounded-stitch shadow-stitch p-4 text-center">
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Avg. Current</p>
              <p className="text-lg font-black text-text-main">{activeMeter.current.toFixed(1)} A</p>
            </div>
            <div className="bg-background-lowest border border-outline/10 rounded-stitch shadow-stitch p-4 text-center">
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Meter Site</p>
              <p className="text-lg font-black text-text-main truncate">{activeMeter.siteName}</p>
            </div>
            <div className="bg-background-lowest border border-outline/10 rounded-stitch shadow-stitch p-4 text-center">
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Grid Status</p>
              <p className={`text-sm font-black ${activeMeter.powerFactor < 0.76 ? 'text-yellow-600' : 'text-primary'}`}>
                {activeMeter.powerFactor < 0.76 ? 'PF Warning' : 'All Normal'}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LiveMonitoring;
