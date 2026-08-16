import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Users,
  Truck,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-20">
        {/* Header Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 max-w-3xl mx-auto pt-16 sm:pt-20"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Our Story & Values
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
            Transforming the Way You Experience Food
          </h1>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Delivering culinary excellence with innovation, speed, and premium
            quality straight to your table.
          </p>
        </motion.div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 leading-tight">
              Our Journey to Excellence
            </h2>
            <p className="text-slate-400 text-base leading-relaxed">
              Since our inception in 2020, we have been driven by a singular
              vision: revolutionizing culinary access by pairing high-grade
              ingredients with effortless delivery services. What started as a
              small cloud kitchen has grown into a community-trusted platform.
            </p>
            <p className="text-slate-400 text-base leading-relaxed">
              We take pride in fostering meaningful connections with local
              farmers, master chefs, and satisfied customers. Every meal is
              prepared with meticulous detail to ensure an exceptional
              experience.
            </p>

            <div className="pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-amber-500/10"
              >
                Explore Menu <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 to-indigo-500/20 rounded-3xl blur-2xl -z-10" />
            <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-3 shadow-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1000&q=80"
                alt="Our Culinary Team"
                className="rounded-2xl w-full h-[420px] object-cover"
              />
            </div>
          </motion.div>
        </div>

        {/* Feature Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-8 hover:border-slate-700 transition-all shadow-lg hover:-translate-y-1 duration-300">
            <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-400 mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-2">
              Premium Quality
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Every dish undergoes rigorous freshness checks to guarantee
              standard-setting quality.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-8 hover:border-slate-700 transition-all shadow-lg hover:-translate-y-1 duration-300">
            <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-400 mb-6">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-2">
              Customer First
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Dedicated 24/7 support team focused on making your overall dining
              experience smooth and responsive.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-8 hover:border-slate-700 transition-all shadow-lg hover:-translate-y-1 duration-300">
            <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-400 mb-6">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-2">
              Swift Delivery
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Optimized delivery networks engineered to bring hot, fresh meals
              directly to your doorstep.
            </p>
          </div>
        </motion.div>

        {/* Contact Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="relative bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 overflow-hidden shadow-2xl text-center space-y-8"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-extrabold text-white">
              Connect With Us
            </h2>
            <p className="text-slate-400 text-sm">
              Have questions, feedback, or special catering requests? We're
              always here to assist.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="flex items-center justify-center gap-3 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 text-slate-300">
              <Phone className="w-5 h-5 text-amber-400" />
              <span className="text-sm font-medium">+1 (555) 123-4567</span>
            </div>

            <div className="flex items-center justify-center gap-3 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 text-slate-300">
              <Mail className="w-5 h-5 text-amber-400" />
              <span className="text-sm font-medium">support@example.com</span>
            </div>

            <div className="flex items-center justify-center gap-3 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 text-slate-300">
              <MapPin className="w-5 h-5 text-amber-400" />
              <span className="text-sm font-medium">123 Business Ave, NY</span>
            </div>
          </div>

          <div className="pt-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-amber-500/10"
            >
              Get in Touch
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
