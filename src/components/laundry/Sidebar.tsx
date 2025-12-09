import React, { useEffect, useState } from 'react';
import { cn } from "../ui/utils";
import { Button } from "../ui/button";
import { LayoutDashboard, ShoppingCart, Package, ClipboardList, Users, Settings, LogOut, Shirt, Bell } from "lucide-react";
import { authApi, notificationsApi } from '@/api/api';

type SidebarProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    loadUnreadCount();
    // Refresh unread count every 30 seconds
    const interval = setInterval(loadUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadUnreadCount = async () => {
    try {
      const data = await notificationsApi.getUnreadCount();
      setUnreadCount(data.count || 0);
    } catch (error) {
      console.error('Failed to load unread count:', error);
    }
  };

  const isAdmin = user?.role === 'admin';

  // Admin menu items
  const adminMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pos', label: 'Kasir (POS)', icon: ShoppingCart },
    { id: 'orders', label: 'Pesanan', icon: ClipboardList },
    { id: 'customers', label: 'Pelanggan', icon: Users },
    { id: 'inventory', label: 'Inventory', icon: Package },
  ];

  // Customer menu items
  const customerMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Pesanan Saya', icon: ClipboardList },
  ];

  const menuItems = isAdmin ? adminMenuItems : customerMenuItems;

  const handleLogout = async () => {
    try {
      await authApi.logout();
      localStorage.removeItem('user');
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API fails
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  };

  return (
    <div className="w-64 bg-white h-screen border-r border-orange-100 flex flex-col fixed left-0 top-0 z-20 shadow-sm hidden md:flex">
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-orange-200 shadow-lg">
            <Shirt className="text-white h-6 w-6" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-orange-950 tracking-tight">CleanPress</h1>
            <p className="text-xs text-orange-500 font-medium">Laundry Management</p>
          </div>
        </div>
      </div>

      <div className="px-6 pb-4">
        <div 
          onClick={() => setActiveTab('notifications')}
          className="bg-orange-50/50 p-3 rounded-xl border border-orange-100 flex items-center gap-3 cursor-pointer hover:bg-orange-100 transition-colors"
        >
           <div className="relative">
             <Bell className="h-5 w-5 text-orange-600" />
             {unreadCount > 0 && (
               <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
             )}
           </div>
           <div>
             <p className="text-xs font-semibold text-orange-900">Notifikasi</p>
             <p className="text-[10px] text-orange-600">
               {unreadCount > 0 ? `${unreadCount} Pesan baru` : 'Tidak ada pesan baru'}
             </p>
           </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-2 space-y-2">
        <p className="text-xs font-semibold text-gray-400 px-4 mb-2 uppercase tracking-wider">Menu Utama</p>
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 h-12 rounded-xl transition-all duration-200",
              activeTab === item.id 
                ? "bg-orange-50 text-orange-600 font-semibold shadow-sm ring-1 ring-orange-100" 
                : "text-gray-500 hover:text-orange-600 hover:bg-orange-50/50"
            )}
            onClick={() => setActiveTab(item.id)}
          >
            <item.icon className={cn("h-5 w-5", activeTab === item.id ? "text-orange-500" : "text-gray-400 group-hover:text-orange-500")} />
            {item.label}
          </Button>
        ))}
      </div>

      <div className="p-4 border-t border-orange-50">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 text-gray-500 hover:text-orange-600 hover:bg-orange-50 h-12 rounded-xl"
          onClick={() => setActiveTab('settings')}
        >
          <Settings className="h-5 w-5" />
          Pengaturan
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 text-red-400 hover:text-red-600 hover:bg-red-50 h-12 rounded-xl mt-1"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          Keluar
        </Button>
      </div>
    </div>
  );
}

export function MobileHeader({ activeTab, setActiveTab }: SidebarProps) {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const isAdmin = user?.role === 'admin';

    return (
        <div className="md:hidden h-16 bg-white border-b border-orange-100 flex items-center justify-between px-4 sticky top-0 z-30">
            <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-orange-500 rounded-lg flex items-center justify-center">
                    <Shirt className="text-white h-5 w-5" />
                </div>
                <span className="font-bold text-orange-950">CleanPress</span>
            </div>
            {/* Simple mobile menu placeholder */}
            <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => setActiveTab('dashboard')} className={activeTab === 'dashboard' ? 'text-orange-500 bg-orange-50' : ''}>
                    <LayoutDashboard className="h-5 w-5" />
                </Button>
                {isAdmin && (
                    <Button variant="ghost" size="icon" onClick={() => setActiveTab('pos')} className={activeTab === 'pos' ? 'text-orange-500 bg-orange-50' : ''}>
                        <ShoppingCart className="h-5 w-5" />
                    </Button>
                )}
                <Button variant="ghost" size="icon" onClick={() => setActiveTab('orders')} className={activeTab === 'orders' ? 'text-orange-500 bg-orange-50' : ''}>
                    <ClipboardList className="h-5 w-5" />
                </Button>
            </div>
        </div>
    )
}
