import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Settings, User, Bell, Shield, Database, Save } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { toast } from 'sonner';

type TabItem = {
  value: string;
  label: string;
  icon: LucideIcon;
};

const resolveSettingsKey = (currentUser: any) => {
  const identifier =
    currentUser?.id ??
    currentUser?.userId ??
    currentUser?.username ??
    'default';
  return `settings_${currentUser?.role || 'guest'}_${identifier}`;
};

const getAdminDefaults = () => ({
  businessName: 'CleanPress Laundry',
  businessPhone: '081234567890',
  businessAddress: 'Jl. Contoh No. 123, Jakarta',
  businessEmail: 'info@cleanpress.com',
  compactMode: false,
  showAvatar: true,
  autoBackup: true,
  backupTime: '02:00',
  currency: 'IDR',
  timezone: 'Asia/Jakarta',
  emailNotifications: true,
  orderNotifications: true,
  inventoryNotifications: true,
  paymentNotifications: true,
  smsNotifications: false,
});

const getCustomerDefaults = () => ({
  compactMode: false,
  showAvatar: true,
  autoRefresh: true,
  language: 'Indonesia',
  emailNotifications: true,
  orderNotifications: true,
  statusNotifications: true,
  promoNotifications: true,
});

const adminNotificationOptions = [
  { key: 'emailNotifications', label: 'Email', description: 'Terima rangkuman aktivitas via email' },
  { key: 'orderNotifications', label: 'Pesanan Baru', description: 'Notifikasi setiap ada pesanan masuk' },
  { key: 'inventoryNotifications', label: 'Stok Menipis', description: 'Pemberitahuan stok hampir habis' },
  { key: 'paymentNotifications', label: 'Pembayaran', description: 'Informasi transaksi dan tagihan pelanggan' },
  { key: 'smsNotifications', label: 'SMS Cadangan', description: 'Aktifkan SMS bila email gagal terkirim' },
];

const customerNotificationOptions = [
  { key: 'emailNotifications', label: 'Email', description: 'Rangkuman status pesanan dikirim ke email' },
  { key: 'orderNotifications', label: 'Pesanan', description: 'Notifikasi saat status pesanan berubah' },
  { key: 'statusNotifications', label: 'Siap Diambil', description: 'Pemberitahuan saat laundry siap diambil' },
  { key: 'promoNotifications', label: 'Promo & Diskon', description: 'Informasi promo terbaru dari CleanPress' },
];

const adminTabs: TabItem[] = [
  { value: 'general', label: 'Umum', icon: Settings },
  { value: 'profile', label: 'Profil', icon: User },
  { value: 'notifications', label: 'Notifikasi', icon: Bell },
  { value: 'security', label: 'Keamanan', icon: Shield },
  { value: 'system', label: 'Sistem', icon: Database },
];

const customerTabs: TabItem[] = [
  { value: 'preferences', label: 'Preferensi', icon: Settings },
  { value: 'profile', label: 'Profil', icon: User },
  { value: 'notifications', label: 'Notifikasi', icon: Bell },
  { value: 'security', label: 'Keamanan', icon: Shield },
];

