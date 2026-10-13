import React, { useState } from 'react';
import { useIoT } from '../context/IoTContext';
import { BellRing, ShieldAlert, CheckCircle, Clock, Check } from 'lucide-react';

const AlertsPage = () => {
  const { user, alerts, acknowledgeAlert } = useIoT();
  const [filter, setFilter] = useState('All'); // 'All' | 'Active' | 'Acknowledged'

  const isViewer = user?.role === 'Viewer' || user?.role === 'Viewer / Client';

  // Filters
  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'Active') return alert.status === 'Active';
    if (filter === 'Acknowledged') return alert.status === 'Acknowledged';
    return true;
  });

  const getSeverityStyle = (severity) => {
    switch (severity) {
      case 'Critical': return 'bg-red-50 text-red-700 border-red-200';
      case 'Warning': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default: return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const handleAcknowledge = (id) => {
    if (isViewer) return;
    acknowledgeAlert(id);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-main font-serif">
            Grid Failures & Alerts Log
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Track threshold crossings, voltage anomalies, power factor drops, and meter communication states.
          </p>
        </div>
      </div>

      {/* Tabs / Filters */}
      <div className="flex justify-between items-center bg-background-lowest border border-outline/10 p-2 rounded-stitch shadow-stitch">
        <div className="flex gap-2">
          {['All', 'Active', 'Acknowledged'].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-4 py-1.5 rounded-stitch text-xs font-bold transition-all duration-200
                ${filter === t 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'text-text-muted hover:bg-background-high hover:text-text-main'}`}
            >
              {t} Alerts ({
                t === 'All' ? alerts.length :
                t === 'Active' ? alerts.filter(a => a.status === 'Active').length :
                alerts.filter(a => a.status === 'Acknowledged').length
              })
            </button>
          ))}
        </div>

        {isViewer && (
          <span className="text-[10px] text-yellow-600 bg-yellow-50 px-2.5 py-1 rounded border border-yellow-100 font-bold">
            Viewer Mode: Acknowledging locked
          </span>
        )}
      </div>

      {/* Table Container */}
      <div className="bg-background-lowest border border-outline/10 rounded-stitch shadow-stitch overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background-container/45 text-text-muted text-[10px] uppercase font-bold tracking-wider border-b border-outline/10">
                <th className="py-3 px-4">Alert Type</th>
                <th className="py-3 px-4">Meter / Panel</th>
                <th className="py-3 px-4">Industrial Site</th>
                <th className="py-3 px-4 text-center">Severity</th>
                <th className="py-3 px-4">Time Triggered</th>
                <th className="py-3 px-4 text-center">Acknowledge Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline/10 text-xs font-semibold">
              {filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-text-muted italic bg-background-container/10">
                    No alerts in this log category.
                  </td>
                </tr>
              ) : (
                filteredAlerts.map((alert) => {
                  const isActive = alert.status === 'Active';
                  return (
                    <tr key={alert.id} className="hover:bg-background-high/35 transition-colors">
                      {/* Alert Type */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <BellRing className={`w-4 h-4 shrink-0 ${isActive ? 'text-red-500 animate-pulse' : 'text-text-muted'}`} />
                          <span className="font-bold text-text-main">{alert.type}</span>
                        </div>
                      </td>

                      {/* Meter name */}
                      <td className="py-4 px-4 text-text-main">
                        {alert.meterName}
                      </td>

                      {/* Site name */}
                      <td className="py-4 px-4 text-text-muted">
                        {alert.siteName}
                      </td>

                      {/* Severity */}
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${getSeverityStyle(alert.severity)}`}>
                          {alert.severity}
                        </span>
                      </td>

                      {/* Time */}
                      <td className="py-4 px-4 text-text-muted">
                        <div className="flex items-center gap-1.5 font-normal">
                          <Clock className="w-3.5 h-3.5 text-secondary/60 shrink-0" />
                          <span>{new Date(alert.time).toLocaleDateString()} {new Date(alert.time).toLocaleTimeString()}</span>
                        </div>
                      </td>

                      {/* Acknowledge Status */}
                      <td className="py-4 px-4 text-center">
                        {isActive ? (
                          <span className="inline-flex items-center gap-1 text-[10px] text-red-600 bg-red-50 border border-red-200/50 px-2 py-0.5 rounded-full font-bold">
                            <ShieldAlert className="w-3 h-3 shrink-0" />
                            Active Alert
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] text-green-700 bg-green-50 border border-green-200/50 px-2 py-0.5 rounded-full font-bold">
                            <CheckCircle className="w-3 h-3 shrink-0" />
                            Resolved / Ack
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-center">
                        {isActive ? (
                          <button
                            onClick={() => handleAcknowledge(alert.id)}
                            disabled={isViewer}
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-md text-[10px] font-bold transition-all
                              ${isViewer 
                                ? 'bg-background-container text-text-muted border border-outline/10 cursor-not-allowed' 
                                : 'bg-primary text-white hover:bg-primary/95 shadow-sm'}`}
                          >
                            <Check className="w-3.5 h-3.5" />
                            Acknowledge
                          </button>
                        ) : (
                          <span className="text-text-muted font-normal text-[10px] italic">No Action Needed</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AlertsPage;
