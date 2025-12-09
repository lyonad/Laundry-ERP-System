import React from 'react';
import { Button } from '../ui/button';
import { PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-orange-50/40 pt-12 pb-20 lg:pt-20 lg:pb-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div className="max-w-xl animate-in fade-in slide-in-from-left duration-500">
            <div className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-sm text-orange-600 mb-6">
              <span className="flex h-2 w-2 rounded-full bg-orange-500 mr-2"></span>
              #1 Laundry Service in Town
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl mb-6 leading-tight">
              Make Your Clothes <br />
              <span className="text-orange-500">Clean & Fresh</span> Again
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Experience the premium care for your fabrics at Galuh Laundry. We use eco-friendly detergents and provide 24-hour express delivery.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                className="h-14 px-8 text-base bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-lg shadow-orange-200"
                onClick={() => navigate('/login')}
              >
                Order Now
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="h-14 px-8 text-base border-orange-200 text-orange-700 hover:bg-orange-50 rounded-xl bg-white"
                onClick={() => {
                  const element = document.getElementById('tracking');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <PlayCircle className="mr-2 h-5 w-5" />
                Track Order
              </Button>
            </div>
          </div>

          <div className="relative mx-auto lg:ml-auto animate-in fade-in zoom-in duration-500 delay-200">
            {/* Hero Image Composition */}
            <div className="relative z-10">
              <div className="relative w-[350px] h-[450px] md:w-[450px] md:h-[550px] mx-auto">
                 {/* Main image mask shape */}
                 <div className="absolute inset-0 bg-orange-200 rounded-[3rem] rotate-3 transform transition-transform group-hover:rotate-6"></div>
                 <div className="absolute inset-0 bg-white rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white">
                    <img 
                      src="https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1000&auto=format&fit=crop" 
                      alt="Happy woman holding laundry" 
                      className="w-full h-full object-cover"
                    />
                 </div>
                 
                 {/* Floating Badge 1 */}
                 <div className="absolute top-8 -left-8 bg-white p-4 rounded-2xl shadow-xl border border-orange-100 flex items-center gap-3 animate-bounce duration-3000">
                    <div className="bg-orange-100 p-2 rounded-lg">
                       <span className="text-xl">🧺</span>
                    </div>
                    <div>
                       <p className="text-xs text-gray-500 font-medium">Total Orders</p>
                       <p className="text-lg font-bold text-gray-900">10K+</p>
                    </div>
                 </div>

                 {/* Floating Badge 2 */}
                 <div className="absolute bottom-12 -right-4 bg-white p-4 rounded-2xl shadow-xl border border-orange-100 flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                       <span className="text-xl">✨</span>
                    </div>
                    <div>
                       <p className="text-xs text-gray-500 font-medium">Rating</p>
                       <p className="text-lg font-bold text-gray-900">4.9/5.0</p>
                    </div>
                 </div>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-orange-300/20 rounded-full blur-3xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};

