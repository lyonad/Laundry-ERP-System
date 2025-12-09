import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Trash2, ShoppingCart, Plus, Minus, Wallet, Search, Shirt, Disc, Clock, Box, User, CreditCard, QrCode, Banknote, ChevronDown, Loader2, CheckCircle } from "lucide-react";
import { servicesApi, membersApi, ordersApi } from '../../api/api';
import { Service, Member } from './data';
import { cn } from "../ui/utils";
import { toast } from "sonner";

export function PointOfSale() {
  const [services, setServices] = useState<Service[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<{ service: Service; qty: number }[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<'all' | 'kiloan' | 'satuan' | 'express'>('all');
  const [paymentMethod, setPaymentMethod] = useState<string>('tunai');
  const [selectedMember, setSelectedMember] = useState<string>("guest");
  const [processing, setProcessing] = useState(false);
  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false);
  const [resetCartDialogOpen, setResetCartDialogOpen] = useState(false);
  const [addServiceDialogOpen, setAddServiceDialogOpen] = useState(false);
  const [newService, setNewService] = useState({
    name: '',
    price: '',
    unit: 'kg',
    category: 'kiloan' as 'kiloan' | 'satuan' | 'express',
    description: ''
  });
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [servicesData, membersData] = await Promise.all([
        servicesApi.getAll(),
        membersApi.getAll()
      ]);
      setServices(servicesData);
      setMembers(membersData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', label: 'Semua' },
    { id: 'kiloan', label: 'Kiloan' },
    { id: 'satuan', label: 'Satuan' },
    { id: 'express', label: 'Express' },
  ];

  const addToCart = (service: Service) => {
    setCart(prev => {
      const existing = prev.find(item => item.service.id === service.id);
      if (existing) {
        return prev.map(item => 
          item.service.id === service.id 
            ? { ...item, qty: item.qty + 1 } 
            : item
        );
      }
      return [...prev, { service, qty: 1 }];
    });
  };

  const removeFromCart = (serviceId: string) => {
    setCart(prev => prev.filter(item => item.service.id !== serviceId));
  };

  const updateQty = (serviceId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.service.id === serviceId) {
        const newQty = Math.max(1, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const total = cart.reduce((acc, item) => acc + (item.service.price * item.qty), 0);

  const handleCheckoutClick = () => {
    if (cart.length === 0) {
      toast.error('Keranjang kosong!');
      return;
    }
    setCheckoutDialogOpen(true);
  };

  const confirmCheckout = async () => {
    try {
      setProcessing(true);
      setCheckoutDialogOpen(false);
      
      // Generate unique order ID
      const orderId = `TRX-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const customerName = selectedMember === 'guest' 
        ? 'Guest' 
        : members.find(m => m.id === selectedMember)?.name || 'Guest';

      const orderData = {
        id: orderId,
        customerName,
        customerId: selectedMember === 'guest' ? null : selectedMember,
        items: cart.map(item => ({
          serviceId: item.service.id,
          serviceName: item.service.name,
          quantity: item.qty,
          price: item.service.price
        })),
        total,
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: paymentMethod as 'tunai' | 'qris' | 'debit'
      };

      await ordersApi.create(orderData);
      
      // Reset cart
      setCart([]);
      setSelectedMember('guest');
      
      toast.success(`✅ Transaksi berhasil!\nID Order: ${orderId}\nTotal: Rp ${total.toLocaleString('id-ID')}`);
      
    } catch (error) {
      console.error('Checkout failed:', error);
      toast.error('Transaksi gagal. Silakan coba lagi.');
    } finally {
      setProcessing(false);
    }
  };

  const handleResetCartClick = () => {
    if (cart.length === 0) return;
    setResetCartDialogOpen(true);
  };

  const confirmResetCart = () => {
    setCart([]);
    setResetCartDialogOpen(false);
    toast.success('Keranjang berhasil dikosongkan');
  };

  const filteredServices = services.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || s.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-orange-500" /></div>;
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-5rem)] gap-4">
      {/* Product Catalog Section */}
      <div className="flex-1 flex flex-col gap-3">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="text-xl font-bold text-orange-950">Kasir</h2>
              <p className="text-xs text-gray-500">Pilih layanan laundry</p>
            </div>
            {user?.role === 'admin' && (
              <Button
                onClick={() => setAddServiceDialogOpen(true)}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Tambah Layanan
              </Button>
            )}
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-orange-400" />
              <Input 
                placeholder="Cari layanan..." 
                className="pl-10 bg-white border-orange-200 focus-visible:ring-orange-400 h-9 rounded-full text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-medium transition-all border",
                  activeCategory === cat.id 
                    ? "bg-orange-500 text-white border-orange-500 shadow-md" 
                    : "bg-white text-gray-600 border-orange-100 hover:bg-orange-50"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <ScrollArea className="flex-1 pr-2">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 pb-2">
            {filteredServices.map((service) => (
              <Card 
                key={service.id} 
                className="cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-200 border border-orange-200 shadow-md bg-white group relative overflow-hidden h-full hover:border-orange-300"
                onClick={() => addToCart(service)}
              >
                <CardContent className="p-3 flex flex-col gap-2 h-full">
                  <div className="flex justify-between items-start">
                     {service.category === 'express' && (
                       <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-none absolute top-2 right-2 text-[9px] px-1.5 py-0 shadow-sm">Express</Badge>
                     )}
                     {service.category === 'satuan' && (
                       <Badge className="bg-gradient-to-r from-orange-400 to-orange-500 text-white border-none absolute top-2 right-2 text-[9px] px-1.5 py-0 shadow-sm">Satuan</Badge>
                     )}
                     {service.category === 'kiloan' && (
                       <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-none absolute top-2 right-2 text-[9px] px-1.5 py-0 shadow-sm">Kiloan</Badge>
                     )}
                  </div>
                  
                  <div className="pt-2">
                    <h3 className="font-bold text-sm text-gray-800 leading-tight mb-0.5 group-hover:text-orange-700 transition-colors">{service.name}</h3>
                    <p className="text-[10px] text-gray-500 line-clamp-1">{service.description}</p>
                  </div>

                  <div className="mt-auto">
                    <div className="text-base font-bold text-orange-600 group-hover:text-orange-700 transition-colors">
                      Rp {service.price.toLocaleString('id-ID')}<span className="text-[10px] font-normal text-gray-400">/{service.unit}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Cart Section */}
      <Card className="w-full lg:w-[360px] border-none shadow-xl bg-gradient-to-b from-white to-orange-50/30 flex flex-col lg:max-h-[calc(100vh-5rem)] ring-1 ring-orange-200 rounded-2xl overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100/50 pb-3 border-b border-orange-200 shrink-0">
          <div className="flex justify-between items-center mb-3">
            <div>
               <h3 className="text-lg font-bold text-orange-950 mb-0.5">Keranjang</h3>
               <p className="text-orange-500 font-medium text-xs">{cart.length} item</p>
            </div>
            {cart.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-500 hover:text-red-600 hover:bg-red-50 h-7 px-2 text-xs"
                onClick={() => setCart([])}
              >
                <Trash2 className="h-3 w-3 mr-1" /> Reset
              </Button>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Pelanggan</label>
            <Select value={selectedMember} onValueChange={setSelectedMember}>
              <SelectTrigger className="w-full bg-orange-50/50 border-orange-200 focus:ring-orange-500 h-9 text-sm">
                <SelectValue placeholder="Pilih Pelanggan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="guest">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span>Tamu (Guest)</span>
                  </div>
                </SelectItem>
                {members.map(m => (
                  <SelectItem key={m.id} value={m.id}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{m.name}</span>
                      <span className="text-xs text-gray-400">({m.points} pts)</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <ScrollArea className="flex-1 min-h-0 px-4 bg-gradient-to-b from-white to-orange-50/20">
          {cart.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-gray-300 gap-2">
              <ShoppingCart className="h-12 w-12 opacity-20" />
              <p className="text-xs">Belum ada item dipilih</p>
            </div>
          ) : (
            <div className="space-y-2 py-3">
              {cart.map((item) => (
                <div key={item.service.id} className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-orange-200 shadow-sm hover:shadow-md hover:border-orange-300 transition-all">
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="font-semibold text-gray-800 truncate text-sm">{item.service.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Badge variant="secondary" className="text-[9px] bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 border-orange-300 h-4 px-1">
                         {item.service.category}
                      </Badge>
                      <p className="text-[10px] text-gray-500 font-medium">Rp {item.service.price.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5 bg-orange-50 rounded-lg p-0.5">
                      <button 
                        className="h-5 w-5 flex items-center justify-center text-orange-600 hover:bg-orange-100 rounded transition-colors"
                        onClick={() => updateQty(item.service.id, -1)}
                      >
                        <Minus className="h-2.5 w-2.5" />
                      </button>
                      <span className="text-xs font-bold w-5 text-center">{item.qty}</span>
                      <button 
                        className="h-5 w-5 flex items-center justify-center text-orange-600 hover:bg-orange-100 rounded transition-colors"
                        onClick={() => updateQty(item.service.id, 1)}
                      >
                        <Plus className="h-2.5 w-2.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="p-4 bg-gradient-to-t from-white to-orange-50/50 border-t border-orange-200 space-y-3 shadow-[0_-4px_10px_-2px_rgba(0,0,0,0.05)] z-10 shrink-0">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Subtotal</span>
              <span>Rp {total.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Pajak (0%)</span>
              <span>Rp 0</span>
            </div>
            <Separator className="bg-orange-100 my-1.5" />
            <div className="flex justify-between items-end">
               <span className="font-bold text-gray-800 text-sm">Total</span>
               <span className="font-bold text-xl text-orange-600">Rp {total.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <div className="space-y-2">
             <div className="space-y-1">
                <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Metode Pembayaran</label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger className="w-full h-9 border-orange-200 bg-orange-50/30 focus:ring-orange-500 text-sm">
                    <SelectValue placeholder="Pilih Metode Pembayaran" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tunai">
                      <div className="flex items-center gap-2">
                        <Banknote className="h-4 w-4 text-orange-600" />
                        <span>Tunai (Cash)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="qris">
                      <div className="flex items-center gap-2">
                        <QrCode className="h-4 w-4 text-orange-600" />
                        <span>QRIS Scan</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="debit">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-orange-600" />
                        <span>Kartu Debit / Kredit</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
             </div>

            <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-orange-200 shadow-lg hover:shadow-xl transition-all h-10 text-sm font-bold rounded-xl" onClick={handleCheckoutClick} disabled={processing || cart.length === 0}>
              {processing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : <><CheckCircle className="mr-2 h-4 w-4" /> Bayar Sekarang</>}
            </Button>
          </div>
        </div>
      </Card>

      {/* Checkout Confirmation Dialog */}
      <AlertDialog open={checkoutDialogOpen} onOpenChange={setCheckoutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Pembayaran</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin memproses transaksi ini?
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Pelanggan:</span>
                  <strong>{selectedMember === 'guest' ? 'Guest' : members.find(m => m.id === selectedMember)?.name || 'Guest'}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Metode Pembayaran:</span>
                  <strong className="capitalize">{paymentMethod}</strong>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total:</span>
                  <span className="text-orange-600">Rp {total.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmCheckout}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Ya, Proses Pembayaran
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reset Cart Confirmation Dialog */}
      <AlertDialog open={resetCartDialogOpen} onOpenChange={setResetCartDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kosongkan Keranjang?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin mengosongkan keranjang? Semua item yang dipilih akan dihapus.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmResetCart}
              className="bg-orange-500 hover:bg-orange-600"
            >
              Ya, Kosongkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Service Dialog */}
      <Dialog open={addServiceDialogOpen} onOpenChange={setAddServiceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Layanan Baru</DialogTitle>
            <DialogDescription>
              Tambahkan jenis layanan laundry baru ke sistem
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="service-name">Nama Layanan *</Label>
              <Input
                id="service-name"
                placeholder="Contoh: Cuci Komplit"
                value={newService.name}
                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="service-price">Harga *</Label>
                <Input
                  id="service-price"
                  type="number"
                  placeholder="7000"
                  value={newService.price}
                  onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="service-unit">Satuan *</Label>
                <Select value={newService.unit} onValueChange={(value) => setNewService({ ...newService, unit: value })}>
                  <SelectTrigger id="service-unit">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="pcs">pcs</SelectItem>
                    <SelectItem value="m2">m²</SelectItem>
                    <SelectItem value="liter">liter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="service-category">Kategori *</Label>
              <Select 
                value={newService.category} 
                onValueChange={(value: 'kiloan' | 'satuan' | 'express') => setNewService({ ...newService, category: value })}
              >
                <SelectTrigger id="service-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kiloan">Kiloan</SelectItem>
                  <SelectItem value="satuan">Satuan</SelectItem>
                  <SelectItem value="express">Express</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="service-description">Deskripsi</Label>
              <Textarea
                id="service-description"
                placeholder="Contoh: Cuci + Gosok + Parfum"
                value={newService.description}
                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setAddServiceDialogOpen(false);
                setNewService({
                  name: '',
                  price: '',
                  unit: 'kg',
                  category: 'kiloan',
                  description: ''
                });
              }}
            >
              Batal
            </Button>
            <Button
              onClick={async () => {
                if (!newService.name || !newService.price) {
                  toast.error('Nama dan harga harus diisi');
                  return;
                }

                try {
                  // Generate ID otomatis - cari ID terbesar dan tambah 1
                  const existingIds = services.map(s => {
                    const match = s.id.match(/SV-(\d+)/);
                    return match ? parseInt(match[1]) : 0;
                  });
                  const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
                  const newId = `SV-${String(maxId + 1).padStart(3, '0')}`;

                  await servicesApi.create({
                    id: newId,
                    name: newService.name,
                    price: parseInt(newService.price),
                    unit: newService.unit,
                    category: newService.category,
                    icon: 'package', // Default icon (tidak digunakan di UI)
                    description: newService.description || null,
                    isActive: 1
                  });

                  toast.success('Layanan berhasil ditambahkan');
                  setAddServiceDialogOpen(false);
                  setNewService({
                    name: '',
                    price: '',
                    unit: 'kg',
                    category: 'kiloan',
                    description: ''
                  });
                  loadData(); // Refresh data
                } catch (error: any) {
                  toast.error(error.message || 'Gagal menambahkan layanan');
                }
              }}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
            >
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
