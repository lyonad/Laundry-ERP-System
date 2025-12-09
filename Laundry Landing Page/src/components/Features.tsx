import React from 'react';
import { motion } from 'motion/react';
import { Clock, Leaf, ShieldCheck, Truck } from 'lucide-react';
import { Card, CardContent } from './ui/card';

const features = [
  {
    icon: Clock,
    title: "24h Turnaround",
    description: "Get your clothes back fresh and clean within 24 hours standard."
  },
  {
    icon: Truck,
    title: "Free Pickup & Delivery",
    description: "We come to your door. No delivery fees on orders over $30."
  },
  {
    icon: Leaf,
    title: "Eco-Friendly Detergents",
    description: "Safe for your skin and the environment. No harsh chemicals."
  },
  {
    icon: ShieldCheck,
    title: "Care Guarantee",
    description: "We treat every garment with expert care. Satisfaction guaranteed."
  }
];

export const Features = () => {
  return (
    <section id="features" className="bg-white py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-orange-950 md:text-4xl">Why Choose FreshFold?</h2>
          <p className="mt-4 text-orange-800/70">We bring quality and convenience together.</p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-none shadow-lg shadow-orange-100/50 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-100">
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-orange-900">{feature.title}</h3>
                  <p className="text-sm text-orange-700/70">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
