import React from 'react';
import { Facebook, Twitter, Linkedin, Youtube, Shirt } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white pt-20 pb-12 border-t border-gray-100 text-xs text-gray-500">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-white">
                <Shirt className="h-3 w-3" />
              </div>
              <span className="text-lg font-bold text-gray-900">Galuh Laundry</span>
            </div>
            <p className="max-w-xs text-gray-400">
              Premium on-demand laundry service. We treat your clothes with the care they deserve.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-bold text-gray-900">Services</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-orange-500">Wash & Fold</a></li>
              <li><a href="#" className="hover:text-orange-500">Dry Cleaning</a></li>
              <li><a href="#" className="hover:text-orange-500">Household Items</a></li>
              <li><a href="#" className="hover:text-orange-500">Commercial</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-gray-900">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-orange-500">About Us</a></li>
              <li><a href="#" className="hover:text-orange-500">Careers</a></li>
              <li><a href="#" className="hover:text-orange-500">Locations</a></li>
              <li><a href="#" className="hover:text-orange-500">Privacy Policy</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-gray-900">Contact</h4>
            <p className="text-orange-600 font-medium">1-800-123-4567</p>
            <p className="text-orange-600 font-medium">support@galuhlaundry.com</p>
            <div className="mt-4">
              <p>123 Clean Street,</p>
              <p>Seattle, WA 98101</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-100">
           <div className="flex gap-4 mb-4 md:mb-0">
             <Twitter className="h-4 w-4 text-gray-300 hover:text-orange-500 cursor-pointer" />
             <Facebook className="h-4 w-4 text-gray-300 hover:text-orange-500 cursor-pointer" />
             <Youtube className="h-4 w-4 text-gray-300 hover:text-orange-500 cursor-pointer" />
             <Linkedin className="h-4 w-4 text-gray-300 hover:text-orange-500 cursor-pointer" />
           </div>
           <p className="text-[10px] text-gray-400">© Copyright {new Date().getFullYear()} Galuh Laundry Inc. All rights reserved</p>
        </div>
      </div>
    </footer>
  );
};
