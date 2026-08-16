import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../../Redux/features/auth/authApi";
import { toast } from "sonner";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UtensilsCrossed,
  ArrowRight,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

interface RtkError {
  status: number;
  data: {
    message: string;
  };
}

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [register, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      role: "user",
      status: "in-progress",
      isDeleted: false,
    };

    const toastId = toast.loading("Creating your foodie profile...");

    try {
      await register(data).unwrap();
      toast.success("Welcome aboard! Account created successfully.", {
        id: toastId,
      });
      navigate("/login");
    } catch (err: unknown) {
      console.error("Registration error:", err);
      let errorMessage = "Failed to register account. Please try again.";

      if (
        typeof err === "object" &&
        err !== null &&
        "data" in err &&
        typeof (err as RtkError).data?.message === "string"
      ) {
        errorMessage = (err as RtkError).data.message;
      }

      toast.error(errorMessage, { id: toastId });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Dynamic Animated Background Orbs for Vibrant Food Theme */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-orange-500/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-amber-500/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />

      {/* Main Glassmorphic Card (Fits Dark/Warm Food Aesthetic) */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-md w-full bg-slate-800/80 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl shadow-black/50 border border-slate-700/60 relative z-10"
      >
        {/* Header Section */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.1,
            }}
            className="w-16 h-16 bg-gradient-to-tr from-orange-500 to-amber-400 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/30"
          >
            <UtensilsCrossed className="w-8 h-8" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-black text-white tracking-tight"
          >
            Join Us Today! 🍔
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xs text-slate-400 mt-1.5 font-medium"
          >
            Create an account to start ordering your favorite meals
          </motion.p>
        </div>

        {/* Form Container */}
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {/* Full Name Input */}
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
          >
            <label className="block text-slate-300 text-xs font-bold uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-5 h-5" />
              </div>
              <input
                name="name"
                type="text"
                required
                placeholder="John Doe"
                className="w-full pl-11 pr-4 py-3 bg-slate-900/60 border border-slate-700/80 rounded-2xl text-white placeholder-slate-500 text-sm focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all duration-200"
              />
            </div>
          </motion.div>

          {/* Email Input */}
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-slate-300 text-xs font-bold uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-5 h-5" />
              </div>
              <input
                name="email"
                type="email"
                required
                placeholder="name@example.com"
                className="w-full pl-11 pr-4 py-3 bg-slate-900/60 border border-slate-700/80 rounded-2xl text-white placeholder-slate-500 text-sm focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all duration-200"
              />
            </div>
          </motion.div>

          {/* Password Input */}
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45 }}
          >
            <label className="block text-slate-300 text-xs font-bold uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                className="w-full pl-11 pr-11 py-3 bg-slate-900/60 border border-slate-700/80 rounded-2xl text-white placeholder-slate-500 text-sm focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </motion.div>

          {/* Guarantee Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center space-x-2 text-xs text-slate-400 pt-1"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Your personal details are safely encrypted.</span>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
          >
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white py-3.5 px-6 rounded-2xl font-black text-sm shadow-lg shadow-orange-500/25 active:scale-[0.98] transition-all duration-300 flex items-center justify-center space-x-2 ${
                isLoading ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </div>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </motion.div>
        </form>

        {/* Footer Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-center text-xs text-slate-400"
        >
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold text-orange-400 hover:text-orange-300 hover:underline transition-all"
          >
            Sign In Here
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
