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

  // Button disabled logic: Active only when email & password are not empty
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
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 px-4 py-6 overflow-hidden font-sans">
      {/* Dynamic Background Ambient Light Orbs */}
      <div className="absolute top-1/4 -left-32 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glass Card Container (Compact Height) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 max-w-sm w-full bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 shadow-2xl"
      >
        {/* Compact Header Section */}
        <div className="text-center space-y-1.5 mb-5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-1">
            <Utensils className="w-6 h-6" />
          </div>

          <h2 className="text-xl font-bold text-slate-100">Sign In</h2>
          <p className="text-xs text-slate-400">
            Enter your details to access your account
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div className="space-y-1">
            <label
              htmlFor="email"
              className="block text-xs font-medium text-slate-300"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 text-slate-100 text-xs rounded-lg placeholder-slate-600 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label
              htmlFor="password"
              className="block text-xs font-medium text-slate-300"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-9 py-2 bg-slate-950 border border-slate-800 text-slate-100 text-xs rounded-lg placeholder-slate-600 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-amber-400 text-xs"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me & Link */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-400">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-slate-800 bg-slate-950 text-amber-500 focus:ring-amber-500/20"
              />
              <span className="text-[11px]">Remember me</span>
            </label>

            <Link
              to="/forgot-password"
              className="text-[11px] text-amber-400 hover:underline"
            >
              Forgot?
            </Link>
          </div>

          {/* Submit Button (Disabled by Default) */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-bold text-xs transition-all duration-300 shadow-md ${
                isFormValid && !isLoading
                  ? "bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer shadow-amber-500/20 active:scale-95"
                  : "bg-slate-800 text-slate-500 cursor-not-allowed opacity-60"
              }`}
            >
              <span>{isLoading ? "Signing In..." : "Sign In"}</span>
              {!isLoading && <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </form>

        {/* Footer Prompt */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 text-center">
          <p className="text-[11px] text-slate-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-amber-400 font-bold hover:underline ml-0.5"
            >
              Register
            </Link>
          </p>
        </div>
      </motion.div>

      {/* Security Footer */}
      <div className="absolute bottom-3 flex items-center gap-1 text-[10px] text-slate-500">
        <ShieldCheck className="w-3 h-3 text-emerald-500" />
        <span>Secure Encrypted Login</span>
      </div>
    </div>
  );
};

export default Login;
