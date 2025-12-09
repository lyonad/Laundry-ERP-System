import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { Sidebar, MobileHeader } from './components/laundry/Sidebar';
import { DashboardView } from './components/laundry/DashboardView';
import { CustomerDashboard } from './components/laundry/CustomerDashboard';
import { PointOfSale } from './components/laundry/PointOfSale';
import { InventoryView } from './components/laundry/InventoryView';
import { OrdersView } from './components/laundry/OrdersView';
import { CustomersView } from './components/laundry/CustomersView';
import { NotificationsView } from './components/laundry/NotificationsView';
import { SettingsView } from './components/laundry/SettingsView';
import LoginView from './components/laundry/LoginView';
import { LandingPage } from './components/landing/LandingPage';
import { authApi } from './api/api';

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      await authApi.getCurrentUser();
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function MainApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  };

  const isAdmin = user?.role === 'admin';

  const renderContent = () => {
    // If not admin, restrict access to certain tabs
    if (!isAdmin && (activeTab === 'pos' || activeTab === 'inventory' || activeTab === 'customers')) {
      setActiveTab('dashboard');
      return null;
    }

    switch (activeTab) {
      case 'dashboard':
        return isAdmin ? <DashboardView setActiveTab={setActiveTab} /> : <CustomerDashboard setActiveTab={setActiveTab} />;
      case 'pos':
        return isAdmin ? <PointOfSale /> : null;
      case 'inventory':
        return isAdmin ? <InventoryView /> : null;
      case 'orders':
        return <OrdersView />;
      case 'customers':
        return isAdmin ? <CustomersView /> : null;
      case 'notifications':
        return <NotificationsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return isAdmin ? <DashboardView setActiveTab={setActiveTab} /> : <CustomerDashboard setActiveTab={setActiveTab} />;
    }
  };

  const getHeaderTitle = () => {
    if (!isAdmin) {
      switch(activeTab) {
        case 'orders': return 'Pesanan Saya';
        case 'notifications': return 'Notifikasi';
        case 'settings': return 'Pengaturan';
        default: return 'Dashboard Pelanggan';
      }
    }
    
    switch(activeTab) {
      case 'pos': return 'Kasir & Transaksi';
      case 'inventory': return 'Inventory & Stok';
      case 'orders': return 'Manajemen Pesanan';
      case 'customers': return 'Data Pelanggan';
      case 'notifications': return 'Notifikasi';
      case 'settings': return 'Pengaturan';
      default: return 'Dashboard Overview';
    }
  };

  return (
    <div className="min-h-screen bg-orange-50/30 font-sans text-gray-900 selection:bg-orange-200">
      <Toaster position="top-right" />
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="md:pl-64 min-h-screen flex flex-col">
        <MobileHeader activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <header className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-orange-950 capitalize tracking-tight">
                  {getHeaderTitle()}
                </h1>
                <p className="text-orange-800/60 mt-1">
                  {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              
              <div className="hidden md:flex items-center gap-3">
                <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-orange-100 flex items-center gap-2">
                  <div className="h-2 w-2 bg-orange-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-600">System Online</span>
                </div>
                
                {user && (
                  <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-orange-100 flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-orange-200 flex items-center justify-center text-sm font-bold text-orange-700">
                      {user.fullName?.charAt(0) || 'A'}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                  </div>
                )}
              </div>
            </header>

            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginView />} />
        <Route
          path="/app/*"
          element={
            <ProtectedRoute>
              <MainApp />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
