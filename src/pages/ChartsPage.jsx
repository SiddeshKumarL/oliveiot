import React from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend, 
  Cell 
} from 'recharts';
import { BarChart3, TrendingUp, Info } from 'lucide-react';

const ChartsPage = () => {
  // 1. Daily energy consumption (last 7 days in kWh)
  const dailyEnergyData = [
    { day: 'Mon', usage: 1240 },
    { day: 'Tue', usage: 1350 },
    { day: 'Wed', usage: 1410 },
    { day: 'Thu', usage: 1290 },
    { day: 'Fri', usage: 1480 },
    { day: 'Sat', usage: 820 }, // weekend low load
    { day: 'Sun', usage: 450 }
  ];

  // 2. Monthly energy comparison (Current vs Previous year in kWh)
  const monthlyEnergyData = [
    { month: 'Jan', 'Year 2025': 32000, 'Year 2026': 34500 },
    { month: 'Feb', 'Year 2025': 31000, 'Year 2026': 33800 },
    { month: 'Mar', 'Year 2025': 34000, 'Year 2026': 36200 },
    { month: 'Apr', 'Year 2025': 33000, 'Year 2026': 35900 },
    { month: 'May', 'Year 2025': 35500, 'Year 2026': 37800 },
    { month: 'Jun', 'Year 2025': 37000, 'Year 2026': 39100 }
  ];

  // 3. Machine-wise energy usage (kWh distribution)
  const machineUsageData = [
    { name: 'CNC Feed Panel', value: 12405, color: '#4a7c59' },
    { name: 'Welding Robots', value: 18239, color: '#78a886' },
    { name: 'Cold Compressor', value: 34120, color: '#705c30' },
    { name: 'HVAC Plant Feed', value: 7421, color: '#6b6358' },
    { name: 'Main Grid Loss', value: 2521, color: '#c4a66a' }
  ];

  // 4. Peak load timing (24-hour cycle kW demand)
  const peakLoadData = [
    { hour: '00:00', load: 85 },
    { hour: '02:00', load: 82 },
    { hour: '04:00', load: 95 },
    { hour: '06:00', load: 140 }, // shifts start
    { hour: '08:00', load: 280 },
    { hour: '10:00', load: 395 }, // peak load
    { hour: '12:00', load: 350 },
    { hour: '14:00', load: 380 },
    { hour: '16:00', load: 365 },
    { hour: '18:00', load: 220 },
    { hour: '20:00', load: 155 },
    { hour: '22:00', load: 110 }
  ];

  // 5. Power factor trend (Line chart relative to 0.90 ideal threshold)
  const powerFactorTrendData = [
    { time: '09:00', pf: 0.94, limit: 0.90 },
    { time: '10:00', pf: 0.92, limit: 0.90 },
    { time: '11:00', pf: 0.88, limit: 0.90 }, // warning drop
    { time: '12:00', pf: 0.85, limit: 0.90 }, // warning drop
    { time: '13:00', pf: 0.91, limit: 0.90 }, // corrected after capacitor bank trigger
    { time: '14:00', pf: 0.93, limit: 0.90 },
    { time: '15:00', pf: 0.95, limit: 0.90 },
    { time: '16:00', pf: 0.94, limit: 0.90 }
  ];

  const tooltipStyle = {
    backgroundColor: '#faf6f0',
    borderRadius: '12px',
    border: '1px solid rgba(116, 121, 110, 0.2)',
    fontSize: '11px',
    fontWeight: 'bold',
    fontFamily: 'sans-serif',
    color: '#2e3230'
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-main font-serif">
          Grid Analytics & Charts
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Historical consumption audits, machine-wise distributions, load profiles, and power factors.
        </p>
      </div>

      {/* Grid: 2 Charts per row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 1. Daily Energy Consumption */}
        <div className="bg-background-lowest p-5 rounded-stitch border border-outline/10 shadow-stitch">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-text-main font-serif">Daily Energy Consumption</h3>
            <p className="text-xs text-text-muted">Total power consumed over the last 7 days (kWh)</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyEnergyData} margin={{ left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#c4c8bc" opacity={0.2} />
                <XAxis dataKey="day" stroke="#74796e" fontSize={11} tickLine={false} />
                <YAxis stroke="#74796e" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="usage" fill="#4a7c59" radius={[4, 4, 0, 0]}>
                  {dailyEnergyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.day === 'Sat' || entry.day === 'Sun' ? '#78a886' : '#4a7c59'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Monthly Energy Comparison */}
        <div className="bg-background-lowest p-5 rounded-stitch border border-outline/10 shadow-stitch">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-text-main font-serif">Monthly Energy Comparison</h3>
            <p className="text-xs text-text-muted">Comparative timeline analysis: Year-over-Year (kWh)</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyEnergyData} margin={{ left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#c4c8bc" opacity={0.2} />
                <XAxis dataKey="month" stroke="#74796e" fontSize={11} tickLine={false} />
                <YAxis stroke="#74796e" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                <Bar dataKey="Year 2025" fill="#6b6358" opacity={0.6} radius={[4, 4, 0, 0]} />
                <Bar dataKey="Year 2026" fill="#4a7c59" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Machine-Wise Energy Usage */}
        <div className="bg-background-lowest p-5 rounded-stitch border border-outline/10 shadow-stitch">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-text-main font-serif">Machine-Wise Distribution</h3>
            <p className="text-xs text-text-muted">Breakdown of total panel consumption by machine loads (kWh)</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={machineUsageData} margin={{ left: 15, right: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#c4c8bc" opacity={0.2} />
                <XAxis type="number" stroke="#74796e" fontSize={11} tickLine={false} />
                <YAxis type="category" dataKey="name" stroke="#74796e" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {machineUsageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Peak Load Timing */}
        <div className="bg-background-lowest p-5 rounded-stitch border border-outline/10 shadow-stitch">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-text-main font-serif">Peak Load Profile</h3>
            <p className="text-xs text-text-muted">Average demand curve throughout a 24-hour manufacturing shift (kW)</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={peakLoadData} margin={{ left: -15, bottom: 5 }}>
                <defs>
                  <linearGradient id="loadGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#705c30" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#705c30" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#c4c8bc" opacity={0.2} />
                <XAxis dataKey="hour" stroke="#74796e" fontSize={11} tickLine={false} />
                <YAxis stroke="#74796e" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="load" stroke="#705c30" strokeWidth={2.5} fillOpacity={1} fill="url(#loadGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5. Power Factor Trend */}
        <div className="bg-background-lowest p-5 rounded-stitch border border-outline/10 shadow-stitch lg:col-span-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
            <div>
              <h3 className="text-sm font-bold text-text-main font-serif">Power Factor (PF) Trend</h3>
              <p className="text-xs text-text-muted">Live Power Factor vs target penalty limit (0.90 lagging)</p>
            </div>
            <div className="flex items-center gap-1.5 p-2 bg-yellow-50 border border-yellow-200/50 rounded-stitch text-[10px] text-yellow-800 font-bold">
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span>PF drops trigger automatic Capacitor Banks to prevent utility penalties.</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={powerFactorTrendData} margin={{ left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#c4c8bc" opacity={0.2} />
                <XAxis dataKey="time" stroke="#74796e" fontSize={11} tickLine={false} />
                <YAxis domain={[0.75, 1.0]} stroke="#74796e" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                <Line type="monotone" dataKey="pf" stroke="#4a7c59" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Measured PF" />
                <Line type="monotone" dataKey="limit" stroke="#b83230" strokeDasharray="4 4" strokeWidth={2} dot={false} name="Utility Penalty Penalty Limit (0.90)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ChartsPage;
