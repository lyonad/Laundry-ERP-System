import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { ordersApi } from '../../api/api';
import { Package, Clock, CheckCircle2, Loader2, ShoppingBag, Star, Wallet } from 'lucide-react';

type CustomerDashboardProps = {
  setActiveTab: (tab: string) => void;
};

export function CustomerDashboard({ setActiveTab }: CustomerDashboardProps) {
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    loadCustomerData();

    // Auto-refresh every 5 seconds
    const interval = setInterval(() => {
      loadCustomerData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const loadCustomerData = async () => {
    try {
      setLoading(true);
      const ordersData = await ordersApi.getAll();
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
      setOrders(transformedOrders.slice(0, 5));
      
      // Calculate customer stats
      const totalSpent = transformedOrders.reduce((sum: number, order: any) => sum + order.total, 0);
      const activeOrders = transformedOrders.filter((o: any) => 
        o.status === 'pending' || o.status === 'washing'
      ).length;
      const readyOrders = transformedOrders.filter((o: any) => o.status === 'ready').length;
      const completedOrders = transformedOrders.filter((o: any) => o.status === 'picked_up').length;
      
      setStats({
        totalSpent,
        activeOrders,
        readyOrders,
        completedOrders,
        totalOrders: transformedOrders.length
      });
    } catch (error) {
      console.error('Failed to load customer data:', error);
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

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white shadow-lg">
        <h2 className="text-3xl font-bold mb-2">Selamat Datang, {user?.fullName}! 👋</h2>
        <p className="text-orange-100">Terima kasih telah mempercayai layanan laundry kami</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm bg-white ring-1 ring-orange-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900">Total Belanja</CardTitle>
            <Wallet className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-950">
              Rp {stats?.totalSpent ? Math.floor(stats.totalSpent / 1000) : 0}k
            </div>
            <p className="text-xs text-orange-600/70 mt-1">
              {stats?.totalOrders || 0} transaksi
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

        <Card className="border-none shadow-sm bg-white ring-1 ring-purple-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">Siap Diambil</CardTitle>
            <ShoppingBag className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-950">{stats?.readyOrders || 0}</div>
            <p className="text-xs text-orange-600/70 mt-1">
              Menunggu pickup
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white ring-1 ring-green-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Pesanan Selesai</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-950">{stats?.completedOrders || 0}</div>
            <p className="text-xs text-orange-600/70 mt-1">
              Sudah diambil
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="border-none shadow-sm bg-white ring-1 ring-orange-100">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-orange-950">Pesanan Terbaru</CardTitle>
            <p className="text-sm text-gray-500 mt-1">Riwayat pesanan laundry Anda</p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            className="border-orange-200 text-orange-700 hover:bg-orange-50"
            onClick={() => setActiveTab('orders')}
          >
            Lihat Semua
          </Button>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <ShoppingBag className="h-16 w-16 mx-auto mb-3 opacity-20" />
              <p className="text-sm">Belum ada pesanan</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-orange-50 border-orange-100">
                  <TableHead className="text-orange-900">ID Order</TableHead>
                  <TableHead className="text-orange-900">Tanggal</TableHead>
                  <TableHead className="text-orange-900">Status</TableHead>
                  <TableHead className="text-right text-orange-900">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-orange-50 border-orange-100">
                    <TableCell className="font-mono text-sm font-medium">{order.id}</TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {new Date(order.date).toLocaleDateString('id-ID')}
                    </TableCell>
                    <TableCell>
                      {order.status === 'picked_up' && (
                        <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-none">
                          <CheckCircle2 className="w-3 h-3 mr-1"/> Selesai
                        </Badge>
                      )}
                      {order.status === 'ready' && (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none">
                          <CheckCircle2 className="w-3 h-3 mr-1"/> Siap Diambil
                        </Badge>
                      )}
                      {order.status === 'washing' && (
                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">
                          <Loader2 className="w-3 h-3 mr-1 animate-spin"/> Dicuci
                        </Badge>
                      )}
                      {order.status === 'pending' && (
                        <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-none">
                          <Clock className="w-3 h-3 mr-1"/> Menunggu
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium text-orange-900">
                      Rp {order.total.toLocaleString('id-ID')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-none shadow-sm bg-gradient-to-br from-blue-50 to-blue-100 ring-1 ring-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-500 p-3 rounded-xl">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-blue-900 mb-1">Jam Operasional</h3>
                <p className="text-sm text-blue-700">Senin - Sabtu: 08:00 - 20:00</p>
                <p className="text-sm text-blue-700">Minggu: 09:00 - 17:00</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-gradient-to-br from-green-50 to-green-100 ring-1 ring-green-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="bg-green-500 p-3 rounded-xl">
                <Star className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-green-900 mb-1">Program Loyalitas</h3>
                <p className="text-sm text-green-700">Dapatkan poin setiap transaksi</p>
                <p className="text-sm text-green-700">1 poin = Rp 10.000</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
