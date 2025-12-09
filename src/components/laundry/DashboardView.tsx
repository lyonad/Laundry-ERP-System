import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ordersApi, statsApi } from '../../api/api';
import { Wallet, Users, Package, TrendingUp, ArrowUpRight, Clock, CheckCircle2, Loader2, Truck } from 'lucide-react';

const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

type DashboardViewProps = {
  setActiveTab: (tab: string) => void;
};

export function DashboardView({ setActiveTab }: DashboardViewProps) {
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    loadDashboardData();

    // Auto-refresh every 10 seconds
    const interval = setInterval(() => {
      loadDashboardData();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [ordersData, statsData] = await Promise.all([
        ordersApi.getAll(),
        statsApi.getDashboard()
      ]);

      // Transform items to serviceItems for frontend compatibility
      const transformedOrders = (ordersData || []).map((order: any) => ({
        ...order,
        serviceItems: (order.items || []).map((item: any) => ({
          id: item.serviceId,
          name: item.serviceName,
          price: item.price,
          quantity: item.quantity
        }))
      }));
      setRecentOrders(transformedOrders.slice(0, 5));
      setStats(statsData);

      // Format chart data
      const chartFormatted = Array.from({ length: 7 }, (_, i) => ({
        name: dayNames[i],
        total: 0
      }));

      statsData.weeklyRevenue?.forEach((item: any) => {
        const dayIndex = parseInt(item.dayOfWeek);
        if (chartFormatted[dayIndex]) {
          chartFormatted[dayIndex].total = item.total;
        }
      });

      setChartData(chartFormatted);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }
  
  const isAdmin = user?.role === 'admin';
  
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Role Badge */}
      {user && (
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-orange-950">
              Selamat Datang, {user.fullName}!
            </h2>
            <p className="text-sm text-orange-600">
              <Badge variant={isAdmin ? "default" : "secondary"} className={isAdmin ? "bg-orange-500" : ""}>
                {isAdmin ? "👑 Administrator" : "👤 Pelanggan"}
              </Badge>
            </p>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm bg-white ring-1 ring-orange-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900">Total Pendapatan</CardTitle>
            <Wallet className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-950">
              Rp {stats?.revenue ? (stats.revenue / 1000000).toFixed(1) : '0'}jt
            </div>
            <p className="text-xs text-orange-600/70 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" /> Bulan ini
            </p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white ring-1 ring-orange-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900">Pelanggan Baru</CardTitle>
            <Users className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-950">+{stats?.newMembers || 0}</div>
            <p className="text-xs text-orange-600/70 flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3" /> Bulan ini
            </p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white ring-1 ring-orange-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900">Order Aktif</CardTitle>
            <Package className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-950">{stats?.activeOrders || 0}</div>
            <p className="text-xs text-orange-600/70 mt-1">
              Dalam proses
            </p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white ring-1 ring-orange-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900">Stok Kritis</CardTitle>
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-950">{stats?.lowStock || 0}</div>
            <p className="text-xs text-orange-600/70 mt-1">
              Item perlu restock
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        <Card className="col-span-1 lg:col-span-4 border-none shadow-sm bg-white ring-1 ring-orange-100">
          <CardHeader>
            <CardTitle className="text-orange-950">Grafik Pendapatan</CardTitle>
            <CardDescription>Performa penjualan minggu ini</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full min-w-0">
              <ResponsiveContainer width="99%" height="100%" minWidth={0}>
                <BarChart data={chartData}>
                  <XAxis 
                    dataKey="name" 
                    stroke="#9a3412" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#9a3412" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `Rp${value/1000}k`} 
                  />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 5 ? '#f97316' : '#fdba74'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-3 border-none shadow-sm bg-white ring-1 ring-orange-100 flex flex-col">
          <CardHeader>
            <CardTitle className="text-orange-950">Order Terkini</CardTitle>
            <CardDescription>Status pesanan laundry yang masuk</CardDescription>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-hidden">
             <Table>
                <TableHeader>
                  <TableRow className="hover:bg-orange-50 border-orange-100">
                    <TableHead className="text-orange-900">Pelanggan</TableHead>
                    <TableHead className="text-orange-900">Status</TableHead>
                    <TableHead className="text-right text-orange-900">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-orange-50 border-orange-100">
                      <TableCell>
                        <div className="font-medium text-orange-950">{order.customerName}</div>
                        <div className="text-xs text-gray-500">{order.items?.length || 0} items</div>
                      </TableCell>
                      <TableCell>
                        {order.status === 'picked_up' && (
                          <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-none shadow-none"><CheckCircle2 className="w-3 h-3 mr-1"/> Selesai</Badge>
                        )}
                        {order.status === 'ready' && (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none shadow-none"><CheckCircle2 className="w-3 h-3 mr-1"/> Siap</Badge>
                        )}
                        {order.status === 'washing' && (
                          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none shadow-none"><Loader2 className="w-3 h-3 mr-1 animate-spin"/> Proses</Badge>
                        )}
                        {order.status === 'pending' && (
                          <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-none shadow-none"><Clock className="w-3 h-3 mr-1"/> Pending</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-medium text-orange-900">
                        Rp {order.total.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
             </Table>
          </CardContent>
          <div className="p-4 border-t border-orange-100 bg-orange-50/30">
            <Button 
              variant="outline" 
              className="w-full border-orange-200 text-orange-700 hover:bg-orange-50"
              onClick={() => setActiveTab('orders')}
            >
              Lihat Semua Order
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
