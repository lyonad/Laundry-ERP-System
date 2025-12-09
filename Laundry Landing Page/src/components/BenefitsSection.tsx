import React from 'react';
import { CheckCircle2, Sparkles, Clock, Truck, ShieldCheck } from 'lucide-react';

export const BenefitsSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Image Grid */}
          <div className="relative">
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 mt-8">
                   <div className="h-48 bg-orange-100 rounded-2xl overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1521656693074-0ef32e80a5d5?q=80&w=500&auto=format&fit=crop" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" alt="Folding" />
                   </div>
                   <div className="h-40 bg-blue-100 rounded-2xl overflow-hidden">
                       <img src="https://images.unsplash.com/photo-1582735689369-4fe89db7114c?q=80&w=500&auto=format&fit=crop" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" alt="Detergent" />
                   </div>
                </div>
                <div className="space-y-4">
                   <div className="h-40 bg-green-100 rounded-2xl overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1545173168-9f1947eebb8f?q=80&w=500&auto=format&fit=crop" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" alt="Hangers" />
                   </div>
                   <div className="h-48 bg-purple-100 rounded-2xl overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?q=80&w=500&auto=format&fit=crop" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" alt="Ironing" />
                   </div>
                </div>
             </div>
             {/* Decorative blob */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-orange-50 rounded-full blur-3xl -z-10" />
          </div>

          {/* Right: Content */}
          <div>
            <div className="inline-block px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-medium mb-4">
              Why Choose Us
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Premium Care for Your <br />
              <span className="text-orange-500">Favorite Clothes</span>
            </h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              We understand that your clothes are an investment. That's why we use only the best eco-friendly products and state-of-the-art equipment to ensure they look their best.
            </p>

            <div className="space-y-6">
              {[
                { icon: Sparkles, title: "Premium Eco-Friendly Detergents", desc: "Safe for your skin and the environment." },
                { icon: Clock, title: "Same Day Service Available", desc: "Get your clothes back in as little as 6 hours." },
                { icon: Truck, title: "Free Pickup & Delivery", desc: "We come to you, so you don't have to drive." },
                { icon: ShieldCheck, title: "Damage Protection Guarantee", desc: "We treat every item with utmost care." },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4">
                   <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                      <item.icon className="w-6 h-6" />
                   </div>
                   <div>
                      <h4 className="text-lg font-bold text-gray-900">{item.title}</h4>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
