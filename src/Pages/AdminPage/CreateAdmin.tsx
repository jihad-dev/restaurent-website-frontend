/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiUserPlus,
  FiLoader,
  FiShield,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useCreateAdminMutation } from "../../Redux/features/admin/adminApi";

// ---------------- ⚡ ANIMATION VARIANTS ----------------
const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const CreateAdmin = () => {
  const [createAdmin, { isLoading }] = useCreateAdminMutation();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      role: "admin",
      status: "in-progress",
      isDeleted: false,
    };

    const toastId = toast.loading("Provisioning admin account...");

    try {
      await createAdmin(data).unwrap();
      toast.success("New Admin successfully created!", { id: toastId });
      formElement.reset();
    } catch (err: any) {
      const errorMessage = err?.data?.message || "Failed to create admin";
      toast.error(errorMessage, { id: toastId });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 selection:bg-amber-500 selection:text-slate-950">
      <motion.div
        className="w-full max-w-lg relative z-10"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-60 h-60 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Card Shell */}
        <div className="bg-slate-900/80 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl backdrop-blur-xl relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
              <FiShield className="w-4 h-4" />
              Access Control
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Create Admin Account
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-400">
              Grant management privileges to kitchen or restaurant staff
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Input */}
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <FiUser className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="e.g. Tanvir Hossain"
                  disabled={isLoading}
                  className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-slate-800 rounded-2xl text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/80 transition-all disabled:opacity-50"
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <FiMail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="admin@restaurant.com"
                  disabled={isLoading}
                  className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-slate-800 rounded-2xl text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/80 transition-all disabled:opacity-50"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <FiLock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="••••••••••••"
                  disabled={isLoading}
                  className="w-full pl-11 pr-11 py-3 bg-slate-950/60 border border-slate-800 rounded-2xl text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/80 transition-all disabled:opacity-50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label="Toggle Password Visibility"
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? (
                    <FiEyeOff className="w-5 h-5" />
                  ) : (
                    <FiEye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-extrabold py-3.5 px-5 rounded-2xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all text-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-2"
            >
              {isLoading ? (
                <>
                  <FiLoader className="w-5 h-5 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <FiUserPlus className="w-5 h-5" />
                  <span>Create Admin Account</span>
                </>
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateAdmin;