export function SettingsView() {
  const [user, setUser] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      return;
    }

    try {
      setUser(JSON.parse(storedUser));
    } catch (error) {
      console.error('Failed to parse user from storage', error);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    const defaults = isAdmin ? getAdminDefaults() : getCustomerDefaults();

    try {
      const storedSettings = localStorage.getItem(resolveSettingsKey(user));
      if (storedSettings) {
        const parsed = JSON.parse(storedSettings);
        setSettings({ ...defaults, ...parsed });
      } else {
        setSettings(defaults);
        localStorage.setItem(resolveSettingsKey(user), JSON.stringify(defaults));
      }
    } catch (error) {
      console.error('Failed to load settings', error);
      setSettings(defaults);
    }
  }, [user, isAdmin]);

  const handleSave = () => {
    if (!user || !settings) {
      return;
    }

    try {
      localStorage.setItem(resolveSettingsKey(user), JSON.stringify(settings));
      toast.success('Pengaturan berhasil disimpan');
    } catch (error) {
      console.error('Failed to save settings', error);
      toast.error('Gagal menyimpan pengaturan');
    }
  };

  const handleResetSettings = () => {
    if (!user) {
      return;
    }

    const defaults = isAdmin ? getAdminDefaults() : getCustomerDefaults();
    setSettings({ ...defaults });

    try {
      localStorage.setItem(resolveSettingsKey(user), JSON.stringify(defaults));
      toast.success('Pengaturan dikembalikan ke default');
    } catch (error) {
      console.error('Failed to reset settings', error);
      toast.error('Tidak dapat mereset pengaturan');
    }
  };

  if (!user || !settings) {
    return <div className="p-6 text-sm text-orange-600">Memuat pengaturan terbaru untuk akun Anda...</div>;
  }

  const tabs = isAdmin ? adminTabs : customerTabs;
  const notificationOptions = isAdmin ? adminNotificationOptions : customerNotificationOptions;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-orange-950">Pengaturan</h2>
          <p className="text-orange-600 mt-1">Kelola preferensi dan konfigurasi sistem</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleResetSettings}>
            Reset ke Default
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Simpan Perubahan
          </Button>
        </div>
      </div>

      <Tabs defaultValue={tabs[0].value} className="space-y-6">
        <TabsList className="flex flex-wrap gap-2">
          {tabs.map(({ value, label, icon: Icon }) => (
            <TabsTrigger key={value} value={value} className="gap-2">
              <Icon className="h-4 w-4" />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {isAdmin && (
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Bisnis</CardTitle>
                <CardDescription>Pengaturan informasi dasar bisnis laundry Anda</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Nama Bisnis</Label>
                    <Input
                      id="businessName"
                      value={settings.businessName}
                      onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessPhone">Nomor Telepon</Label>
                    <Input
                      id="businessPhone"
                      value={settings.businessPhone}
                      onChange={(e) => setSettings({ ...settings, businessPhone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessAddress">Alamat</Label>
                  <Input
                    id="businessAddress"
                    value={settings.businessAddress}
                    onChange={(e) => setSettings({ ...settings, businessAddress: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessEmail">Email</Label>
                  <Input
                    id="businessEmail"
                    type="email"
                    value={settings.businessEmail}
                    onChange={(e) => setSettings({ ...settings, businessEmail: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tampilan</CardTitle>
                <CardDescription>Sesuaikan tampilan aplikasi untuk tim Anda</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Mode Kompak</Label>
                    <p className="text-sm text-gray-500">Tampilkan lebih banyak data dalam satu layar</p>
                  </div>
                  <Switch
                    checked={settings.compactMode}
                    onCheckedChange={(checked) => setSettings({ ...settings, compactMode: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Tampilkan Avatar</Label>
                    <p className="text-sm text-gray-500">Tampilkan foto profil di sidebar</p>
                  </div>
                  <Switch
                    checked={settings.showAvatar}
                    onCheckedChange={(checked) => setSettings({ ...settings, showAvatar: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {!isAdmin && (
          <TabsContent value="preferences" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Preferensi Tampilan</CardTitle>
                <CardDescription>Atur cara Anda melihat status pesanan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Mode Kompak</Label>
                    <p className="text-sm text-gray-500">Tampilkan lebih banyak pesanan dalam satu layar</p>
                  </div>
                  <Switch
                    checked={settings.compactMode}
                    onCheckedChange={(checked) => setSettings({ ...settings, compactMode: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto Refresh</Label>
                    <p className="text-sm text-gray-500">Perbarui status pesanan otomatis setiap 5 menit</p>
                  </div>
                  <Switch
                    checked={settings.autoRefresh}
                    onCheckedChange={(checked) => setSettings({ ...settings, autoRefresh: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Tampilkan Avatar</Label>
                    <p className="text-sm text-gray-500">Lihat foto profil Anda di menu</p>
                  </div>
                  <Switch
                    checked={settings.showAvatar}
                    onCheckedChange={(checked) => setSettings({ ...settings, showAvatar: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bahasa & Zona Waktu</CardTitle>
                <CardDescription>Pengaturan tampilan yang relevan untuk pelanggan</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Bahasa</Label>
                  <Input id="language" value={settings.language} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Zona Waktu</Label>
                  <Input value="Asia/Jakarta" disabled />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Profil</CardTitle>
              <CardDescription>Kelola informasi akun Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-lg border border-orange-100">
                <div className="h-16 w-16 rounded-full bg-orange-200 flex items-center justify-center text-2xl font-bold text-orange-700">
                  {user.fullName?.charAt(0) || 'A'}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-orange-950">{user.fullName}</h3>
                  <p className="text-sm text-orange-600">{user.email}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Role: <span className="font-medium capitalize">{user.role}</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Username</Label>
                  <Input value={user.username} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Input value={user.role} disabled className="capitalize" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={user.email} disabled />
              </div>

              <div className="space-y-2">
                <Label>Nama Lengkap</Label>
                <Input value={user.fullName} placeholder="Nama lengkap Anda" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ubah Password</CardTitle>
              <CardDescription>Ganti password untuk keamanan akun</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Password Saat Ini</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">Password Baru</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
                <Input id="confirmPassword" type="password" />
              </div>
              <Button className="w-full">Ubah Password</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Preferensi Notifikasi</CardTitle>
              <CardDescription>Pilih notifikasi yang ingin Anda terima</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {notificationOptions.map(({ key, label, description }) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{label}</Label>
                    <p className="text-sm text-gray-500">{description}</p>
                  </div>
                  <Switch
                    checked={Boolean(settings[key])}
                    onCheckedChange={(checked) => setSettings({ ...settings, [key]: checked })}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Keamanan Akun</CardTitle>
              <CardDescription>Pengaturan keamanan dan privasi</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <h4 className="font-semibold text-green-900">Status Keamanan: Aman</h4>
                </div>
                <p className="text-sm text-green-700">
                  Akun Anda dilindungi dengan enkripsi password dan token otentikasi
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Password Terenkripsi</p>
                    <p className="text-sm text-gray-500">bcrypt dengan salt 10 rounds</p>
                  </div>
                  <span className="text-green-600">✓ Aktif</span>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">JWT Authentication</p>
                    <p className="text-sm text-gray-500">Token berlaku 24 jam</p>
                  </div>
                  <span className="text-green-600">✓ Aktif</span>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">HTTP-Only Cookies</p>
                    <p className="text-sm text-gray-500">Proteksi dari serangan XSS</p>
                  </div>
                  <span className="text-green-600">✓ Aktif</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button variant="destructive" className="w-full">
                  Hapus Semua Sesi Aktif
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="system" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan Sistem</CardTitle>
                <CardDescription>Konfigurasi sistem dan database</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Backup Otomatis</Label>
                    <p className="text-sm text-gray-500">Backup database secara otomatis</p>
                  </div>
                  <Switch
                    checked={settings.autoBackup}
                    onCheckedChange={(checked) => setSettings({ ...settings, autoBackup: checked })}
                  />
                </div>

                {settings.autoBackup && (
                  <div className="space-y-2">
                    <Label htmlFor="backupTime">Waktu Backup</Label>
                    <Input
                      id="backupTime"
                      type="time"
                      value={settings.backupTime}
                      onChange={(e) => setSettings({ ...settings, backupTime: e.target.value })}
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Mata Uang</Label>
                    <Input id="currency" value={settings.currency} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Zona Waktu</Label>
                    <Input id="timezone" value={settings.timezone} disabled />
                  </div>
                </div>

                <div className="pt-4 border-t space-y-2">
                  <Button variant="outline" className="w-full">
                    <Database className="h-4 w-4 mr-2" />
                    Backup Database Sekarang
                  </Button>
                  <Button variant="outline" className="w-full">
                    Restore dari Backup
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informasi Sistem</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500">Versi Aplikasi</p>
                    <p className="font-semibold">2.0.0</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Database</p>
                    <p className="font-semibold">SQLite</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Backend</p>
                    <p className="font-semibold">Node.js + Express</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Frontend</p>
                    <p className="font-semibold">React + TypeScript</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}