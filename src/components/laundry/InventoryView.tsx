import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Plus, AlertCircle, CheckSquare, Phone, Loader2, Edit, Trash2, Package, Link2 } from "lucide-react";
import { inventoryApi, serviceMaterialsApi, servicesApi } from '../../api/api';
import { InventoryItem } from './data';
import { toast } from 'sonner';

export function InventoryView() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [serviceMaterials, setServiceMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSupplier, setSelectedSupplier] = useState<InventoryItem | null>(null);
  const [isRestockOpen, setIsRestockOpen] = useState(false);
  const [restockItem, setRestockItem] = useState<InventoryItem | null>(null);
  const [restockQty, setRestockQty] = useState('');
  
  // Service Materials Dialog States
  const [isMaterialDialogOpen, setIsMaterialDialogOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<any | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [selectedInventoryId, setSelectedInventoryId] = useState<string>('');
  const [materialQuantity, setMaterialQuantity] = useState<string>('');
  const [materialUnit, setMaterialUnit] = useState<string>('');
  const [deleteMaterialDialogOpen, setDeleteMaterialDialogOpen] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState<any | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [inventoryData, servicesData, materialsData] = await Promise.all([
        inventoryApi.getAll(),
        servicesApi.getAll(),
        serviceMaterialsApi.getAll()
      ]);
      setInventory(inventoryData);
      setServices(servicesData);
      setServiceMaterials(materialsData);
    } catch (error) {
      console.error('Failed to load data:', error);
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

  // Service Materials Handlers
  const openMaterialDialog = (serviceId?: string, material?: any) => {
    if (material) {
      setEditingMaterial(material);
      setSelectedServiceId(material.serviceId);
      setSelectedInventoryId(material.inventoryId);
      setMaterialQuantity(material.quantity.toString());
      setMaterialUnit(material.unit);
    } else {
      setEditingMaterial(null);
      setSelectedServiceId(serviceId || '');
      setSelectedInventoryId('');
      setMaterialQuantity('');
      setMaterialUnit('');
    }
    setIsMaterialDialogOpen(true);
  };

  const closeMaterialDialog = () => {
    setIsMaterialDialogOpen(false);
    setEditingMaterial(null);
    setSelectedServiceId('');
    setSelectedInventoryId('');
    setMaterialQuantity('');
    setMaterialUnit('');
  };

  const handleSaveMaterial = async () => {
    if (!selectedServiceId || !selectedInventoryId || !materialQuantity || !materialUnit) {
      toast.error('Semua field harus diisi');
      return;
    }

    try {
      if (editingMaterial) {
        await serviceMaterialsApi.update(editingMaterial.id, {
          quantity: parseFloat(materialQuantity),
          unit: materialUnit
        });
        toast.success('Bahan layanan berhasil diupdate');
      } else {
        await serviceMaterialsApi.create({
          serviceId: selectedServiceId,
          inventoryId: selectedInventoryId,
          quantity: parseFloat(materialQuantity),
          unit: materialUnit
        });
        toast.success('Bahan layanan berhasil ditambahkan');
      }
      await loadData();
      closeMaterialDialog();
    } catch (error: any) {
      toast.error(error.message || 'Gagal menyimpan bahan layanan');
    }
  };

  const handleDeleteMaterialClick = (material: any) => {
    setMaterialToDelete(material);
    setDeleteMaterialDialogOpen(true);
  };

  const confirmDeleteMaterial = async () => {
    if (!materialToDelete) return;
    
    try {
      await serviceMaterialsApi.delete(materialToDelete.id);
      toast.success('Bahan layanan berhasil dihapus');
      await loadData();
      setDeleteMaterialDialogOpen(false);
      setMaterialToDelete(null);
    } catch (error: any) {
      toast.error(error.message || 'Gagal menghapus bahan layanan');
    }
  };

  const getMaterialsByService = (serviceId: string) => {
    return serviceMaterials.filter(m => m.serviceId === serviceId);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-orange-500" /></div>;
  }

  const lowStockCount = inventory.filter(i => i.stock <= i.minStock).length;
  const suppliersCount = [...new Set(inventory.map(i => i.supplier))].length;

  return (
    <div className="space-y-6 p-1">
      {/* Service Materials Dialog */}
      <Dialog open={isMaterialDialogOpen} onOpenChange={setIsMaterialDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingMaterial ? 'Edit Bahan Layanan' : 'Tambah Bahan Layanan'}
            </DialogTitle>
            <DialogDescription>
              {editingMaterial 
                ? 'Ubah jumlah dan unit bahan yang digunakan untuk layanan ini'
                : 'Pilih layanan dan bahan yang akan digunakan'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Layanan</Label>
              <Select 
                value={selectedServiceId} 
                onValueChange={setSelectedServiceId}
                disabled={!!editingMaterial}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Layanan" />
                </SelectTrigger>
                <SelectContent>
                  {services.map(service => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Bahan Inventory</Label>
              <Select 
                value={selectedInventoryId} 
                onValueChange={setSelectedInventoryId}
                disabled={!!editingMaterial}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Bahan" />
                </SelectTrigger>
                <SelectContent>
                  {inventory.map(item => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name} ({item.code}) - Stok: {item.stock} {item.unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Jumlah</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={materialQuantity}
                  onChange={(e) => setMaterialQuantity(e.target.value)}
                  placeholder="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Unit</Label>
                <Input
                  value={materialUnit}
                  onChange={(e) => setMaterialUnit(e.target.value)}
                  placeholder="kg, liter, pcs"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeMaterialDialog}>Batal</Button>
            <Button onClick={handleSaveMaterial} className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white">
              {editingMaterial ? 'Update' : 'Simpan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
            <Button onClick={handleRestock} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white">Restock</Button>
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
            <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white">
              <Phone className="mr-2 h-4 w-4" /> Chat WhatsApp
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-orange-950">Supply Chain Management</h2>
          <p className="text-orange-700/60">Pantau stok bahan baku laundry dan mapping layanan</p>
        </div>
      </div>

      <Tabs defaultValue="inventory" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="inventory">Inventaris</TabsTrigger>
          <TabsTrigger value="materials">Mapping Bahan Layanan</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-6">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-none shadow-sm bg-gradient-to-br from-orange-50 to-orange-100/50 ring-1 ring-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-900">Total Item</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{inventory.length}</div>
            <p className="text-xs text-orange-700/60">Jenis bahan baku terdaftar</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-gradient-to-br from-red-50 to-orange-50 ring-1 ring-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-900">Perlu Restock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{lowStockCount}</div>
            <p className="text-xs text-red-700/60">Item di bawah batas minimum</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-gradient-to-br from-amber-50 to-orange-50 ring-1 ring-amber-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-900">Supplier Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">{suppliersCount}</div>
            <p className="text-xs text-amber-700/60">Mitra supplier terhubung</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-lg bg-white ring-1 ring-orange-200 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100/50 border-b border-orange-200">
          <CardTitle className="text-lg text-orange-950">Inventaris Gudang</CardTitle>
          <CardDescription className="text-orange-700/70">Daftar real-time ketersediaan bahan</CardDescription>
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
                <TableRow key={item.id} className="hover:bg-orange-50/50 border-orange-200 transition-colors even:bg-orange-50/20">
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
                      <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200 flex w-fit items-center gap-1">
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
                        className="text-orange-500 hover:text-orange-700 hover:bg-orange-50"
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
        </TabsContent>

        <TabsContent value="materials" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-orange-950">Mapping Bahan ke Layanan</h3>
              <p className="text-sm text-orange-700/60">Kelola bahan yang digunakan untuk setiap layanan</p>
            </div>
            <Button 
              onClick={() => openMaterialDialog()}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
            >
              <Plus className="mr-2 h-4 w-4" /> Tambah Mapping
            </Button>
          </div>

          <div className="grid gap-4">
            {services.map(service => {
              const materials = getMaterialsByService(service.id);
              return (
                <Card key={service.id} className="border-none shadow-md bg-white ring-1 ring-orange-200 hover:shadow-lg hover:ring-orange-300 transition-all">
                  <CardHeader className="pb-3 bg-gradient-to-r from-orange-50 to-orange-100/50 border-b border-orange-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg text-orange-950">{service.name}</CardTitle>
                        <CardDescription className="text-orange-700/70">{service.description || service.category}</CardDescription>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openMaterialDialog(service.id)}
                        className="border-orange-300 text-orange-600 hover:bg-orange-100 hover:border-orange-400"
                      >
                        <Plus className="h-3 w-3 mr-1" /> Tambah Bahan
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {materials.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">
                        <Package className="h-12 w-12 mx-auto mb-2 opacity-20" />
                        <p className="text-sm">Belum ada bahan yang di-mapping</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openMaterialDialog(service.id)}
                          className="mt-2 text-orange-600"
                        >
                          <Plus className="h-3 w-3 mr-1" /> Tambah Bahan Pertama
                        </Button>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-orange-50/30 hover:bg-orange-100/50 border-orange-200 transition-colors">
                            <TableHead className="text-orange-900">Bahan</TableHead>
                            <TableHead className="text-orange-900">Jumlah</TableHead>
                            <TableHead className="text-orange-900">Stok Tersedia</TableHead>
                            <TableHead className="text-right text-orange-900">Aksi</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {materials.map((material) => (
                            <TableRow key={material.id} className="hover:bg-orange-50/50 border-orange-200 transition-colors even:bg-orange-50/20">
                              <TableCell>
                                <div>
                                  <div className="font-medium text-orange-950">{material.inventoryName}</div>
                                  <div className="text-xs text-gray-500">{material.inventoryCode}</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{material.quantity}</span>
                                  <span className="text-sm text-gray-500">{material.unit}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <span className={material.inventoryStock <= 0 ? 'text-red-600 font-medium' : 'text-gray-700'}>
                                    {material.inventoryStock}
                                  </span>
                                  <span className="text-sm text-gray-500">{material.inventoryUnit}</span>
                                  {material.inventoryStock <= 0 && (
                                    <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 text-xs">
                                      Habis
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex gap-2 justify-end">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openMaterialDialog(service.id, material)}
                                    className="text-orange-500 hover:text-orange-700 hover:bg-orange-50"
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteMaterialClick(material)}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Delete Material Confirmation Dialog */}
      <AlertDialog open={deleteMaterialDialogOpen} onOpenChange={setDeleteMaterialDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Mapping Bahan?</AlertDialogTitle>
            <AlertDialogDescription>
              {materialToDelete && (
                <>
                  Apakah Anda yakin ingin menghapus mapping bahan <strong>{materialToDelete.inventoryName}</strong> 
                  dari layanan <strong>{materialToDelete.serviceName}</strong>? 
                  Tindakan ini tidak dapat dibatalkan.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteMaterial}
              className="bg-orange-500 hover:bg-orange-600"
            >
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
