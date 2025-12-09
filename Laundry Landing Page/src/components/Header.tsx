import React from 'react';
import { Button } from './ui/button';
import { Shirt, LogIn, UserCog, Menu } from 'lucide-react';

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-orange-100 bg-white/95 backdrop-blur-md">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-white shadow-lg shadow-orange-200">
            <Shirt className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-gray-900">Galuh Laundry</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-sm font-medium text-gray-600 hover:text-orange-500">Services</a>
          <a href="#" className="text-sm font-medium text-gray-600 hover:text-orange-500">Pricing</a>
          <a href="#" className="text-sm font-medium text-gray-600 hover:text-orange-500">Locations</a>
          <a href="#" className="text-sm font-medium text-gray-600 hover:text-orange-500">Contact</a>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex gap-3">
            <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700 hover:bg-orange-50">
              <UserCog className="mr-2 h-4 w-4" />
              Admin Login
            </Button>
            <Button size="sm" className="bg-orange-500 text-white hover:bg-orange-600 shadow-md shadow-orange-200">
              <LogIn className="mr-2 h-4 w-4" />
              Customer Login
            </Button>
          </div>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
};
