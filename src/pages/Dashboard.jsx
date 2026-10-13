import React from 'react';
import { useIoT } from '../context/IoTContext';
import IoTFlowDiagram from '../components/IoTFlowDiagram';
import { 
  Building2, 
  Cpu, 
  Wifi, 
  WifiOff, 
  Zap, 
  CalendarDays, 
  AlertTriangle, 
  TrendingUp,
  Server,
  ShieldCheck,
  Wrench,
  Leaf,
  Check,
  Terminal,
  Activity,
  UserCheck
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { sites, meters, alerts, user, acknowledgeAlert } = useIoT();
  const userRole = user?.role || 'Viewer';

  // 1. Calculate Metrics dynamically
  const totalSites = sites.length;
  const totalMeters = meters.length;
  const onlineMeters = meters.filter(m => m.status === 'Online').length;
  const offlineMeters = meters.filter(m => m.status === 'Offline').length;
  
  const totalKwh = meters.reduce((acc, m) => acc + m.kwh, 0);
  const todayKwh = parseFloat((totalKwh * 0.08).toFixed(1)); 
  const monthlyKwh = parseFloat(totalKwh.toFixed(1));

  const activeAlerts = alerts.filter(a => a.status === 'Active');
  const activeAlertsCount = activeAlerts.length;

  const currentTotalKw = meters
    .filter(m => m.status === 'Online')
    .reduce((acc, m) => {
      const kw = (m.voltage * m.current * 1.732 * m.powerFactor) / 1000; 
      return acc + kw;
    }, 0);
  
  const peakLoadKw = parseFloat((currentTotalKw * 1.15).toFixed(1)); 

  // 2. Sample data for the dashboard mini-trend chart
  const trendData = [
    { time: '08:00', kwh: todayKwh * 0.4 },
    { time: '10:00', kwh: todayKwh * 0.55 },
    { time: '12:00', kwh: todayKwh * 0.75 },
    { time: '14:00', kwh: todayKwh * 0.9 },
    { time: '16:00', kwh: todayKwh * 0.98 },
    { time: '18:00', kwh: todayKwh }
  ];

  // Base metrics cards
  const cards = [
    { title: 'Total Sites', value: totalSites, icon: Building2, color: 'text-primary bg-primary/10', link: '/sites' },
    { title: 'Total Meters', value: totalMeters, icon: Cpu, color: 'text-secondary bg-secondary/10', link: '/meters' },
    { title: 'Online Meters', value: onlineMeters, icon: Wifi, color: 'text-green-600 bg-green-50', link: '/meters' },
    { title: 'Offline Meters', value: offlineMeters, icon: WifiOff, color: 'text-red-500 bg-red-50', link: '/meters' },
    { title: "Today's Energy", value: `${todayKwh.toLocaleString()} kWh`, icon: Zap, color: 'text-tertiary bg-tertiary/10', link: '/charts' },
    { title: 'Monthly Energy', value: `${monthlyKwh.toLocaleString()} kWh`, icon: CalendarDays, color: 'text-primary bg-primary/10', link: '/charts' },
    { title: 'Active Alerts', value: activeAlertsCount, icon: AlertTriangle, color: activeAlertsCount > 0 ? 'text-red-600 bg-red-50 border border-red-200/40 animate-pulse' : 'text-text-muted bg-background-high', link: '/alerts' },
    { title: 'Peak Load', value: `${peakLoadKw} kW`, icon: TrendingUp, color: 'text-indigo-600 bg-indigo-50', link: '/charts' }
  ];

  // Render role-specific welcome text
  const getWelcomeHeader = () => {
    switch (userRole) {
      case 'Super Admin':
        return {
          title: 'Super Admin Control Center',
          subtitle: 'Full administrative rights. Manage plant registers, hardware configurations, and global system health.',
          icon: Server,
          iconColor: 'text-red-600 bg-red-50'
        };
      case 'Site Admin':
        return {
          title: 'Site Operations Console',
          subtitle: 'Regional administrative rights. Monitor local sites, assign meters, and manage site superintendents.',
          icon: ShieldCheck,
          iconColor: 'text-tertiary bg-tertiary/10'
        };
      case 'Operator':
        return {
          title: 'Operator Telemetry Duty Station',
          subtitle: 'Operational duties. Live power grids monitor, phase balances, and threshold alerts acknowledgment.',
          icon: Wrench,
          iconColor: 'text-primary bg-primary/10'
        };
      case 'Viewer':
      default:
        return {
          title: 'Client Energy Analytics Dashboard',
          subtitle: 'Analytical access. Review energy efficiency index (EEI), load curves, and green carbon reduction scores.',
          icon: Leaf,
          iconColor: 'text-green-600 bg-green-50'
        };
    }
  };

  const headerMeta = getWelcomeHeader();
  const HeaderIcon = headerMeta.icon;

  return (
    <div className="space-y-6">
      {/* Top Welcome Title */}
      <div className="p-6 bg-background-lowest border border-outline/10 rounded-stitch shadow-stitch flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-stitch ${headerMeta.iconColor} shrink-0`}>
            <HeaderIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-main font-serif">
              {headerMeta.title}
            </h1>
            <p className="text-xs sm:text-sm text-text-muted mt-0.5">
              {headerMeta.subtitle}
            </p>
          </div>
        </div>
        
        {userRole !== 'Viewer' && (
          <div className="flex gap-2">
            <Link 
              to="/live" 
              className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-stitch shadow hover:bg-primary/95 transition-all shrink-0"
            >
              Launch Live Monitor
            </Link>
          </div>
        )}
      </div>

      {/* Grid of 8 Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link 
              key={idx}
              to={card.link}
              className="bg-background-lowest border border-outline/10 p-5 rounded-stitch shadow-stitch hover:border-primary/20 hover:shadow-md transition-all duration-200 flex flex-col justify-between h-32"
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">{card.title}</span>
                <div className={`p-2 rounded-lg ${card.color}`}>
                  <Icon className="w-5 h-5 shrink-0" />
                </div>
              </div>
              <div className="mt-2">
                <span className="text-xl sm:text-2xl font-bold text-text-main tracking-tight">
                  {card.value}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Layout Split: Flow Diagram and Telemetry Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Flow Diagram (7 columns) */}
        <div className="lg:col-span-7 flex flex-col">
          <IoTFlowDiagram />
        </div>

        {/* Mini Energy Load Curve (5 columns) */}
        <div className="lg:col-span-5 bg-background-lowest p-6 rounded-stitch border border-outline/10 shadow-stitch flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-text-main font-serif">Today's Load Curve</h3>
            <p className="text-xs text-text-muted">Real-time cumulative consumption progression (kWh)</p>
          </div>
          <div className="flex-1 h-56 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorKwh" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4a7c59" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#4a7c59" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#c4c8bc" opacity={0.3} />
                <XAxis dataKey="time" stroke="#74796e" fontSize={11} tickLine={false} />
                <YAxis stroke="#74796e" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#faf6f0', 
                    borderRadius: '12px', 
                    border: '1px solid rgba(116, 121, 110, 0.2)',
                    fontSize: '12px'
                  }} 
                />
                <Area type="monotone" dataKey="kwh" stroke="#4a7c59" strokeWidth={2.5} fillOpacity={1} fill="url(#colorKwh)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* --- ROLE SPECIFIC WIDGET PANELS --- */}
      <div className="grid grid-cols-1 gap-6">

        {/* 1. SUPER ADMIN: System health logs, edge status */}
        {userRole === 'Super Admin' && (
          <div className="bg-background-lowest p-6 rounded-stitch border border-outline/10 shadow-stitch space-y-4">
            <h3 className="text-lg font-semibold text-text-main font-serif flex items-center gap-2">
              <Terminal className="w-5 h-5 text-red-600" />
              Global System & API Diagnostics
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-semibold">
              <div className="p-4 bg-background-container rounded-stitch border border-outline/10">
                <span className="block text-[10px] text-text-muted uppercase tracking-wider mb-1">MQTT Broker Latency</span>
                <span className="text-lg font-bold text-green-600">8 ms (Excellent)</span>
              </div>
              <div className="p-4 bg-background-container rounded-stitch border border-outline/10">
                <span className="block text-[10px] text-text-muted uppercase tracking-wider mb-1">Database Sync Health</span>
                <span className="text-lg font-bold text-green-600">Syncing (100% Ok)</span>
              </div>
              <div className="p-4 bg-background-container rounded-stitch border border-outline/10">
                <span className="block text-[10px] text-text-muted uppercase tracking-wider mb-1">Edge Nodes Active</span>
                <span className="text-lg font-bold text-text-main">5 / 7 Gateways Online</span>
              </div>
              <div className="p-4 bg-background-container rounded-stitch border border-outline/10">
                <span className="block text-[10px] text-text-muted uppercase tracking-wider mb-1">System Memory</span>
                <span className="text-lg font-bold text-text-main">14.2 GB / 32 GB</span>
              </div>
            </div>
            <div className="text-[11px] font-mono text-text-muted bg-background-high/35 p-3 rounded border border-outline/10 max-h-32 overflow-y-auto">
              <p>[2026-06-19 16:11:02] INFO: Ingress processor loaded 12 packets/sec.</p>
              <p>[2026-06-19 16:11:05] SUCCESS: Handshake verified with IoT Gateway (Substation Panel A).</p>
              <p>[2026-06-19 16:11:10] WARN: Average Power Factor drop on Coimbatore Assembly Line A.</p>
              <p>[2026-06-19 16:11:15] INFO: Auto-capacitor bank activated for sector Coimbatore bay 3.</p>
            </div>
          </div>
        )}

        {/* 2. SITE ADMIN: Site allocation summaries */}
        {userRole === 'Site Admin' && (
          <div className="bg-background-lowest p-6 rounded-stitch border border-outline/10 shadow-stitch space-y-4">
            <h3 className="text-lg font-semibold text-text-main font-serif flex items-center gap-2">
              <Building2 className="w-5 h-5 text-tertiary" />
              Regional Plant Allocations & Managers
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold">
              {sites.map(s => (
                <div key={s.id} className="p-4 bg-background-container rounded-stitch border border-outline/10 flex justify-between items-center">
                  <div>
                    <span className="text-text-main font-bold block">{s.name}</span>
                    <span className="text-[10px] text-text-muted block mt-0.5">Manager: {s.contactPerson}</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                    s.status === 'Active' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. OPERATOR: Live alerts quick acknowledgment desk */}
        {userRole === 'Operator' && (
          <div className="bg-background-lowest p-6 rounded-stitch border border-outline/10 shadow-stitch space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-text-main font-serif flex items-center gap-2">
                <Wrench className="w-5 h-5 text-primary" />
                Operator Action Desk: Pending Acknowledgements
              </h3>
              <span className="text-[10px] text-text-muted font-bold">Priority Grid Actions</span>
            </div>

            {activeAlerts.length === 0 ? (
              <p className="text-xs text-text-muted italic bg-background-container/20 p-4 border border-dashed border-outline/25 rounded-stitch text-center">
                All parameters safe. No pending alarm acknowledgements.
              </p>
            ) : (
              <div className="space-y-2">
                {activeAlerts.map(alert => (
                  <div key={alert.id} className="p-3 bg-background-container rounded-stitch border border-outline/10 flex justify-between items-center text-xs font-semibold">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                      <div>
                        <span className="text-text-main font-bold">{alert.type} </span>
                        <span className="text-text-muted font-normal">on {alert.meterName} ({alert.siteName})</span>
                      </div>
                    </div>
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="flex items-center gap-1 bg-primary text-white px-3 py-1.5 rounded-md text-[10px] font-bold shadow hover:bg-primary/95 transition-all"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Acknowledge Alarm
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 4. CLIENT / VIEWER: Green rating summary, carbon savings */}
        {userRole === 'Viewer' && (
          <div className="bg-background-lowest p-6 rounded-stitch border border-outline/10 shadow-stitch space-y-4">
            <h3 className="text-lg font-semibold text-text-main font-serif flex items-center gap-2">
              <Leaf className="w-5 h-5 text-green-600" />
              Green Energy & Carbon Footprint Summary
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Carbon Savings */}
              <div className="p-5 bg-green-50/20 border border-green-200/50 rounded-stitch flex flex-col justify-between h-28">
                <span className="text-[10px] font-bold text-green-700 uppercase tracking-wider">CO2 Emissions Reduced</span>
                <span className="text-2xl font-black text-green-800">3.4 Metric Tons</span>
                <span className="text-[10px] text-green-700/70 font-semibold">Equivalent to planting 154 trees</span>
              </div>
              {/* Energy Efficiency Index */}
              <div className="p-5 bg-background-container border border-outline/10 rounded-stitch flex flex-col justify-between h-28">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Energy Efficiency Rating</span>
                <span className="text-2xl font-black text-text-main">A+ / Class 1</span>
                <span className="text-[10px] text-text-muted font-semibold">Meets BEE India industrial code limit</span>
              </div>
              {/* Load factor */}
              <div className="p-5 bg-background-container border border-outline/10 rounded-stitch flex flex-col justify-between h-28">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Average Power Factor</span>
                <span className="text-2xl font-black text-primary">0.91 lagging</span>
                <span className="text-[10px] text-text-muted font-semibold">Optimal utility billing threshold met</span>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Block: Active Alerts Summary */}
        <div className="bg-background-lowest p-6 rounded-stitch border border-outline/10 shadow-stitch">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold text-text-main font-serif">Active Warnings Log</h3>
              <p className="text-xs text-text-muted">System abnormalities requiring immediate action</p>
            </div>
            <Link 
              to="/alerts" 
              className="text-xs font-bold text-primary hover:underline"
            >
              View All Alert Logs →
            </Link>
          </div>

          {activeAlertsCount === 0 ? (
            <div className="py-8 text-center border border-dashed border-outline/25 rounded-stitch bg-background-container/20">
              <p className="text-sm text-text-muted font-medium">No critical alerts active. All meters operating within standard electrical margins.</p>
            </div>
          ) : (
            <div className="divide-y divide-outline/10">
              {activeAlerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="py-3 flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${alert.severity === 'Critical' ? 'bg-red-600 animate-ping' : 'bg-tertiary animate-pulse'}`} />
                    <div>
                      <span className="font-bold text-text-main">{alert.type}</span>
                      <span className="text-xs text-text-muted ml-2">on {alert.meterName} ({alert.siteName})</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-text-muted font-medium">{new Date(alert.time).toLocaleTimeString()}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      alert.severity === 'Critical' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                    }`}>
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
