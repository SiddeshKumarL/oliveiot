import React from 'react';

const IoTFlowDiagram = () => {
  return (
    <div className="w-full bg-background-container p-6 rounded-stitch border border-outline/10 shadow-stitch">
      <h3 className="text-lg font-semibold mb-6 text-primary flex items-center gap-2">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
        </span>
        Live IoT Pipeline Status
      </h3>
      
      <div className="overflow-x-auto">
        <svg viewBox="0 0 800 200" className="w-full min-w-[650px] h-auto">
          {/* Definitions for gradients and shadows */}
          <defs>
            <linearGradient id="primaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#78a886" />
              <stop offset="100%" stopColor="#4a7c59" />
            </linearGradient>
            <linearGradient id="tertiaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c4a66a" />
              <stop offset="100%" stopColor="#705c30" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Connection Lines */}
          {/* Machine -> Meter */}
          <path d="M 120 100 L 250 100" stroke="#74796e" strokeWidth="3" fill="none" opacity="0.3" />
          <path d="M 120 100 L 250 100" stroke="#4a7c59" strokeWidth="3" strokeDasharray="8 4" fill="none" className="animate-flow-line" />

          {/* Meter -> Gateway */}
          <path d="M 290 100 L 420 100" stroke="#74796e" strokeWidth="3" fill="none" opacity="0.3" />
          <path d="M 290 100 L 420 100" stroke="#4a7c59" strokeWidth="3" strokeDasharray="8 4" fill="none" className="animate-flow-line" />

          {/* Gateway -> Cloud */}
          <path d="M 460 100 L 590 100" stroke="#74796e" strokeWidth="3" fill="none" opacity="0.3" />
          <path d="M 460 100 L 590 100" stroke="#705c30" strokeWidth="3" strokeDasharray="8 4" fill="none" className="animate-flow-line" />

          {/* Cloud -> Dashboard */}
          <path d="M 630 100 L 730 100" stroke="#74796e" strokeWidth="3" fill="none" opacity="0.3" />
          <path d="M 630 100 L 730 100" stroke="#4a7c59" strokeWidth="3" strokeDasharray="8 4" fill="none" className="animate-flow-line" />

          {/* --- Node 1: Factory Machine --- */}
          <g transform="translate(80, 100)">
            <circle r="40" fill="url(#primaryGradient)" filter="url(#glow)" opacity="0.15" />
            <circle r="32" fill="#faf6f0" stroke="#4a7c59" strokeWidth="2.5" />
            {/* Machine Icon Representation */}
            <path d="M -12 -10 L 12 -10 L 12 12 L -12 12 Z" fill="none" stroke="#4a7c59" strokeWidth="2" />
            <path d="M -8 -2 L 8 -2" stroke="#4a7c59" strokeWidth="2" />
            <path d="M -8 4 L 4 4" stroke="#4a7c59" strokeWidth="2" />
            <circle cx="0" cy="-6" r="2" fill="#4a7c59" />
            <circle cx="8" cy="8" r="2" fill="#705c30" className="animate-pulse-dot" />
            <text x="0" y="55" textAnchor="middle" fontSize="11" fontWeight="600" fill="#2e3230" fontFamily="sans-serif">Factory Machine</text>
          </g>

          {/* --- Node 2: Energy Meter --- */}
          <g transform="translate(250, 100)">
            <circle r="40" fill="url(#primaryGradient)" filter="url(#glow)" opacity="0.15" />
            <circle r="32" fill="#faf6f0" stroke="#4a7c59" strokeWidth="2.5" />
            {/* Dial representation */}
            <circle cx="0" cy="0" r="16" fill="none" stroke="#6b6358" strokeWidth="2" />
            <line x1="0" y1="0" x2="8" y2="-8" stroke="#4a7c59" strokeWidth="3" strokeLinecap="round" />
            {/* Pulsing indicator */}
            <circle cx="-6" cy="8" r="3" fill="#4a7c59" className="animate-pulse" />
            <text x="0" y="55" textAnchor="middle" fontSize="11" fontWeight="600" fill="#2e3230" fontFamily="sans-serif">Energy Meter</text>
          </g>

          {/* --- Node 3: IoT Gateway --- */}
          <g transform="translate(420, 100)">
            <circle r="40" fill="url(#primaryGradient)" filter="url(#glow)" opacity="0.15" />
            <circle r="32" fill="#faf6f0" stroke="#4a7c59" strokeWidth="2.5" />
            {/* Router representation */}
            <rect x="-14" y="-8" width="28" height="16" rx="3" fill="none" stroke="#4a7c59" strokeWidth="2" />
            <line x1="-8" y1="-8" x2="-8" y2="-15" stroke="#4a7c59" strokeWidth="2" />
            <line x1="8" y1="-8" x2="8" y2="-15" stroke="#4a7c59" strokeWidth="2" />
            <circle cx="-6" cy="0" r="2" fill="#4a7c59" />
            <circle cx="0" cy="0" r="2" fill="#4a7c59" />
            <circle cx="6" cy="0" r="2" fill="#705c30" className="animate-pulse" />
            <text x="0" y="55" textAnchor="middle" fontSize="11" fontWeight="600" fill="#2e3230" fontFamily="sans-serif">IoT Gateway</text>
          </g>

          {/* --- Node 4: Cloud Server --- */}
          <g transform="translate(590, 100)">
            <circle r="40" fill="url(#tertiaryGradient)" filter="url(#glow)" opacity="0.15" />
            <circle r="32" fill="#faf6f0" stroke="#705c30" strokeWidth="2.5" />
            {/* Cloud representation */}
            <path d="M -12 6 A 8 8 0 0 1 -12 -6 A 10 10 0 0 1 8 -8 A 8 8 0 0 1 12 6 Z" fill="none" stroke="#705c30" strokeWidth="2" />
            <circle cx="0" cy="0" r="2" fill="#705c30" className="animate-bounce" />
            <text x="0" y="55" textAnchor="middle" fontSize="11" fontWeight="600" fill="#2e3230" fontFamily="sans-serif">Cloud Server</text>
          </g>

          {/* --- Node 5: Web Dashboard --- */}
          <g transform="translate(730, 100)">
            <circle r="40" fill="url(#primaryGradient)" filter="url(#glow)" opacity="0.15" />
            <circle r="32" fill="#faf6f0" stroke="#4a7c59" strokeWidth="2.5" />
            {/* Dashboard representation */}
            <rect x="-16" y="-12" width="32" height="24" rx="2" fill="none" stroke="#4a7c59" strokeWidth="2" />
            <line x1="-16" y1="-4" x2="16" y2="-4" stroke="#4a7c59" strokeWidth="1.5" />
            <circle cx="-10" cy="-8" r="1.5" fill="#705c30" />
            <circle cx="-6" cy="-8" r="1.5" fill="#4a7c59" />
            <rect x="-10" y="0" width="8" height="8" fill="#4a7c59" opacity="0.4" />
            <line x1="4" y1="2" x2="12" y2="2" stroke="#4a7c59" strokeWidth="1.5" />
            <line x1="4" y1="6" x2="10" y2="6" stroke="#4a7c59" strokeWidth="1.5" />
            <text x="0" y="55" textAnchor="middle" fontSize="11" fontWeight="600" fill="#2e3230" fontFamily="sans-serif">Web Portal</text>
          </g>
        </svg>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-6 pt-4 border-t border-outline/10 text-xs text-text-muted text-center font-semibold">
        <div>
          <span className="block text-primary">Status</span>
          <span className="text-sm text-text-main">Connected</span>
        </div>
        <div>
          <span className="block text-primary">Gateway RSSI</span>
          <span className="text-sm text-text-main">-64 dBm</span>
        </div>
        <div>
          <span className="block text-primary">Protocol</span>
          <span className="text-sm text-text-main">MQTT over TLS</span>
        </div>
        <div>
          <span className="block text-primary">Update Rate</span>
          <span className="text-sm text-text-main">Every 5s</span>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <span className="block text-primary">Encryption</span>
          <span className="text-sm text-text-main">AES-256 GCM</span>
        </div>
      </div>
    </div>
  );
};

export default IoTFlowDiagram;
