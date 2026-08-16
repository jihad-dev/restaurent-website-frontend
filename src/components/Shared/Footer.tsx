import React from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Heart,
  ArrowUpRight,
  Sparkles,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  UtensilsCrossed,
} from "lucide-react";

const Footer: React.FC = () => {
  // Stagger Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <footer className="relative bg-slate-950 text-slate-200 overflow-hidden pt-16 pb-8 border-t border-slate-800">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-16"
        >
          {/* Column 1: Brand & Bio */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-xl text-slate-950 shadow-lg shadow-amber-500/20">
               <UtensilsCrossed className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Foodie<span className="text-amber-500">Hub</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Experience authentic culinary art crafted with fresh organic
              ingredients and passion. Dine with us for unforgettable taste
              moments.
            </p>

            {/* Social Icons with Micro-Interactions */}
            <div className="flex items-center gap-3 pt-2">
              {[
                { icon: Facebook, label: "Facebook" },
                { icon: Instagram, label: "Instagram" },
                { icon: Twitter, label: "Twitter" },
                { icon: Youtube, label: "YouTube" },
              ].map((social, idx) => {
                const IconComponent = social.icon;
                return (
                  <motion.a
                    key={idx}
                    href="#"
                    whileHover={{ scale: 1.15, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-amber-400 hover:border-amber-500/50 hover:bg-slate-800 transition-all shadow-sm"
                    aria-label={social.label}
                  >
                    <IconComponent className="w-4 h-4" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Column 2: Quick Navigation */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-base font-bold text-white tracking-wider uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { name: "Our Special Menu", href: "/menu" },
                { name: "About Chef & Story", href: "/about" },
                { name: "Book A Table", href: "/reservation" },
                { name: "Online Food Delivery", href: "/foods" },
                { name: "Contact & Support", href: "/contact" },
              ].map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className="group text-slate-400 hover:text-white transition-colors duration-200 flex items-center gap-1.5"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-amber-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    <span>{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3: Contact & Opening Hours */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-base font-bold text-white tracking-wider uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> Contact
              Info
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-1" />
                <span>123 Culinary Avenue, Foodie District, Dhaka</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <span>+880 1700-000000</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <span>support@feastify.com</span>
              </li>
              <li className="flex items-start gap-3 pt-1 border-t border-slate-800/80">
                <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-1" />
                <div>
                  <p className="text-white font-medium">Open Daily:</p>
                  <p className="text-xs text-slate-400">10:00 AM – 11:00 PM</p>
                </div>
              </li>
            </ul>
          </motion.div>

          {/* Column 4: Premium Offer Newsletter */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="bg-gradient-to-b from-slate-900 to-slate-900/90 p-5 rounded-2xl border border-slate-800/80 shadow-xl relative overflow-hidden">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" /> Special Discount
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                Get 15% Off Your First Order!
              </h3>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Subscribe to our newsletter to receive secret deals & chef
                special recipes.
              </p>

              <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 text-xs font-extrabold py-2.5 rounded-xl transition-all shadow-md shadow-amber-500/10 flex items-center justify-center gap-2"
                >
                  <span>Subscribe Now</span>
                  <Send className="w-3.5 h-3.5" />
                </motion.button>
              </form>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Bar Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="border-t border-slate-800/80 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500"
        >
          <p className="flex items-center gap-1">
            &copy; {new Date().getFullYear()} Feastify Restaurant. Crafted with{" "}
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />{" "}
            for food lovers.
          </p>

          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-slate-300 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-slate-300 transition-colors">
              Cookie Settings
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
