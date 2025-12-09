import React from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';

const services = [
  {
    title: "Wash & Fold",
    price: "From $1.50 / lb",
    description: "Perfect for everyday laundry like t-shirts, pants, socks, and towels.",
    image: "https://images.unsplash.com/photo-1623929710342-02a8cd2dae25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb2xkZWQlMjBjbGVhbiUyMGxhdW5kcnklMjBwYXN0ZWx8ZW58MXx8fHwxNzY0NzQyNTc2fDA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    title: "Dry Cleaning",
    price: "From $5.00 / item",
    description: "Special care for suits, dresses, coats, and delicate fabrics.",
    image: "https://images.unsplash.com/photo-1651974534932-5612f3bf6ca9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXVuZHJ5JTIwc2VydmljZSUyMGNsZWFuJTIwY2xvdGhlcyUyMHBhc3RlbCUyMG9yYW5nZXxlbnwxfHx8fDE3NjQ3NDI1NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    title: "Bedding & Linens",
    price: "From $15.00 / set",
    description: "Deep cleaning for comforters, sheets, blankets, and pillows.",
    image: "https://images.unsplash.com/photo-1657718237047-1083c4a59790?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMHBlcnNvbiUyMGhvbGRpbmclMjBsYXVuZHJ5JTIwYmFza2V0fGVufDF8fHx8MTc2NDc0MjU3Nnww&ixlib=rb-4.1.0&q=80&w=1080"
  }
];

export const Services = () => {
  return (
    <section id="services" className="bg-white py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-16 flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold text-orange-950 md:text-4xl">Our Services</h2>
          <p className="mt-4 max-w-[600px] text-orange-800/70">
            We offer a range of laundry services to keep your wardrobe and home fabrics looking their best.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="group overflow-hidden rounded-2xl border border-orange-100 bg-orange-50 shadow-sm transition-all hover:shadow-xl hover:shadow-orange-100"
            >
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-orange-950">{service.title}</h3>
                  <span className="rounded-full bg-orange-200 px-3 py-1 text-xs font-semibold text-orange-800">
                    {service.price}
                  </span>
                </div>
                <p className="mb-6 text-orange-800/70">{service.description}</p>
                <Button className="w-full bg-white text-orange-500 border border-orange-200 hover:bg-orange-100 hover:text-orange-600">
                  Order Service
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
