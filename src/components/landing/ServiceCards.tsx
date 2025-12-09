import React from 'react';
import { Button } from '../ui/button';
import { Star, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { servicesApi } from '../../api/api';
import { useEffect, useState } from 'react';

export const ServiceCards = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      // Check if user is logged in before making API call
      const token = localStorage.getItem('token');
      if (!token) {
        // Use fallback services if not logged in
        setServices([
          { id: '1', name: 'Cuci Komplit', price: 7000, unit: 'kg', category: 'kiloan', rating: '4.9', reviews: '120' },
          { id: '2', name: 'Setrika Saja', price: 4000, unit: 'kg', category: 'kiloan', rating: '4.8', reviews: '85' },
          { id: '3', name: 'Dry Cleaning', price: 20000, unit: 'pcs', category: 'satuan', rating: '4.7', reviews: '64' },
          { id: '4', name: 'Bed Cover', price: 15000, unit: 'pcs', category: 'satuan', rating: '4.9', reviews: '42' },
        ]);
        return;
      }

      const data = await servicesApi.getAll();
      // Take first 4 services for display
      setServices(data.slice(0, 4));
    } catch (error) {
      console.error('Failed to load services:', error);
      // Fallback services if API fails
      setServices([
        { id: '1', name: 'Cuci Komplit', price: 7000, unit: 'kg', category: 'kiloan', rating: '4.9', reviews: '120' },
        { id: '2', name: 'Setrika Saja', price: 4000, unit: 'kg', category: 'kiloan', rating: '4.8', reviews: '85' },
        { id: '3', name: 'Dry Cleaning', price: 20000, unit: 'pcs', category: 'satuan', rating: '4.7', reviews: '64' },
        { id: '4', name: 'Bed Cover', price: 15000, unit: 'pcs', category: 'satuan', rating: '4.9', reviews: '42' },
      ]);
    }
  };

  const displayServices = services.length > 0 ? services : [
    { id: '1', name: 'Cuci Komplit', price: 7000, unit: 'kg', category: 'kiloan', rating: '4.9', reviews: '120' },
    { id: '2', name: 'Setrika Saja', price: 4000, unit: 'kg', category: 'kiloan', rating: '4.8', reviews: '85' },
    { id: '3', name: 'Dry Cleaning', price: 20000, unit: 'pcs', category: 'satuan', rating: '4.7', reviews: '64' },
    { id: '4', name: 'Bed Cover', price: 15000, unit: 'pcs', category: 'satuan', rating: '4.9', reviews: '42' },
  ];

  const getServiceImage = (category: string) => {
    const images: Record<string, string> = {
      'kiloan': 'https://images.unsplash.com/photo-1567113463300-102a7eb3cb26?q=80&w=500&auto=format&fit=crop',
      'satuan': 'https://images.unsplash.com/photo-1489274495757-95c7c83700b0?q=80&w=500&auto=format&fit=crop',
      'express': 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=500&auto=format&fit=crop',
    };
    return images[category] || images['kiloan'];
  };

  const getServiceTag = (category: string) => {
    const tags: Record<string, string> = {
      'kiloan': 'Popular',
      'satuan': 'Premium',
      'express': 'Fast',
    };
    return tags[category] || 'Service';
  };

  return (
    <section id="services" className="py-20 bg-orange-50/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Services</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Choose from our range of professional laundry services tailored to your specific needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayServices.map((service, idx) => (
            <div key={service.id || idx} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={getServiceImage(service.category)} 
                  alt={service.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-orange-600 uppercase tracking-wider">
                  {getServiceTag(service.category)}
                </div>
              </div>
              
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                   <div className="bg-orange-50 text-orange-600 px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                     <Clock className="w-3 h-3" /> 24h
                   </div>
                   <div className="flex items-center gap-1 text-yellow-500 text-xs font-bold">
                     <Star className="w-3 h-3 fill-current" />
                     {service.rating || '4.9'} <span className="text-gray-400 font-normal">({service.reviews || '120'})</span>
                   </div>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2">{service.name}</h3>
                
                <div className="flex items-end gap-1 mb-4">
                  <span className="text-2xl font-bold text-orange-500">Rp {service.price?.toLocaleString('id-ID') || '0'}</span>
                  <span className="text-sm text-gray-400 mb-1">/{service.unit}</span>
                </div>
                
                <Button 
                  className="w-full bg-white text-orange-500 border-2 border-orange-100 hover:bg-orange-50 hover:border-orange-200 shadow-none"
                  onClick={() => {
                    const token = localStorage.getItem('token');
                    if (token) {
                      navigate('/app/pos');
                    } else {
                      navigate('/login');
                    }
                  }}
                >
                  Book Now
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

