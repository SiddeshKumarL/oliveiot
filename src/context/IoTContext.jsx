import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';

const IoTContext = createContext();

// Helper to load state from localStorage or fallback to defaults
const getInitialState = (key, defaultValue) => {
  const saved = localStorage.getItem(key);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error(`Error parsing localStorage key "${key}":`, e);
    }
  }
  return defaultValue;
};

export const IoTProvider = ({ children }) => {
  // 1. Authentication State
  const [user, setUser] = useState(() => getInitialState('oliveiot_user', null));

  // 2. Sites State
  const [sites, setSites] = useState(() => getInitialState('oliveiot_sites', [
    { id: 'site-1', name: 'Chennai Plant Main', location: 'Guindy, Chennai', contactPerson: 'R. Vignesh', status: 'Active', lastUpdated: new Date().toISOString() },
    { id: 'site-2', name: 'Coimbatore Assembly Unit', location: 'Peelamedu, Coimbatore', contactPerson: 'K. Sundar', status: 'Active', lastUpdated: new Date().toISOString() },
    { id: 'site-3', name: 'Madurai Distribution Center', location: 'Kappalur, Madurai', contactPerson: 'M. Rajesh', status: 'Active', lastUpdated: new Date().toISOString() },
    { id: 'site-4', name: 'Trichy Fabrication Lab', location: 'Thuvakudi, Trichy', contactPerson: 'S. Kumar', status: 'Inactive', lastUpdated: new Date().toISOString() }
  ]));

  // 3. Meters State
  const [meters, setMeters] = useState(() => getInitialState('oliveiot_meters', [
    {
      id: 'MTR-101',
      name: 'Main Grid Incomer',
      siteId: 'site-1',
      siteName: 'Chennai Plant Main',
      location: 'Substation Panel A',
      status: 'Online',
      lastUpdated: new Date().toISOString(),
      kwh: 45281.3,
      voltage: 238.2,
      current: 124.5,
      powerFactor: 0.94,
      frequency: 50.02,
      phases: {
        voltageR: 238.2, voltageY: 239.1, voltageB: 237.5,
        currentR: 122.1, currentY: 125.4, currentB: 126.0
      }
    },
    {
      id: 'MTR-102',
      name: 'CNC Machine Feed',
      siteId: 'site-1',
      siteName: 'Chennai Plant Main',
      location: 'Workshop Bay 2',
      status: 'Online',
      lastUpdated: new Date().toISOString(),
      kwh: 12405.8,
      voltage: 236.5,
      current: 82.0,
      powerFactor: 0.81,
      frequency: 49.98,
      phases: {
        voltageR: 236.5, voltageY: 235.9, voltageB: 237.1,
        currentR: 80.5, currentY: 82.8, currentB: 82.7
      }
    },
    {
      id: 'MTR-103',
      name: 'Assembly Line A',
      siteId: 'site-2',
      siteName: 'Coimbatore Assembly Unit',
      location: 'Main Assembly Hall',
      status: 'Online',
      lastUpdated: new Date().toISOString(),
      kwh: 8942.2,
      voltage: 239.8,
      current: 45.3,
      powerFactor: 0.74,
      frequency: 50.01,
      phases: {
        voltageR: 239.8, voltageY: 240.2, voltageB: 239.4,
        currentR: 44.2, currentY: 46.1, currentB: 45.6
      }
    },
    {
      id: 'MTR-104',
      name: 'Robotic Welding Panel',
      siteId: 'site-2',
      siteName: 'Coimbatore Assembly Unit',
      location: 'Welding Section',
      status: 'Online',
      lastUpdated: new Date().toISOString(),
      kwh: 18239.4,
      voltage: 237.9,
      current: 95.6,
      powerFactor: 0.88,
      frequency: 50.00,
      phases: {
        voltageR: 237.9, voltageY: 238.5, voltageB: 237.3,
        currentR: 94.1, currentY: 96.8, currentB: 95.9
      }
    },
    {
      id: 'MTR-105',
      name: 'Cold Storage Panel',
      siteId: 'site-3',
      siteName: 'Madurai Distribution Center',
      location: 'Compressor Room',
      status: 'Online',
      lastUpdated: new Date().toISOString(),
      kwh: 34120.1,
      voltage: 240.1,
      current: 68.2,
      powerFactor: 0.91,
      frequency: 50.03,
      phases: {
        voltageR: 240.1, voltageY: 240.8, voltageB: 239.5,
        currentR: 66.8, currentY: 69.1, currentB: 68.7
      }
    },
    {
      id: 'MTR-106',
      name: 'HVAC Main Unit',
      siteId: 'site-1',
      siteName: 'Chennai Plant Main',
      location: 'Utility Block',
      status: 'Offline',
      lastUpdated: new Date(Date.now() - 3600000).toISOString(),
      kwh: 7421.9,
      voltage: 0.0,
      current: 0.0,
      powerFactor: 0.0,
      frequency: 0.0,
      phases: {
        voltageR: 0.0, voltageY: 0.0, voltageB: 0.0,
        currentR: 0.0, currentY: 0.0, currentB: 0.0
      }
    },
    {
      id: 'MTR-107',
      name: 'Testing Panel',
      siteId: 'site-4',
      siteName: 'Trichy Fabrication Lab',
      location: 'Testing Room B',
      status: 'Offline',
      lastUpdated: new Date(Date.now() - 7200000).toISOString(),
      kwh: 521.4,
      voltage: 0.0,
      current: 0.0,
      powerFactor: 0.0,
      frequency: 0.0,
      phases: {
        voltageR: 0.0, voltageY: 0.0, voltageB: 0.0,
        currentR: 0.0, currentY: 0.0, currentB: 0.0
      }
    }
  ]));

  // 4. Alerts State
  const [alerts, setAlerts] = useState(() => getInitialState('oliveiot_alerts', [
    {
      id: 'alert-1',
      type: 'Over Current',
      meterName: 'CNC Machine Feed',
      siteName: 'Chennai Plant Main',
      severity: 'Critical',
      time: new Date(Date.now() - 300000).toISOString(),
      status: 'Active'
    },
    {
      id: 'alert-2',
      type: 'Low Power Factor',
      meterName: 'Assembly Line A',
      siteName: 'Coimbatore Assembly Unit',
      severity: 'Warning',
      time: new Date(Date.now() - 900000).toISOString(),
      status: 'Active'
    },
    {
      id: 'alert-3',
      type: 'Meter Offline',
      meterName: 'HVAC Main Unit',
      siteName: 'Chennai Plant Main',
      severity: 'Critical',
      time: new Date(Date.now() - 3600000).toISOString(),
      status: 'Acknowledged'
    }
  ]));

  // Backend Sync Helper Function
  const refreshData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const [fetchedSites, fetchedMeters, fetchedAlerts] = await Promise.all([
        api('/api/sites').catch(() => null),
        api('/api/meters').catch(() => null),
        api('/api/alerts').catch(() => null)
      ]);

      if (fetchedSites && fetchedSites.length > 0) {
        setSites(fetchedSites.map(s => ({
          id: s.id || s._id,
          name: s.name,
          location: s.location,
          contactPerson: s.contact || s.contactPerson || '',
          status: s.status || 'Active',
          lastUpdated: s.updatedAt || new Date().toISOString()
        })));
      }

      if (fetchedMeters && fetchedMeters.length > 0) {
        setMeters(fetchedMeters.map(m => ({
          id: m.meterId || m.id || m._id,
          name: m.name,
          siteId: m.siteId,
          siteName: m.siteName || m.siteId,
          location: m.location,
          status: m.status || 'Online',
          lastUpdated: m.updatedAt || new Date().toISOString(),
          kwh: m.kwh || 0,
          voltage: m.voltage || 238,
          current: m.current || 50,
          powerFactor: m.powerFactor || 0.9,
          frequency: m.frequency || 50.0,
          phases: m.phases || {
            voltageR: m.voltage || 238, voltageY: m.voltage || 238, voltageB: m.voltage || 238,
            currentR: m.current || 50, currentY: m.current || 50, currentB: m.current || 50
          }
        })));
      }

      if (fetchedAlerts && fetchedAlerts.length > 0) {
        setAlerts(fetchedAlerts.map(a => ({
          id: a._id || a.id,
          type: a.type,
          meterName: a.meter || a.meterName,
          siteName: a.siteId || a.siteName,
          severity: a.severity,
          time: a.triggeredAt || a.time || new Date().toISOString(),
          status: a.acknowledged ? 'Acknowledged' : (a.status || 'Active')
        })));
      }
    } catch (err) {
      console.error("Failed to sync backend data:", err.message);
    }
  };

  // Synchronize on mount if user token is active
  useEffect(() => {
    refreshData();
  }, []);

  // Save states to local storage on change
  useEffect(() => {
    localStorage.setItem('oliveiot_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('oliveiot_sites', JSON.stringify(sites));
  }, [sites]);

  useEffect(() => {
    localStorage.setItem('oliveiot_meters', JSON.stringify(meters));
  }, [meters]);

  useEffect(() => {
    localStorage.setItem('oliveiot_alerts', JSON.stringify(alerts));
  }, [alerts]);

  // 5-Second Real-Time Parameter Simulator
  useEffect(() => {
    if (meters.length === 0) return;

    const interval = setInterval(() => {
      setMeters(prevMeters => {
        return prevMeters.map(meter => {
          if (meter.status === 'Offline') return meter;

          const voltFlux = () => (Math.random() - 0.5) * 4;
          const currFlux = () => (Math.random() - 0.5) * 3;
          const pfFlux = () => (Math.random() - 0.5) * 0.01;

          const vr = Math.max(220, Math.min(245, (meter.phases?.voltageR || meter.voltage || 238) + voltFlux()));
          const vy = Math.max(220, Math.min(245, (meter.phases?.voltageY || meter.voltage || 238) + voltFlux()));
          const vb = Math.max(220, Math.min(245, (meter.phases?.voltageB || meter.voltage || 238) + voltFlux()));

          const cr = Math.max(1, (meter.phases?.currentR || meter.current || 50) + currFlux());
          const cy = Math.max(1, (meter.phases?.currentY || meter.current || 50) + currFlux());
          const cb = Math.max(1, (meter.phases?.currentB || meter.current || 50) + currFlux());

          const pf = Math.max(0.6, Math.min(1.0, (meter.powerFactor || 0.9) + pfFlux()));
          const freq = Math.max(49.8, Math.min(50.2, 50 + (Math.random() - 0.5) * 0.05));

          const avgVolt = parseFloat(((vr + vy + vb) / 3).toFixed(1));
          const avgCurr = parseFloat(((cr + cy + cb) / 3).toFixed(1));

          const kw = (avgVolt * avgCurr * 3 * pf) / 1000;
          const newKwh = parseFloat(((meter.kwh || 0) + (kw * 5) / 3600).toFixed(4));

          triggerDynamicAlerts(meter.name, meter.siteName, avgVolt, avgCurr, pf);

          return {
            ...meter,
            voltage: avgVolt,
            current: avgCurr,
            powerFactor: parseFloat(pf.toFixed(2)),
            frequency: parseFloat(freq.toFixed(2)),
            kwh: newKwh,
            lastUpdated: new Date().toISOString(),
            phases: {
              voltageR: parseFloat(vr.toFixed(1)),
              voltageY: parseFloat(vy.toFixed(1)),
              voltageB: parseFloat(vb.toFixed(1)),
              currentR: parseFloat(cr.toFixed(1)),
              currentY: parseFloat(cy.toFixed(1)),
              currentB: parseFloat(cb.toFixed(1))
            }
          };
        });
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [meters.length]);

  // Dynamic Alerts Generator
  const triggerDynamicAlerts = (meterName, siteName, avgVolt, avgCurr, pf) => {
    const newAlerts = [];

    if (avgVolt > 244) {
      newAlerts.push({
        type: 'High Voltage',
        meterName,
        siteName,
        severity: 'Warning',
        message: `High Voltage of ${avgVolt}V detected.`
      });
    } else if (avgVolt < 221) {
      newAlerts.push({
        type: 'Low Voltage',
        meterName,
        siteName,
        severity: 'Warning',
        message: `Low Voltage of ${avgVolt}V detected.`
      });
    }

    if (pf < 0.72) {
      newAlerts.push({
        type: 'Low Power Factor',
        meterName,
        siteName,
        severity: 'Warning',
        message: `Power factor dropped to ${pf.toFixed(2)}.`
      });
    }

    if (newAlerts.length > 0) {
      setAlerts(prev => {
        const filteredAlerts = newAlerts.filter(na => {
          const exists = prev.some(existing =>
            existing.type === na.type &&
            existing.meterName === na.meterName &&
            existing.status === 'Active'
          );
          return !exists;
        });

        if (filteredAlerts.length === 0) return prev;

        const createdAlerts = filteredAlerts.map(na => ({
          id: `alert-${Math.random().toString(36).substr(2, 9)}`,
          type: na.type,
          meterName: na.meterName,
          siteName: na.siteName,
          severity: na.severity,
          time: new Date().toISOString(),
          status: 'Active'
        }));

        return [...createdAlerts, ...prev];
      });
    }
  };

  // Auth Operations
  const login = (email, role) => {
    setUser({ email, role });
    refreshData();
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('oliveiot_user');
    setUser(null);
  };

  // Site Operations Connected to MongoDB Backend
  const addSite = async (siteData) => {
    const sitePayload = {
      id: siteData.id || `site-${Date.now()}`,
      name: siteData.name,
      location: siteData.location,
      contact: siteData.contactPerson || siteData.contact,
      status: siteData.status || 'Active'
    };

    try {
      const res = await api('/api/sites', {
        method: 'POST',
        body: JSON.stringify(sitePayload)
      });

      const newSite = {
        id: res.id || res._id || sitePayload.id,
        name: res.name || sitePayload.name,
        location: res.location || sitePayload.location,
        contactPerson: res.contact || sitePayload.contact,
        status: res.status || 'Active',
        lastUpdated: new Date().toISOString()
      };

      setSites(prev => [...prev, newSite]);
    } catch (err) {
      console.error("Backend error adding site:", err.message);
      // Fallback local update
      setSites(prev => [...prev, { ...sitePayload, contactPerson: sitePayload.contact, lastUpdated: new Date().toISOString() }]);
    }
  };

  const updateSite = async (id, updatedData) => {
    try {
      await api(`/api/sites/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: updatedData.name,
          location: updatedData.location,
          contact: updatedData.contactPerson || updatedData.contact,
          status: updatedData.status
        })
      });
    } catch (err) {
      console.error("Backend error updating site:", err.message);
    }

    setSites(prev => prev.map(site => site.id === id ? { ...site, ...updatedData, lastUpdated: new Date().toISOString() } : site));
  };

  const deleteSite = async (id) => {
    try {
      await api(`/api/sites/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error("Backend error deleting site:", err.message);
    }

    setSites(prev => prev.filter(site => site.id !== id));
    setMeters(prev => prev.map(m => m.siteId === id ? { ...m, status: 'Offline', siteName: 'Unassigned' } : m));
  };

  // Alert Operations Connected to MongoDB Backend
  const acknowledgeAlert = async (id) => {
    try {
      await api(`/api/alerts/${id}/ack`, { method: 'PATCH' });
    } catch (err) {
      console.error("Backend error acknowledging alert:", err.message);
    }

    setAlerts(prev => prev.map(alert => alert.id === id ? { ...alert, status: 'Acknowledged' } : alert));
  };

  return (
    <IoTContext.Provider value={{
      user,
      login,
      logout,
      sites,
      addSite,
      updateSite,
      deleteSite,
      meters,
      alerts,
      acknowledgeAlert,
      refreshData
    }}>
      {children}
    </IoTContext.Provider>
  );
};

export const useIoT = () => useContext(IoTContext);