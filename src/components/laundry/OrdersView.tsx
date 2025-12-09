import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Clock, Loader2 as LoaderIcon, CheckCircle2, ShoppingBag, User, Calendar, ArrowRight } from 'lucide-react';
import { ordersApi } from '../../api/api';
import { Order, OrderStatus } from './data';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

const KanbanColumn = ({ title, status, orders, icon: Icon, colorClass, bgClass, onStatusChange }: { title: string, status: OrderStatus, orders: Order[], icon: any, colorClass: string, bgClass: string, onStatusChange: (orderId: string, newStatus: OrderStatus) => void }) => {
  const filteredOrders = (orders || []).filter(o => o.status === status);
  
  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    const statusFlow: Record<OrderStatus, OrderStatus | null> = {
      'pending': 'washing',
      'washing': 'ready',
      'ready': 'picked_up',
      'picked_up': null
    };
    return statusFlow[currentStatus];
  };
  
  const getNextStatusLabel = (currentStatus: OrderStatus): string => {
    const labels: Record<OrderStatus, string> = {
      'pending': 'Mulai Cuci',
      'washing': 'Siap Diambil',
      'ready': 'Sudah Diambil',
      'picked_up': ''
    };
    return labels[currentStatus];
  };

  return (
    <div className={`flex flex-col ${filteredOrders.length === 0 ? 'h-auto' : 'h-full'} min-w-[280px] w-full bg-gradient-to-b from-white to-orange-50/30 rounded-xl border border-orange-200 shadow-md`}>
      <div className={`p-3 border-b border-orange-200 flex items-center justify-between ${bgClass} rounded-t-xl`}>
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${colorClass.includes('orange') ? 'bg-orange-100' : 'bg-gray-100'}`}>
            <Icon className={`h-4 w-4 ${colorClass}`} />
          </div>
          <h3 className="font-semibold text-orange-900">{title}</h3>
        </div>
        <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-200">{filteredOrders.length}</Badge>
      </div>
      
      {filteredOrders.length === 0 ? (
        <div className="p-3">
          <div className="h-20 flex items-center justify-center text-orange-400/50 text-sm italic border-2 border-dashed border-orange-200 rounded-lg bg-orange-50/30">
            Kosong
          </div>
        </div>
      ) : (
        <ScrollArea className="flex-1 p-3">
          <div className="space-y-3">
            {filteredOrders.map(order => (
              <Card key={order.id} className="border-2 border-orange-200 shadow-sm hover:shadow-lg hover:border-orange-300 transition-all cursor-pointer bg-white">
                <CardContent className="p-3">
                  <div className="mb-2">
                    <Badge variant="outline" className="text-xs font-mono text-gray-500 border-gray-200 mb-1">
                      {order.id}
                    </Badge>
                    <div className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {order.date}
                    </div>
                  </div>
                  
                  <h4 className="font-bold text-gray-800 mb-1 flex items-center gap-2">
                    <User className="h-3 w-3 text-orange-400" /> {order.customerName}
                  </h4>
                  
                  <div className="space-y-1 mb-3">
                    {(order.serviceItems || []).map((item, idx) => (
                      <div key={idx} className="text-xs text-gray-600 pl-5 relative">
                        <div className="absolute left-1 top-1.5 h-1.5 w-1.5 rounded-full bg-orange-500"></div>
                        {item.name}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                    <div className="text-xs font-semibold text-gray-500 uppercase">
                      {order.paymentMethod}
                    </div>
                    <div className="font-bold text-orange-600">
                      Rp {order.total.toLocaleString('id-ID')}
                    </div>
                  </div>
                  
                  {/* Status Update Button */}
                  {getNextStatus(status) && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <Button
                        size="sm"
                        className="w-full gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md"
                        onClick={() => onStatusChange(order.id, getNextStatus(status)!)}
                      >
                        <ArrowRight className="h-3 w-3" />
                        {getNextStatusLabel(status)}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export function OrdersView() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState<{ orderId: string; newStatus: OrderStatus } | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    loadOrders();
  }, []);

  const isAdmin = user?.role === 'admin';

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await ordersApi.getAll();
      // Transform items to serviceItems for frontend compatibility
      const transformedData = (data || []).map((order: any) => ({
        ...order,
        serviceItems: (order.items || []).map((item: any) => ({
          id: item.serviceId,
          name: item.serviceName,
          price: item.price,
          quantity: item.quantity
        }))
      }));
      setOrders(transformedData);
    } catch (error) {
      console.error('Failed to load orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setPendingStatusChange({ orderId, newStatus });
    setConfirmDialogOpen(true);
  };

  const confirmStatusChange = async () => {
    if (!pendingStatusChange) return;
    
    try {
      await ordersApi.updateStatus(pendingStatusChange.orderId, pendingStatusChange.newStatus);
      toast.success(`Status order berhasil diupdate!`);
      await loadOrders();
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Gagal mengupdate status order');
    } finally {
      setConfirmDialogOpen(false);
      setPendingStatusChange(null);
    }
  };

  const getStatusLabel = (status: OrderStatus) => {
    const labels = {
      'pending': 'Antrian',
      'washing': 'Sedang Dicuci',
      'ready': 'Siap Diambil',
      'picked_up': 'Selesai'
    };
    return labels[status];
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><LoaderIcon className="h-8 w-8 animate-spin text-orange-500" /></div>;
  }

  // Customer view - Simple table view
  if (!isAdmin) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <Card className="border-none shadow-lg bg-white ring-1 ring-orange-200">
          <CardHeader className="bg-gradient-to-r from-orange-50/50 to-transparent border-b border-orange-200">
            <CardTitle className="text-orange-950">Pesanan Saya</CardTitle>
            <p className="text-sm text-orange-700/70 mt-1">Riwayat dan status pesanan laundry Anda</p>
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
                  <TableRow className="bg-gradient-to-r from-orange-50 to-orange-100/50 border-orange-200">
                    <TableHead className="text-orange-900">ID Order</TableHead>
                    <TableHead className="text-orange-900">Tanggal</TableHead>
                    <TableHead className="text-orange-900">Layanan</TableHead>
                    <TableHead className="text-orange-900">Status</TableHead>
                    <TableHead className="text-right text-orange-900">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-orange-50/50 border-orange-200 transition-colors even:bg-orange-50/20">
                      <TableCell className="font-mono text-sm font-medium">{order.id}</TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {new Date(order.date).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {order.serviceItems && order.serviceItems.length > 0 ? (
                            <div className="space-y-0.5">
                              {order.serviceItems.slice(0, 2).map((item, idx) => (
                                <div key={idx} className="text-xs text-gray-600">• {item.name}</div>
                              ))}
                              {order.serviceItems.length > 2 && (
                                <div className="text-xs text-gray-400">+{order.serviceItems.length - 2} lainnya</div>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">-</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {order.status === 'picked_up' && (
                          <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-none">
                            <CheckCircle2 className="w-3 h-3 mr-1"/> Selesai
                          </Badge>
                        )}
                        {order.status === 'ready' && (
                          <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-none">
                            <CheckCircle2 className="w-3 h-3 mr-1"/> Siap Diambil
                          </Badge>
                        )}
                        {order.status === 'washing' && (
                          <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-none">
                            <LoaderIcon className="w-3 h-3 mr-1 animate-spin"/> Dicuci
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
      </div>
    );
  }

  // Admin view - Kanban board
  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col gap-4">
      <div>
        <h2 className="text-2xl font-bold text-orange-950">Status Pesanan</h2>
        <p className="text-orange-700/60">Pantau proses laundry secara real-time</p>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-4 items-start min-w-[1000px]">
          <KanbanColumn 
            title="Antrian / Pending" 
            status="pending" 
            orders={orders} 
            icon={Clock}
            colorClass="text-orange-500"
            bgClass="bg-orange-50"
            onStatusChange={handleStatusChange}
          />
          <KanbanColumn 
            title="Sedang Dicuci" 
            status="washing" 
            orders={orders} 
            icon={LoaderIcon}
            colorClass="text-orange-500"
            bgClass="bg-orange-50"
            onStatusChange={handleStatusChange}
          />
          <KanbanColumn 
            title="Siap Diambil" 
            status="ready" 
            orders={orders} 
            icon={CheckCircle2}
            colorClass="text-orange-500"
            bgClass="bg-orange-50"
            onStatusChange={handleStatusChange}
          />
           <KanbanColumn 
            title="Selesai" 
            status="picked_up" 
            orders={orders} 
            icon={ShoppingBag}
            colorClass="text-gray-500"
            bgClass="bg-gray-100"
            onStatusChange={handleStatusChange}
          />
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Update Status</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingStatusChange && (
                <>
                  Apakah Anda yakin ingin mengubah status pesanan <strong>{pendingStatusChange.orderId}</strong> menjadi <strong>{getStatusLabel(pendingStatusChange.newStatus)}</strong>?
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmStatusChange}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Ya, Update Status
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
