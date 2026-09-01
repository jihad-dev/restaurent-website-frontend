/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Sparkles,
  UtensilsCrossed,
  User,
  AtSign,
  Calendar,
  Users,
  Navigation,
} from "lucide-react";
import { toast } from "sonner";

const Contact: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inquiryType, setInquiryType] = useState<
    "general" | "reservation" | "catering"
  >("general");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = e.currentTarget;
    const toastId = toast.loading("Sending your message to FoodieHub...");

    try {
      // API Call Simulation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success(
        "Message sent successfully! We will get back to you shortly.",
        { id: toastId },
      );
      form.reset();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      toast.error("Failed to send message. Please try again.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 py-16 px-4 sm:px-6 lg:px-8 overflow-hidden font-sans">
      {/* Background Decorative Warm Glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-amber-500/15 to-orange-500/10 rounded-full blur-[140px] pointer-events-none -z-0" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-amber-600/10 rounded-full blur-[120px] pointer-events-none -z-0" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-14 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/30 text-xs font-semibold text-amber-400 tracking-wide uppercase shadow-lg shadow-amber-500/5 mt-7">
            <UtensilsCrossed className="w-3.5 h-3.5 text-amber-400" />
            <span>Get in Touch with FoodieHub</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white">
            We&apos;re Ready to{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500">
              Serve You
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
            Have a question about our menu, private dining, or catering
            services? Send us a message or reserve your table directly.
          </p>
        </motion.div>

        {/* Main Grid Structure */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Contact Form Section (7 Columns) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-7 bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-800/80 p-6 sm:p-10 shadow-2xl relative overflow-hidden"
          >
            {/* Inquiry Type Tabs */}
            <div className="mb-6 flex flex-wrap gap-2 p-1.5 bg-slate-950/80 border border-slate-800/80 rounded-2xl">
              {[
                { id: "general", label: "General Inquiry" },
                { id: "reservation", label: "Table Reservation" },
                { id: "catering", label: "Catering & Events" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setInquiryType(tab.id as any)}
                  className={`flex-1 min-w-[120px] py-2 px-3 text-xs font-semibold rounded-xl transition-all duration-200 ${
                    inquiryType === tab.id
                      ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name & Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Name */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="name"
                    className="block text-xs font-semibold text-slate-300 uppercase tracking-wider"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      placeholder="Jihadul Islam"
                      className="w-full pl-10 pr-4 py-3 text-sm bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="email"
                    className="block text-xs font-semibold text-slate-300 uppercase tracking-wider"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <AtSign className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      placeholder="jihad@example.com"
                      className="w-full pl-10 pr-4 py-3 text-sm bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Inputs Based on Tab */}
              {inquiryType === "reservation" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Date & Time
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="datetime-local"
                        required
                        className="w-full pl-10 pr-4 py-3 text-sm bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Number of Guests
                    </label>
                    <div className="relative">
                      <Users className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="number"
                        min="1"
                        max="20"
                        defaultValue="2"
                        required
                        className="w-full pl-10 pr-4 py-3 text-sm bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label
                    htmlFor="subject"
                    className="block text-xs font-semibold text-slate-300 uppercase tracking-wider"
                  >
                    Subject
                  </label>
                  <div className="relative">
                    <Sparkles className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      placeholder={
                        inquiryType === "catering"
                          ? "Catering for Corporate Event / Party"
                          : "Query regarding special menu items"
                      }
                      className="w-full pl-10 pr-4 py-3 text-sm bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-200"
                    />
                  </div>
                </div>
              )}

              {/* Message */}
              <div className="space-y-1.5">
                <label
                  htmlFor="message"
                  className="block text-xs font-semibold text-slate-300 uppercase tracking-wider"
                >
                  Special Request / Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  placeholder="Tell us about dietary preferences, seating requests, or general questions..."
                  className="w-full px-4 py-3 text-sm bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-200 resize-none"
                />
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3.5 px-6 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:brightness-110 transition-all duration-300 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                    <span>Processing Request...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {inquiryType === "reservation"
                        ? "Confirm Reservation"
                        : "Send Message"}
                    </span>
                    <Send className="w-4 h-4 text-slate-950" />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Sidebar Info Section (5 Columns) */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-5 space-y-6"
          >
            {/* Direct Phone Card */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="group p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-amber-500/40 transition-all duration-300 backdrop-blur-lg flex items-center gap-4"
            >
              <div className="p-3.5 rounded-xl bg-amber-500/10 text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors duration-300 shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Direct Line & Reservations
                </p>
                <a
                  href="tel:+8801700000000"
                  className="text-base font-bold text-white hover:text-amber-400 transition-colors truncate block"
                >
                  +880 1700-000000
                </a>
              </div>
            </motion.div>

            {/* Email Card */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="group p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-amber-500/40 transition-all duration-300 backdrop-blur-lg flex items-center gap-4"
            >
              <div className="p-3.5 rounded-xl bg-orange-500/10 text-orange-400 group-hover:bg-orange-500 group-hover:text-slate-950 transition-colors duration-300 shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Email Support
                </p>
                <a
                  href="mailto:contact@foodiehub.com"
                  className="text-base font-bold text-white hover:text-amber-400 transition-colors truncate block"
                >
                  contact@foodiehub.com
                </a>
              </div>
            </motion.div>

            {/* Address Card & Embedded Map */}
            <motion.div
              variants={itemVariants}
              className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-lg space-y-4"
            >
              <div className="flex items-start gap-4">
                <div className="p-3.5 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Location
                  </p>
                  <p className="text-sm font-bold text-white mt-0.5">
                    FoodieHub Restaurant <br />
                    <span className="text-slate-400 font-normal">
                      Sadat Road, Barisal, Bangladesh
                    </span>
                  </p>
                </div>
              </div>

              {/* Map Container Placeholder */}
              <div className="relative w-full h-36 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center group">
                <img
                  src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=600&auto=format&fit=crop"
                  alt="Restaurant Location Map"
                  className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-300"
                />
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute px-3 py-1.5 rounded-lg bg-slate-900/90 border border-amber-500/40 text-xs font-bold text-amber-400 flex items-center gap-1.5 shadow-lg hover:bg-amber-500 hover:text-slate-950 transition-all"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Get Directions</span>
                </a>
              </div>
            </motion.div>

            {/* Kitchen & Dining Hours */}
            <motion.div
              variants={itemVariants}
              className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 via-slate-900/80 to-slate-900 border border-amber-500/20 shadow-xl"
            >
              <div className="flex items-center gap-2.5 mb-4 text-amber-400">
                <Clock className="w-5 h-5" />
                <h3 className="text-base font-bold text-white">
                  Opening Hours
                </h3>
              </div>

              <ul className="space-y-2.5 text-xs sm:text-sm">
                <li className="flex justify-between items-center text-slate-300 border-b border-slate-800/80 pb-2">
                  <span>Monday - Thursday</span>
                  <span className="font-semibold text-white">
                    10:00 AM - 10:30 PM
                  </span>
                </li>
                <li className="flex justify-between items-center text-slate-300 border-b border-slate-800/80 pb-2">
                  <span>Friday - Saturday</span>
                  <span className="font-semibold text-amber-400">
                    10:00 AM - 11:30 PM
                  </span>
                </li>
                <li className="flex justify-between items-center text-slate-400">
                  <span>Sunday</span>
                  <span className="font-semibold text-slate-200">
                    11:00 AM - 10:00 PM
                  </span>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
