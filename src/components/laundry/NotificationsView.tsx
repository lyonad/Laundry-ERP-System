import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Bell, CheckCheck, Trash2, AlertCircle, Package, Users, ShoppingCart, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { notificationsApi } from '../../api/api';
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

interface Notification {
  id: string;
  type: 'order' | 'inventory' | 'customer' | 'system';
  title: string;
  message: string;
  createdAt: string;
  isRead: number;
  priority: 'low' | 'medium' | 'high';
}

export function NotificationsView() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedNotifId, setSelectedNotifId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    loadNotifications();
    // Refresh every 3 seconds for more responsive notifications
    const interval = setInterval(loadNotifications, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await notificationsApi.getAll();
      setNotifications(data);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, isRead: 1 } : n
      ));
      toast.success('Notifikasi ditandai sudah dibaca');
    } catch (error) {
      toast.error('Gagal menandai notifikasi');
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, isRead: 1 })));
      toast.success('Semua notifikasi ditandai sudah dibaca');
    } catch (error) {
      toast.error('Gagal menandai semua notifikasi');
    }
  };

  const handleDeleteClick = (id: string) => {
    setSelectedNotifId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedNotifId) return;
    
    try {
      await notificationsApi.delete(selectedNotifId);
      setNotifications(notifications.filter(n => n.id !== selectedNotifId));
      toast.success('Notifikasi dihapus');
      setDeleteDialogOpen(false);
      setSelectedNotifId(null);
    } catch (error) {
      toast.error('Gagal menghapus notifikasi');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order': return ShoppingCart;
      case 'inventory': return Package;
      case 'customer': return Users;
      case 'system': return AlertCircle;
      default: return Bell;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'low': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Baru saja';
    if (minutes < 60) return `${minutes} menit yang lalu`;
    if (hours < 24) return `${hours} jam yang lalu`;
    if (days < 7) return `${days} hari yang lalu`;
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => n.isRead === 0)
    : notifications;

  const unreadCount = notifications.filter(n => n.isRead === 0).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-orange-950">Notifikasi</h2>
          <p className="text-orange-600 mt-1">
            {unreadCount > 0 ? `${unreadCount} notifikasi belum dibaca` : 'Semua notifikasi sudah dibaca'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead} variant="outline" className="gap-2">
            <CheckCheck className="h-4 w-4" />
            Tandai Semua Dibaca
          </Button>
        )}
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          size="sm"
        >
          Semua ({notifications.length})
        </Button>
        <Button
          variant={filter === 'unread' ? 'default' : 'outline'}
          onClick={() => setFilter('unread')}
          size="sm"
        >
          Belum Dibaca ({unreadCount})
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm bg-gradient-to-br from-orange-50 to-orange-100/50 ring-1 ring-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500 rounded-lg">
                <Bell className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-700">{notifications.length}</p>
                <p className="text-sm text-orange-600">Total Notifikasi</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-gradient-to-br from-amber-50 to-orange-50 ring-1 ring-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500 rounded-lg">
                <AlertCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-700">{unreadCount}</p>
                <p className="text-sm text-amber-600">Belum Dibaca</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-gradient-to-br from-red-50 to-orange-50 ring-1 ring-red-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500 rounded-lg">
                <AlertCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-700">
                  {notifications.filter(n => n.priority === 'high').length}
                </p>
                <p className="text-sm text-red-600">Prioritas Tinggi</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-gradient-to-br from-orange-100 to-orange-200/30 ring-1 ring-orange-300">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-600 rounded-lg">
                <CheckCheck className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-800">
                  {notifications.filter(n => n.isRead === 1).length}
                </p>
                <p className="text-sm text-orange-600">Sudah Dibaca</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Tidak ada notifikasi</p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => {
            const Icon = getNotificationIcon(notification.type);
            return (
              <Card
                key={notification.id}
                className={`transition-all hover:shadow-lg hover:ring-2 ${
                  notification.isRead === 0 
                    ? 'bg-gradient-to-r from-orange-50 to-orange-100/50 border-orange-300 ring-1 ring-orange-200' 
                    : 'bg-white border-orange-100 ring-1 ring-orange-100'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-2.5 rounded-lg flex-shrink-0 shadow-sm ${
                      notification.isRead === 0 
                        ? 'bg-gradient-to-br from-orange-500 to-orange-600' 
                        : 'bg-gradient-to-br from-gray-200 to-gray-300'
                    }`}>
                      <Icon className={`h-5 w-5 ${
                        notification.isRead === 0 ? 'text-white' : 'text-gray-600'
                      }`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-orange-950">
                            {notification.title}
                          </h3>
                          {notification.isRead === 0 && (
                            <div className="h-2 w-2 bg-orange-500 rounded-full" />
                          )}
                        </div>
                        <Badge
                          variant="outline"
                          className={`text-xs ${getPriorityColor(notification.priority)}`}
                        >
                          {notification.priority === 'high' ? 'Tinggi' : 
                           notification.priority === 'medium' ? 'Sedang' : 'Rendah'}
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-700 mb-2">
                        {notification.message}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {formatTimestamp(notification.createdAt)}
                        </span>

                        <div className="flex gap-2">
                          {notification.isRead === 0 && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs"
                            >
                              <CheckCheck className="h-3 w-3 mr-1" />
                              Tandai Dibaca
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteClick(notification.id)}
                            className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Hapus
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Notifikasi?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus notifikasi ini? 
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-orange-500 hover:bg-orange-600"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
