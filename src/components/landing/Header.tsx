import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Shirt, LogIn, UserCog, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-orange-100 bg-white">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-white shadow-lg shadow-orange-200">
            <Shirt className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-gray-900">Galuh Laundry</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <a href="#services" className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors">Services</a>
          <a href="#benefits" className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors">Why Us</a>
          <a href="#tracking" className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors">Track Order</a>
          <a href="#contact" className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors">Contact</a>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
              onClick={() => navigate('/login?type=admin')}
            >
              <UserCog className="mr-2 h-4 w-4" />
              Admin Login
            </Button>
            <Button 
              size="sm" 
              className="bg-orange-500 text-white hover:bg-orange-600 shadow-md shadow-orange-200"
              onClick={() => navigate('/login?type=customer')}
            >
              <LogIn className="mr-2 h-4 w-4" />
              Customer Login
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-3/4 bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setMenuOpen(false); navigate('/'); }}>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-white">
                  <Shirt className="h-5 w-5" />
                </div>
                <span className="text-lg font-bold text-gray-900">Galuh Laundry</span>
              </div>
              <button aria-label="Close menu" onClick={() => setMenuOpen(false)} className="p-2 rounded-md hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-4">
              <a onClick={() => { setMenuOpen(false); document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-base font-medium text-gray-700">Services</a>
              <a onClick={() => { setMenuOpen(false); document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-base font-medium text-gray-700">Why Us</a>
              <a onClick={() => { setMenuOpen(false); document.getElementById('tracking')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-base font-medium text-gray-700">Track Order</a>
              <a onClick={() => { setMenuOpen(false); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-base font-medium text-gray-700">Contact</a>
            </nav>

            <div className="mt-6 flex flex-col gap-3">
              <Button variant="ghost" size="sm" className="text-orange-600 bg-orange-100 hover:text-orange-700 hover:bg-orange-50" onClick={() => { setMenuOpen(false); navigate('/login?type=admin'); }}>
                <UserCog className="mr-2 h-4 w-4" />
                Admin Login
              </Button>
              <Button size="sm" className="bg-orange-500 text-white hover:bg-orange-600 shadow-md" onClick={() => { setMenuOpen(false); navigate('/login?type=customer'); }}>
                <LogIn className="mr-2 h-4 w-4" />
                Customer Login
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

