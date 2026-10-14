import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { IoTProvider } from "./context/IoTContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Register from "./Register";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SiteManagement from "./pages/SiteManagement";
import MeterList from "./pages/MeterList";
import LiveMonitoring from "./pages/LiveMonitoring";
import ChartsPage from "./pages/ChartsPage";
import AlertsPage from "./pages/AlertsPage";
import ReportsPage from "./pages/ReportsPage";

// Layout wrapper for all authenticated console pages
const ConsoleLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background-warm font-sans text-text-main">
      {/* Navigation Sidebar — receives mobile open state */}
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Console Content */}
      <div className="flex flex-col flex-1 h-full min-w-0">
        {/* Topbar receives toggle handler */}
        <Topbar onMenuToggle={() => setSidebarOpen((prev) => !prev)} />

        {/* Page Inner Container (scrollable) */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-8">
          <div className="w-full max-w-7xl mx-auto space-y-4 md:space-y-6 pb-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <IoTProvider>
      <Router>
        <Routes>
          {/* Public Login Page */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Secure Admin Console Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <ConsoleLayout>
                  <Dashboard />
                </ConsoleLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/sites"
            element={
              <ProtectedRoute>
                <ConsoleLayout>
                  <SiteManagement />
                </ConsoleLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/meters"
            element={
              <ProtectedRoute>
                <ConsoleLayout>
                  <MeterList />
                </ConsoleLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/live"
            element={
              <ProtectedRoute>
                <ConsoleLayout>
                  <LiveMonitoring />
                </ConsoleLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/charts"
            element={
              <ProtectedRoute>
                <ConsoleLayout>
                  <ChartsPage />
                </ConsoleLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/alerts"
            element={
              <ProtectedRoute>
                <ConsoleLayout>
                  <AlertsPage />
                </ConsoleLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <ConsoleLayout>
                  <ReportsPage />
                </ConsoleLayout>
              </ProtectedRoute>
            }
          />

          {/* Catch-all Redirect */}
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <ConsoleLayout>
                  <Dashboard />
                </ConsoleLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </IoTProvider>
  );
}

export default App;
