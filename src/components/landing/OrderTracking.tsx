import React, { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { ordersApi } from '../../api/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const OrderTracking = () => {
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleTrack = async () => {
    if (!orderId.trim()) {
      toast.error('Masukkan Order ID terlebih dahulu');
      return;
    }

    setLoading(true);
    try {
      // Check if user is logged in
      const token = localStorage.getItem('token');
      if (!token) {
        // If not logged in, redirect to login
        toast.info('Silakan login terlebih dahulu untuk tracking order');
        navigate('/login');
        return;
      }

      // Try to get order
      const order = await ordersApi.getById(orderId.trim());
      if (order) {
        // Navigate to orders page
        navigate('/app/orders');
        toast.success('Order ditemukan!');
      }
    } catch (error: any) {
      if (error.status === 401) {
        toast.info('Silakan login terlebih dahulu untuk tracking order');
        navigate('/login');
      } else {
        toast.error('Order tidak ditemukan. Pastikan Order ID benar.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="tracking" className="py-16 bg-white">
      <div className="container mx-auto px-4 text-center max-w-3xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Track Your Order</h2>
        <p className="text-gray-500 mb-8">Enter your Order ID to check the current status of your laundry.</p>
        
        <div className="relative flex items-center max-w-xl mx-auto">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type="text" 
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleTrack()}
              className="block w-full p-4 pl-12 text-sm text-gray-900 border border-gray-200 rounded-full bg-gray-50 focus:ring-orange-500 focus:border-orange-500 shadow-sm outline-none" 
              placeholder="Search for Order ID (e.g., TRX-12345)..." 
            />
            <Button 
              className="absolute right-2 bottom-2 top-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white px-6"
              onClick={handleTrack}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Track'} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

