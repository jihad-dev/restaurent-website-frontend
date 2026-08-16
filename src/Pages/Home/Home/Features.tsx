import React from "react";
import { Truck, ChefHat, ShieldCheck, Utensils } from "lucide-react";

const restaurantFeatures = [
  {
    id: 1,
    title: "Fresh & Organic",
    description: "Prepared daily with locally sourced, premium ingredients.",
    icon: Utensils,
  },
  {
    id: 2,
    title: "Fast & Hot Delivery",
    description: "Doorstep delivery in under 30 minutes, piping hot.",
    icon: Truck,
  },
  {
    id: 3,
    title: "Master Chefs",
    description: "Crafted by world-class culinary experts with passion.",
    icon: ChefHat,
  },
  {
    id: 4,
    title: "100% Hygienic",
    description:
      "Prepared in sterile environments following strict safety protocols.",
    icon: ShieldCheck,
  },
];

const Features: React.FC = () => {
  return (
    <section className="bg-slate-950 text-slate-100 py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {restaurantFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className="group relative bg-slate-900/80 border border-slate-800/80 hover:border-amber-500/50 rounded-3xl p-6 sm:p-8 text-center transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-amber-500/10 backdrop-blur-md flex flex-col items-center justify-between"
              >
                {/* Background Glow on Hover */}
                <div className="absolute inset-0 bg-amber-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center">
                  {/* Icon Container */}
                  <div className="relative mb-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-500/10 border border-amber-500/20 group-hover:border-amber-500/50 flex items-center justify-center text-amber-400 group-hover:text-amber-300 transition-all duration-300 group-hover:scale-110 shadow-lg">
                      <Icon className="w-8 h-8 sm:w-10 sm:h-10 transition-transform duration-300 group-hover:rotate-6" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors duration-200">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
