import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Plus, AlertCircle, CheckSquare, Phone, Loader2, Edit } from "lucide-react";
import { inventoryApi } from '../../api/api';
import { InventoryItem } from './data';

export function InventoryView() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSupplier, setSelectedSupplier] = useState<InventoryItem | null>(null);
  const [isRestockOpen, setIsRestockOpen] = useState(false);
  const [restockItem, setRestockItem] = useState<InventoryItem | null>(null);
  const [restockQty, setRestockQty] = useState('');

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const data = await inventoryApi.getAll();
      setInventory(data);
    } catch (error) {
      console.error('Failed to load inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestock = async () => {
    if (!restockItem || !restockQty) return;
    try {
      await inventoryApi.updateStock(restockItem.id, parseInt(restockQty), 'add');
      await loadInventory();
      setIsRestockOpen(false);
      setRestockItem(null);
      setRestockQty('');
    } catch (error) {
      console.error('Failed to restock:', error);
    }
  };

  const openRestockDialog = (item: InventoryItem) => {
    setRestockItem(item);
    setIsRestockOpen(true);
  };

  const handleContact = (item: InventoryItem) => {
    setSelectedSupplier(item);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-orange-500" /></div>;
  }

  const lowStockCount = inventory.filter(i => i.stock <= i.minStock).length;
  const suppliersCount = [...new Set(inventory.map(i => i.supplier))].length;

  return (
    <div className="space-y-6 p-1">
      <Dialog open={isRestockOpen} onOpenChange={setIsRestockOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restock Barang</DialogTitle>
            <DialogDescription>Tambah stok {restockItem?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Jumlah Restock ({restockItem?.unit})</Label>
              <Input
                type="number"
                value={restockQty}
                onChange={(e) => setRestockQty(e.target.value)}
                placeholder="Masukkan jumlah"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRestockOpen(false)}>Batal</Button>
            <Button onClick={handleRestock} className="bg-orange-500 hover:bg-orange-600">Restock</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedSupplier} onOpenChange={(open) => !open && setSelectedSupplier(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hubungi Supplier</DialogTitle>
            <DialogDescription>
              Anda akan diarahkan untuk menghubungi supplier ini.
            </DialogDescription>
          </DialogHeader>
          {selectedSupplier && (
            <div className="py-4 space-y-3">
               <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                  <h4 className="font-semibold text-orange-900">{selectedSupplier.supplier}</h4>
                  <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                    <Phone className="h-4 w-4" /> {selectedSupplier.supplierContact}
                  </p>
               </div>
               <p className="text-sm text-gray-500">Barang yang akan di-restock:</p>
               <div className="font-medium">{selectedSupplier.name} (Kode: {selectedSupplier.code})</div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedSupplier(null)}>Batal</Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <Phone className="mr-2 h-4 w-4" /> Chat WhatsApp
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-orange-950">Supply Chain Management</h2>
          <p className="text-orange-700/60">Pantau stok bahan baku laundry</p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-md hover:shadow-lg transition-all">
          <Plus className="mr-2 h-4 w-4" /> Restock Barang
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-none shadow-sm bg-white/80 backdrop-blur-sm ring-1 ring-orange-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-900">Total Item</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-500">{inventory.length}</div>
            <p className="text-xs text-orange-700/60">Jenis bahan baku terdaftar</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white/80 backdrop-blur-sm ring-1 ring-orange-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-900">Perlu Restock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">{lowStockCount}</div>
            <p className="text-xs text-orange-700/60">Item di bawah batas minimum</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white/80 backdrop-blur-sm ring-1 ring-orange-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-900">Supplier Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-500">{suppliersCount}</div>
            <p className="text-xs text-orange-700/60">Mitra supplier terhubung</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-md bg-white ring-1 ring-orange-100 overflow-hidden">
        <CardHeader className="bg-orange-50/50 border-b border-orange-100">
          <CardTitle className="text-lg text-orange-950">Inventaris Gudang</CardTitle>
          <CardDescription>Daftar real-time ketersediaan bahan</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-orange-50/50 border-orange-100">
                <TableHead className="text-orange-900">Kode</TableHead>
                <TableHead className="text-orange-900">Nama Barang</TableHead>
                <TableHead className="text-orange-900">Harga Satuan</TableHead>
                <TableHead className="text-orange-900">Stok Saat Ini</TableHead>
                <TableHead className="text-orange-900">Status</TableHead>
                <TableHead className="text-orange-900">Supplier</TableHead>
                <TableHead className="text-right text-orange-900">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((item) => (
                <TableRow key={item.id} className="hover:bg-orange-50/30 border-orange-100">
                  <TableCell className="font-mono text-xs text-gray-500">{item.code}</TableCell>
                  <TableCell className="font-medium text-orange-950">{item.name}</TableCell>
                  <TableCell>Rp {item.price.toLocaleString('id-ID')}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-gray-700">
                        {item.stock} {item.unit}
                      </span>
                      <Progress 
                        value={(item.stock / (item.minStock * 3)) * 100} 
                        className="h-1.5 w-24 bg-orange-100" 
                        // indicatorClassName={item.stock <= item.minStock ? "bg-red-400" : "bg-green-400"} // Note: shadcn progress usually doesn't take indicator prop directly easily, simplified for now
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.stock <= item.minStock ? (
                      <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 flex w-fit items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> Menipis
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 flex w-fit items-center gap-1">
                        <CheckSquare className="h-3 w-3" /> Aman
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-gray-600">{item.supplier}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-green-500 hover:text-green-700 hover:bg-green-50"
                        onClick={() => openRestockDialog(item)}
                      >
                        <Plus className="h-3 w-3 mr-1" /> Restock
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-orange-500 hover:text-orange-700 hover:bg-orange-50"
                        onClick={() => handleContact(item)}
                      >
                        <Phone className="h-3 w-3 mr-1" /> Supplier
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
