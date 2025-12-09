import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authApi } from '@/api/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft } from 'lucide-react';

export default function LoginView() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialType = searchParams.get('type') === 'admin' ? 'admin' : 'customer';
  const [loginType, setLoginType] = useState<'admin' | 'customer'>(initialType);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Update loginType when URL query parameter changes
  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam === 'admin' || typeParam === 'customer') {
      setLoginType(typeParam);
      setError('');
      setUsername('');
      setPassword('');
      setPhone('');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let response;
      if (loginType === 'customer') {
        // Customer login: phone only
        if (!phone.trim()) {
          setError('Nomor telepon harus diisi');
          setLoading(false);
          return;
        }
        response = await authApi.login(undefined, undefined, phone.trim());
      } else {
        // Admin login: username + password
        if (!username.trim() || !password.trim()) {
          setError('Username dan password harus diisi');
          setLoading(false);
          return;
        }
        response = await authApi.login(username.trim(), password.trim());
      }
      
      // Store user info in localStorage
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('token', response.token);
      
      // Redirect to dashboard
      navigate('/app');
    } catch (err: any) {
      // Extract error message from response
      let errorMessage = 'Login gagal. Silakan coba lagi.';
      if (err?.error) {
        errorMessage = err.error;
      } else if (err?.message) {
        errorMessage = err.message;
      }
      console.error('Login error:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 p-4">
      <div className="absolute top-4 left-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Beranda
        </Button>
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
              <svg 
                className="w-10 h-10 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
                />
              </svg>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">ERP Laundry</CardTitle>
          <CardDescription>
            Login ke sistem untuk melanjutkan
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Login Type Toggle */}
          <div className="mb-6 flex gap-2 p-1 bg-orange-50 rounded-lg">
            <button
              type="button"
              onClick={() => {
                setLoginType('customer');
                setError('');
                setUsername('');
                setPassword('');
                setPhone('');
              }}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                loginType === 'customer'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-orange-600 hover:bg-orange-100'
              }`}
            >
              🛍️ Customer
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginType('admin');
                setError('');
                setUsername('');
                setPassword('');
                setPhone('');
              }}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                loginType === 'admin'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-orange-600 hover:bg-orange-100'
              }`}
            >
              👤 Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {loginType === 'customer' ? (
              <div className="space-y-2">
                <Label htmlFor="phone">Nomor Telepon</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Masukkan nomor telepon (contoh: 081234567890)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  autoFocus
                />
                <p className="text-xs text-gray-500">Login sebagai customer hanya memerlukan nomor telepon</p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Masukkan username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            <Button 
              type="submit" 
              className="w-full bg-orange-500 hover:bg-orange-600 text-white" 
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Login'}
            </Button>

            <div className="mt-4 space-y-3">
              {loginType === 'admin' ? (
                <div className="p-3 bg-orange-50 rounded-lg text-sm">
                  <p className="font-medium text-orange-900 mb-1">👤 Admin (Pemilik Toko):</p>
                  <p className="text-orange-700">Username: <strong>admin</strong></p>
                  <p className="text-orange-700">Password: <strong>admin123</strong></p>
                </div>
              ) : (
                <div className="p-3 bg-orange-50 rounded-lg text-sm">
                  <p className="font-medium text-orange-900 mb-1">🛍️ Pelanggan (Customer):</p>
                  <p className="text-orange-700">Nomor Telepon: <strong>081234567890</strong></p>
                  <p className="text-orange-700 text-xs mt-1">*Tidak perlu password, cukup nomor telepon</p>
                </div>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
