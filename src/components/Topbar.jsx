import React, { useState, useEffect } from "react";
import { useIoT } from "../context/IoTContext";
import { Bell, ShieldCheck, ShieldAlert, Clock, Menu } from "lucide-react";
import { Link } from "react-router-dom";

const Topbar = ({ onMenuToggle }) => {
  const { alerts, user } = useIoT();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const activeAlerts = alerts.filter((a) => a.status === "Active");
  const alertCount = activeAlerts.length;

  return (
    <header className="h-16 bg-background-lowest border-b border-outline/10 px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-sm">
      {/* Left: Hamburger (mobile) + Title */}
      <div className="flex items-center gap-3">
        {/* Hamburger — only visible on mobile */}
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 rounded-stitch text-text-muted hover:bg-background-high hover:text-text-main transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h2 className="text-sm font-bold tracking-tight text-text-main sm:text-lg whitespace-nowrap">
          Enterprise IoT Console
        </h2>
        <span className="hidden sm:inline-block px-2 py-0.5 bg-secondary/15 text-text-muted rounded-full text-xs font-semibold">
          v1.4.0
        </span>
      </div>

      {/* Right: Utilities */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Local Clock — hidden on small screens */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-text-muted font-medium bg-background-container px-3 py-1.5 rounded-stitch border border-outline/10">
          <Clock className="w-3.5 h-3.5 text-primary" />
          <span>
            {time.toLocaleDateString()} {time.toLocaleTimeString()}
          </span>
        </div>

        {/* System Health Status */}
        <div className="flex items-center">
          {alertCount > 0 ? (
            <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 border border-red-200/50 px-2 sm:px-3 py-1.5 rounded-stitch font-bold animate-pulse">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              {/* Full label on sm+, icon-only on xs */}
              <span className="hidden xs:inline">{alertCount} Critical</span>
              <span className="xs:hidden">{alertCount}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-primary bg-primary/10 border border-primary/20 px-2 sm:px-3 py-1.5 rounded-stitch font-bold">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">All Systems Nominal</span>
            </div>
          )}
        </div>

        {/* Alerts Bell */}
        <Link
          to="/alerts"
          className="relative p-2 rounded-full text-text-muted hover:bg-background-high hover:text-text-main transition-colors border border-outline/5"
          aria-label={`Alerts${alertCount > 0 ? `, ${alertCount} active` : ""}`}
        >
          <Bell className="w-5 h-5" />
          {alertCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[8px] font-black text-white ring-2 ring-background-lowest">
              {alertCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
};

export default Topbar;
