import React, { useState } from 'react';
import { useIoT } from '../context/IoTContext';
import { Cpu, Search, Filter, RefreshCw, Wifi, WifiOff, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const MeterList = () => {
  const { meters, sites } = useIoT();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSite, setSelectedSite] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const filteredMeters = meters.filter((meter) => {
    const matchesSearch =
      meter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meter.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meter.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSite = selectedSite === 'All' || meter.siteId === selectedSite;
    const matchesStatus = selectedStatus === 'All' || meter.status === selectedStatus;
    return matchesSearch && matchesSite && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-main">Energy Meters</h1>
          <p className="text-sm text-text-muted mt-1">All registered energy meters across sites with live telemetry data.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-stitch">
          <Cpu className="w-3.5 h-3.5" />
          {meters.filter(m => m.status === 'Online').length} / {meters.length} Online
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-background-lowest border border-outline/10 rounded-stitch shadow-stitch">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ID, name or location..."
            className="w-full pl-10 pr-4 py-2 bg-background-container border border-outline/10 rounded-stitch text-xs text-text-main placeholder-text-muted/60 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
          />
        </div>
        <div className="relative">
          <select
            value={selectedSite}
            onChange={(e) => setSelectedSite(e.target.value)}
            className="w-full pl-3 pr-8 py-2 bg-background-container border border-outline/10 rounded-stitch text-xs text-text-main focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
          >
            <option value="All">All Sites</option>
            {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <Filter className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
        </div>
        <div className="relative">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full pl-3 pr-8 py-2 bg-background-container border border-outline/10 rounded-stitch text-xs text-text-main focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
          >
            <option value="All">All Statuses</option>
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
          </select>
          <Filter className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-background-lowest border border-outline/10 rounded-stitch shadow-stitch overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[1100px]">
            <thead>
              <tr className="bg-background-container/50 border-b border-outline/10">
                <th className="py-3 px-4 text-[10px] font-black text-text-muted uppercase tracking-wider">Meter ID</th>
                <th className="py-3 px-4 text-[10px] font-black text-text-muted uppercase tracking-wider">Meter Name</th>
                <th className="py-3 px-4 text-[10px] font-black text-text-muted uppercase tracking-wider">Site Name</th>
                <th className="py-3 px-4 text-[10px] font-black text-text-muted uppercase tracking-wider">Location</th>
                <th className="py-3 px-4 text-[10px] font-black text-text-muted uppercase tracking-wider text-right">Voltage (V)</th>
                <th className="py-3 px-4 text-[10px] font-black text-text-muted uppercase tracking-wider text-right">Current (A)</th>
                <th className="py-3 px-4 text-[10px] font-black text-text-muted uppercase tracking-wider text-right">PF</th>
                <th className="py-3 px-4 text-[10px] font-black text-text-muted uppercase tracking-wider text-right">Freq (Hz)</th>
                <th className="py-3 px-4 text-[10px] font-black text-text-muted uppercase tracking-wider text-right">kWh</th>
                <th className="py-3 px-4 text-[10px] font-black text-text-muted uppercase tracking-wider text-center">Status</th>
                <th className="py-3 px-4 text-[10px] font-black text-text-muted uppercase tracking-wider">Last Updated</th>
                <th className="py-3 px-4 text-[10px] font-black text-text-muted uppercase tracking-wider text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline/8">
              {filteredMeters.length === 0 ? (
                <tr>
                  <td colSpan="12" className="py-10 text-center text-sm text-text-muted italic">
                    No meters found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredMeters.map((meter) => {
                  const isOnline = meter.status === 'Online';
                  return (
                    <tr key={meter.id} className="hover:bg-background-high/30 transition-colors text-xs font-semibold">
                      <td className="py-3.5 px-4 font-mono text-[11px] text-text-muted">{meter.id}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded ${isOnline ? 'bg-primary/10 text-primary' : 'bg-background-high text-text-muted'}`}>
                            <Cpu className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-bold text-text-main">{meter.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-text-muted">{meter.siteName}</td>
                      <td className="py-3.5 px-4 text-text-muted">{meter.location}</td>
                      <td className="py-3.5 px-4 text-right text-text-main font-mono">
                        {isOnline ? meter.voltage.toFixed(1) : '—'}
                      </td>
                      <td className="py-3.5 px-4 text-right text-text-main font-mono">
                        {isOnline ? meter.current.toFixed(1) : '—'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {isOnline ? (
                          <span className={meter.powerFactor < 0.8 ? 'text-yellow-600 font-black' : 'text-text-main font-mono'}>
                            {meter.powerFactor.toFixed(2)}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="py-3.5 px-4 text-right text-text-main font-mono">
                        {isOnline ? meter.frequency.toFixed(2) : '—'}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-primary">
                        {meter.kwh.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                          isOnline
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-red-50 text-red-600 border-red-200'
                        }`}>
                          {isOnline ? <Wifi className="w-2.5 h-2.5" /> : <WifiOff className="w-2.5 h-2.5" />}
                          {meter.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 text-[10px] text-text-muted font-normal">
                          <Clock className="w-3 h-3 shrink-0" />
                          <span>{new Date(meter.lastUpdated).toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <Link
                          to="/live"
                          state={{ initialMeterId: meter.id }}
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded transition-all
                            ${isOnline
                              ? 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
                              : 'bg-background-high text-text-muted cursor-not-allowed'
                            }`}
                        >
                          <RefreshCw className="w-3 h-3" />
                          Monitor
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {/* Footer count */}
        <div className="px-4 py-3 border-t border-outline/10 bg-background-container/20 flex justify-between items-center">
          <span className="text-[10px] text-text-muted font-semibold">
            Showing {filteredMeters.length} of {meters.length} meters
          </span>
          <span className="text-[10px] text-text-muted font-semibold">
            {meters.filter(m => m.status === 'Online').length} online · {meters.filter(m => m.status === 'Offline').length} offline
          </span>
        </div>
      </div>
    </div>
  );
};

export default MeterList;
