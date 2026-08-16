import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Sparkles,
  MessageSquare,
  User,
  AtSign,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

const Contact: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = e.currentTarget;
    const toastId = toast.loading("Sending your message...");

    try {
      // API Call Simulation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Message sent successfully!", { id: toastId });
      form.reset();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error:unknown) {
      toast.error("Failed to send message. Please try again.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 py-16 px-4 sm:px-6 lg:px-8 overflow-hidden font-sans">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-blue-600/20 to-indigo-500/20 rounded-full blur-[120px] pointer-events-none -z-0" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none -z-0" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none -z-0" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-16 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-semibold text-blue-400 tracking-wide uppercase shadow-sm mt-8">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>We are here for you</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white">
            Let&apos;s Start a{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
              Conversation
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
            Have a question, project idea, or feedback? Send us a message and
            our team will get back to you within 24 hours.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Contact Form Section (7 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-7 bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-800/80 p-6 sm:p-10 shadow-2xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800/80">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
                  Send a Message
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Fill out the form below and we will contact you back.
                </p>
              </div>
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-400">
                <MessageSquare className="w-6 h-6" />
              </div>
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
                    Your Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      placeholder="John Doe"
                      className="w-full pl-10 pr-4 py-3 text-sm bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="email"
                    className="block text-xs font-semibold text-slate-300 uppercase tracking-wider"
                  >
                    Your Email
                  </label>
                  <div className="relative">
                    <AtSign className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      placeholder="john@example.com"
                      className="w-full pl-10 pr-4 py-3 text-sm bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-1.5">
                <label
                  htmlFor="subject"
                  className="block text-xs font-semibold text-slate-300 uppercase tracking-wider"
                >
                  Subject
                </label>
                <div className="relative">
                  <HelpCircle className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    placeholder="How can we help you?"
                    className="w-full pl-10 pr-4 py-3 text-sm bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label
                  htmlFor="message"
                  className="block text-xs font-semibold text-slate-300 uppercase tracking-wider"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  placeholder="Write your message here..."
                  className="w-full px-4 py-3 text-sm bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 resize-none"
                />
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sending Message...</span>
                  </>
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Details & Info Section (5 cols) */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-5 space-y-6"
          >
            {/* Phone Card */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="group p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-blue-500/40 transition-all duration-300 backdrop-blur-lg flex items-center gap-4"
            >
              <div className="p-3.5 rounded-xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300 shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Phone Call
                </p>
                <a
                  href="tel:+15551234567"
                  className="text-base font-bold text-white hover:text-blue-400 transition-colors truncate block"
                >
                  +1 (555) 123-4567
                </a>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
            </motion.div>

            {/* Email Card */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="group p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-indigo-500/40 transition-all duration-300 backdrop-blur-lg flex items-center gap-4"
            >
              <div className="p-3.5 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-300 shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Official Email
                </p>
                <a
                  href="mailto:support@example.com"
                  className="text-base font-bold text-white hover:text-indigo-400 transition-colors truncate block"
                >
                  support@example.com
                </a>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
            </motion.div>

            {/* Address Card */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="group p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-purple-500/40 transition-all duration-300 backdrop-blur-lg flex items-start gap-4"
            >
              <div className="p-3.5 rounded-xl bg-purple-500/10 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors duration-300 shrink-0 mt-0.5">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Main Headquarters
                </p>
                <p className="text-sm font-bold text-white mt-0.5 leading-snug">
                  123 Business Ave, Suite 100 <br />
                  <span className="text-slate-400 font-normal">
                    New York, NY 10001
                  </span>
                </p>
              </div>
            </motion.div>

            {/* Business Hours Banner */}
            <motion.div
              variants={itemVariants}
              className="relative p-6 rounded-2xl bg-gradient-to-br from-blue-900/40 via-indigo-900/30 to-slate-900/80 border border-blue-500/30 overflow-hidden shadow-xl"
            >
              <div className="absolute top-0 right-0 p-8 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center gap-2.5 mb-4 text-blue-300">
                <Clock className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold text-white">
                  Working Hours
                </h3>
              </div>

              <ul className="space-y-2.5 text-xs sm:text-sm">
                <li className="flex justify-between items-center text-slate-300 border-b border-slate-800/60 pb-2">
                  <span>Monday - Friday</span>
                  <span className="font-semibold text-white">
                    9:00 AM - 6:00 PM
                  </span>
                </li>
                <li className="flex justify-between items-center text-slate-300 border-b border-slate-800/60 pb-2">
                  <span>Saturday</span>
                  <span className="font-semibold text-white">
                    10:00 AM - 4:00 PM
                  </span>
                </li>
                <li className="flex justify-between items-center text-slate-400">
                  <span>Sunday</span>
                  <span className="font-semibold text-rose-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />{" "}
                    Closed
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
