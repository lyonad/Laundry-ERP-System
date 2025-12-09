import React from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: "Alexa Rodriguez",
    role: "Fashion Designer",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
    text: "Investing in Galuh Laundry was the best decision. The quality of cleaning for my delicate fabrics is unmatched."
  },
  {
    name: "Emily Chen",
    role: "Busy Mom",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop",
    text: "Exceptional service! The pickup is always on time and the folding is so neat. It saves me hours every week."
  },
  {
    name: "James Johnson",
    role: "Corporate Executive",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop",
    text: "Highly recommend! The personalized service and real-time tracking updates have elevated my laundry experience."
  }
];

export const Testimonials = () => {
  return (
    <section className="py-20 bg-orange-500 text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Happy Customers</h2>
          <p className="text-orange-100 max-w-2xl mx-auto">
            Here's what our happy customers have to say about their fresh and clean experience with Galuh Laundry.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-white text-gray-900 p-8 rounded-2xl shadow-xl relative">
              <div className="absolute -top-6 left-8 bg-orange-500 text-white p-3 rounded-full border-4 border-white">
                <Quote className="w-4 h-4 fill-current" />
              </div>
              
              <p className="text-gray-600 mb-8 italic leading-relaxed text-sm pt-4">
                "{t.text}"
              </p>
              
              <div className="flex items-center gap-4 border-t border-gray-100 pt-6">
                <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h4 className="font-bold text-sm">{t.name}</h4>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
                <div className="ml-auto flex text-orange-400">
                   <Star className="w-3 h-3 fill-current" />
                   <Star className="w-3 h-3 fill-current" />
                   <Star className="w-3 h-3 fill-current" />
                   <Star className="w-3 h-3 fill-current" />
                   <Star className="w-3 h-3 fill-current" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

