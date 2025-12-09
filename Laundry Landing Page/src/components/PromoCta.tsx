import React from 'react';
import { Button } from './ui/button';

export const PromoCta = () => {
  return (
    <section className="py-24 bg-white">
       <div className="container mx-auto px-4 md:px-6">
          <div className="bg-gradient-to-r from-orange-500 to-orange-400 rounded-3xl p-8 md:p-16 overflow-hidden relative">
             <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
                <div>
                   <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                     Become a Member & <br/>Save 20% Monthly
                   </h2>
                   <p className="text-orange-100 mb-8 text-lg max-w-md">
                     Join our subscription plan and get free pickup/delivery plus discounted rates on all services.
                   </p>
                   
                   <div className="flex flex-col sm:flex-row gap-4">
                      <Button className="bg-white text-orange-600 hover:bg-orange-50 h-12 px-8 rounded-xl text-base shadow-lg">
                        Get Started
                      </Button>
                      <Button variant="outline" className="border-orange-300 text-white hover:bg-orange-600/50 bg-transparent h-12 px-8 rounded-xl text-base">
                        View Plans
                      </Button>
                   </div>
                </div>
                
                <div className="relative hidden md:block">
                   <div className="absolute -top-24 -right-12 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                   <img 
                     src="https://images.unsplash.com/photo-1541533848490-bc9c15663d6e?q=80&w=600&auto=format&fit=crop" 
                     alt="Smiling person" 
                     className="relative z-10 rounded-2xl shadow-2xl transform rotate-3 border-4 border-white/20 mx-auto max-w-xs"
                   />
                </div>
             </div>
             
             {/* Background decorations */}
             <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          </div>
       </div>
    </section>
  );
};
