/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Utensils,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../Redux/features/auth/authApi";
import { useAppDispatch } from "../../Redux/hooks";
import { setUser } from "../../Redux/features/auth/authSlice";
import verifyToken from "../../utils/verifyToken";
import { toast } from "sonner";

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [login, { isLoading }] = useLoginMutation();

  const isFormValid = email.trim() !== "" && password.trim() !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    const toastId = toast.loading("Logging in...");

    try {
      const userInfo = { email, password };
      const res = await login(userInfo).unwrap();

      if (!res?.data?.accessToken) {
        throw new Error("Invalid credentials");
      }

      const user = await verifyToken(res?.data?.accessToken || "");
      dispatch(setUser({ user: user, token: res?.data?.accessToken || "" }));

      toast.success("Logged in successfully", { id: toastId });
      navigate("/");
    } catch (error: any) {
      const errorMsg = error?.data?.message || error?.message || "Login failed";
      toast.error(errorMsg, { id: toastId });
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-slate-950 text-slate-100 p-4 sm:p-6 overflow-hidden font-sans selection:bg-amber-500 selection:text-slate-950 mt-12">
      {/* Background Glows */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Glass Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[420px] bg-slate-900/70 backdrop-blur-2xl p-6 sm:p-8 rounded-3xl border border-slate-800/80 shadow-2xl shadow-black/50"
      >
        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-b from-amber-500/20 to-amber-500/5 border border-amber-500/30 text-amber-400 shadow-inner mb-1">
            <Utensils className="w-7 h-7" />
          </div>

          <h2 className="text-2xl font-black text-white tracking-tight">
            Welcome Back
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Enter your credentials to access your portal
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-xs font-semibold text-slate-300"
            >
              Email Address
            </label>
            <div className="relative group">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-400 transition-colors" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 text-slate-100 text-sm rounded-xl placeholder-slate-600 outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/80 transition-all"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-xs font-semibold text-slate-300"
            >
              Password
            </label>
            <div className="relative group">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-400 transition-colors" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-950/60 border border-slate-800 text-slate-100 text-sm rounded-xl placeholder-slate-600 outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/80 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-amber-400 p-1 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Link */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-amber-500 focus:ring-amber-500/30 focus:ring-offset-slate-950 accent-amber-500 cursor-pointer"
              />
              <span className="text-xs text-slate-400 font-medium">
                Remember me
              </span>
            </label>

            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <motion.button
              whileTap={{ scale: isFormValid && !isLoading ? 0.98 : 1 }}
              type="submit"
              disabled={!isFormValid || isLoading}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all duration-200 ${
                isFormValid && !isLoading
                  ? "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 cursor-pointer shadow-lg shadow-amber-500/20"
                  : "bg-slate-800 text-slate-500 cursor-not-allowed opacity-60"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </div>
        </form>

        {/* Register Redirect */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
          <p className="text-xs text-slate-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-amber-400 font-bold hover:text-amber-300 transition-colors ml-1"
            >
              Register
            </Link>
          </p>
        </div>

        {/* Security Badge inside Card */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Secure Encrypted Login</span>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
