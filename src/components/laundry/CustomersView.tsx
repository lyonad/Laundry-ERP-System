import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "../ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { Label } from "../ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Search, UserPlus, Trash2, Star, Wallet, Loader2 } from "lucide-react";
import { membersApi } from '../../api/api';
import { Member } from './data';

export function CustomersView() {
  const [customerList, setCustomerList] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const data = await membersApi.getAll();
      setCustomerList(data);
    } catch (error) {
      console.error('Failed to load members:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customerList.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.phone.includes(searchQuery)
  );

  const handleAddMember = async () => {
    if (!newName || !newPhone) return;
    try {
      const newMember = {
        id: `M-${Date.now()}`,
        name: newName,
        phone: newPhone,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${newName}`,
        joinDate: new Date().toISOString().split('T')[0],
        expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        points: 0,
        totalSpend: 0
      };
      await membersApi.create(newMember);
      await loadMembers();
      setIsAddOpen(false);
      setNewName("");
      setNewPhone("");
    } catch (error) {
      console.error('Failed to add member:', error);
    }
  };

  const handleDeleteClick = (member: Member) => {
    setMemberToDelete(member);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!memberToDelete) return;
    try {
      await membersApi.delete(memberToDelete.id);
      await loadMembers();
      setDeleteDialogOpen(false);
      setMemberToDelete(null);
    } catch (error) {
      console.error('Failed to delete member:', error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-orange-500" /></div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-orange-950">Pelanggan & Membership</h2>
          <p className="text-orange-700/60">Kelola data pelanggan dan status member</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md">
              <UserPlus className="mr-2 h-4 w-4" /> Member Baru
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Member Baru</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Nama</Label>
                <Input id="name" value={newName} onChange={(e) => setNewName(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">No. HP</Label>
                <Input id="phone" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddMember} className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white">Simpan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4 bg-gradient-to-r from-orange-50 to-white p-4 rounded-xl border border-orange-200 shadow-md">
        <Search className="h-5 w-5 text-orange-500" />
        <Input 
          placeholder="Cari pelanggan berdasarkan nama atau nomor HP..." 
          className="border-none shadow-none focus-visible:ring-0 bg-transparent text-lg"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Card className="border-none shadow-lg bg-white ring-1 ring-orange-200 overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-orange-50 to-orange-100/50 border-orange-200">
                <TableHead className="text-orange-900 text-center w-[100px]">ID</TableHead>
                <TableHead className="text-orange-900">Nama Pelanggan</TableHead>
                <TableHead className="text-orange-900 text-center">Total Transaksi</TableHead>
                <TableHead className="text-orange-900 text-center">Poin</TableHead>
                <TableHead className="text-orange-900 text-center">Masa Berlaku</TableHead>
                <TableHead className="text-right text-orange-900">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((member) => (
                <TableRow key={member.id} className="hover:bg-orange-50/50 border-orange-200 transition-colors even:bg-orange-50/20">
                  <TableCell className="font-mono text-xs text-gray-500 text-center align-middle">{member.id}</TableCell>
                  <TableCell className="align-middle">
                    <div className="flex items-center gap-3">
                       <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback className="bg-orange-100 text-orange-600">{member.name.charAt(0)}</AvatarFallback>
                       </Avatar>
                       <div>
                          <div className="font-medium text-orange-950">{member.name}</div>
                          <div className="text-xs text-gray-500">{member.phone}</div>
                       </div>
                    </div>
                  </TableCell>
                  <TableCell className="align-middle">
                    <div className="flex items-center justify-center gap-2 text-gray-700">
                       <Wallet className="h-4 w-4 text-orange-400" />
                       <span className="font-medium">Rp {member.totalSpend.toLocaleString('id-ID')}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center align-middle">
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-200">
                       <Star className="h-3 w-3 mr-1 fill-current" />
                       {member.points} pts
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600 text-sm text-center align-middle">
                    {member.expiryDate}
                  </TableCell>
                  <TableCell className="text-right align-middle">
                     <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-400 hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleDeleteClick(member)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Member?</AlertDialogTitle>
            <AlertDialogDescription>
              {memberToDelete && (
                <>
                  Apakah Anda yakin ingin menghapus member <strong>{memberToDelete.name}</strong>? 
                  Tindakan ini tidak dapat dibatalkan dan semua data member akan dihapus permanen.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
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
