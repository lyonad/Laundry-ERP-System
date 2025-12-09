import React from 'react';
import { Button } from './ui/button';
import { Star, Clock, Tag } from 'lucide-react';

const services = [
  {
    title: "Wash & Fold",
    price: "$1.50",
    unit: "/ lb",
    rating: "4.9",
    reviews: "120",
    image: "https://images.unsplash.com/photo-1567113463300-102a7eb3cb26?q=80&w=500&auto=format&fit=crop",
    tag: "Popular"
  },
  {
    title: "Dry Cleaning",
    price: "$5.00",
    unit: "/ item",
    rating: "4.8",
    reviews: "85",
    image: "https://images.unsplash.com/photo-1489274495757-95c7c83700b0?q=80&w=500&auto=format&fit=crop",
    tag: "Premium"
  },
  {
    title: "Ironing Service",
    price: "$2.00",
    unit: "/ item",
    rating: "4.7",
    reviews: "64",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=500&auto=format&fit=crop",
    tag: "Detail"
  },
  {
    title: "Bedding & Linens",
    price: "$15.00",
    unit: "/ set",
    rating: "4.9",
    reviews: "42",
    image: "https://images.unsplash.com/photo-1512918580421-b2feee3b85a6?q=80&w=500&auto=format&fit=crop",
    tag: "Large Items"
  }
];

export const ServiceCards = () => {
  return (
    <section className="py-20 bg-orange-50/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Services</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Choose from our range of professional laundry services tailored to your specific needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, idx) => (
            <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-orange-600 uppercase tracking-wider">
                  {service.tag}
                </div>
              </div>
              
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                   <div className="bg-orange-50 text-orange-600 px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                     <Clock className="w-3 h-3" /> 24h
                   </div>
                   <div className="flex items-center gap-1 text-yellow-500 text-xs font-bold">
                     <Star className="w-3 h-3 fill-current" />
                     {service.rating} <span className="text-gray-400 font-normal">({service.reviews})</span>
                   </div>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2">{service.title}</h3>
                
                <div className="flex items-end gap-1 mb-4">
                  <span className="text-2xl font-bold text-orange-500">{service.price}</span>
                  <span className="text-sm text-gray-400 mb-1">{service.unit}</span>
                </div>
                
                <Button className="w-full bg-white text-orange-500 border-2 border-orange-100 hover:bg-orange-50 hover:border-orange-200 shadow-none">
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
