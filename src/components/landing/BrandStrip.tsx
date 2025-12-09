import React from 'react';

const brands = ["EcoWash", "SoftClean", "PureFab", "QuickDry", "FreshScent"];

export const BrandStrip = () => {
  return (
    <section className="py-8 bg-orange-500 text-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex justify-center md:justify-between items-center flex-wrap gap-8 opacity-80">
          {brands.map((brand, idx) => (
            <div key={idx} className="text-xl md:text-2xl font-bold uppercase tracking-wider">
              {brand}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

