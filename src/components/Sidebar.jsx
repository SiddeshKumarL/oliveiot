import React from "react";
import { NavLink } from "react-router-dom";
import { useIoT } from "../context/IoTContext";
import OliveLogo from "./OliveLogo";
import {
  LayoutDashboard,
  Settings,
  Cpu,
  Activity,
  BarChart3,
  BellRing,
  FileSpreadsheet,
  LogOut,
  X,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Site Management", path: "/sites", icon: Settings },
  { name: "Energy Meters", path: "/meters", icon: Cpu },
  { name: "Live Monitoring", path: "/live", icon: Activity },
  { name: "Analytics & Charts", path: "/charts", icon: BarChart3 },
  { name: "Alerts Logs", path: "/alerts", icon: BellRing },
  { name: "System Reports", path: "/reports", icon: FileSpreadsheet },
];

const getRoleColor = (role) => {
  switch (role) {
    case "Super Admin":
      return "bg-red-500/10 text-red-700 border border-red-500/20";
    case "Site Admin":
      return "bg-tertiary/10 text-tertiary border border-tertiary/20";
    case "Operator":
      return "bg-primary/10 text-primary border border-primary/20";
    default:
      return "bg-secondary/10 text-secondary border border-secondary/20";
  }
};

// Shared inner content — used in both desktop sidebar and mobile drawer
const SidebarContent = ({ user, logout, onNavClick }) => (
  <div className="flex flex-col h-full">
    {/* Brand Header */}
    <div className="p-6 border-b border-outline/10 flex flex-col items-center bg-white/70 shrink-0">
      <OliveLogo className="w-32 h-auto" />
      <span className="text-[8px] uppercase tracking-widest text-text-muted font-bold mt-1.5">
        Innovations
      </span>
    </div>

    {/* Navigation Links */}
    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onNavClick}
            end={item.path === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-stitch text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-primary text-white shadow-md"
                  : "text-text-muted hover:bg-background-high hover:text-text-main"
              }`
            }
          >
            <Icon className="w-5 h-5 shrink-0" />
            <span>{item.name}</span>
          </NavLink>
        );
      })}
    </nav>

    {/* User Session Block */}
    {user && (
      <div className="p-4 border-t border-outline/10 bg-background-high/30 shrink-0">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold shrink-0">
            {user.email.substring(0, 2).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-text-main truncate">
              {user.email}
            </p>
            <span
              className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${getRoleColor(user.role)}`}
            >
              {user.role}
            </span>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-stitch text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors border border-red-200"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </button>
      </div>
    )}
  </div>
);

const Sidebar = ({ mobileOpen, onClose }) => {
  const { user, logout } = useIoT();

  return (
    <>
      {/* ── Desktop Sidebar (md and above) ── */}
      <aside className="hidden md:flex w-64 bg-background-container border-r border-outline/10 flex-col h-full shrink-0 shadow-sm">
        <SidebarContent user={user} logout={logout} onNavClick={undefined} />
      </aside>

      {/* ── Mobile Drawer Overlay ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile Drawer Panel ── */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-background-container border-r border-outline/10
          shadow-2xl flex flex-col transition-transform duration-300 ease-in-out md:hidden
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        aria-label="Mobile navigation"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-text-muted hover:bg-background-high hover:text-text-main transition-colors"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>

        <SidebarContent user={user} logout={logout} onNavClick={onClose} />
      </aside>
    </>
  );
};

export default Sidebar;
