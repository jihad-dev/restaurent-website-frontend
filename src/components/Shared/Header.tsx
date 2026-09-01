/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../Redux/hooks";
import { logout } from "../../Redux/features/auth/authSlice";
import { useGetCartQuery } from "../../Redux/features/cart/cartApi";
import {
  ShoppingBag,
  User,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  UtensilsCrossed,
  Receipt,
  ChevronDown,
} from "lucide-react";

const Header = () => {
  const user = useAppSelector((state) => state.auth.user);
  const { data: cart } = useGetCartQuery(undefined, {
    skip: !user,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  }) as any;

  const cartLength = cart?.items?.length || 0;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Check if the user is an admin or superadmin (case-insensitive check)
  const isAdminOrSuperAdmin =
    user?.role?.toLowerCase() === "admin" ||
    user?.role?.toLowerCase() === "superAdmin";

  // Handle Navbar Background Change on Scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/login");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-slate-900/95 backdrop-blur-md shadow-xl py-3 border-b border-slate-800"
          : "bg-slate-900/80 backdrop-blur-sm py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="p-2 rounded-xl bg-amber-500 text-slate-950 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 shadow-lg shadow-amber-500/20">
              <UtensilsCrossed className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="text-xl sm:text-2xl font-black tracking-tight text-white group-hover:text-amber-400 transition-colors">
              Foodie<span className="text-amber-500">Hub</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 bg-slate-800/50 p-1.5 rounded-full border border-slate-700/50 backdrop-blur-md">
            {[
              { path: "/", label: "Home" },
              { path: "/items", label: "Menu" },
              { path: "/about", label: "About Us" },
              { path: "/contact", label: "Contact" },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="px-4 py-2 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-700/60 transition-all duration-200"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Action Icons & User Menu */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Cart Icon */}
            {user && (
              <Link
                to="/cart"
                className="relative p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 hover:text-amber-400 border border-slate-700/50 transition-all duration-200 hover:scale-105"
                title="View Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartLength > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-slate-950 text-[11px] font-black rounded-full h-5 w-5 flex items-center justify-center animate-bounce shadow-md">
                    {cartLength}
                  </span>
                )}
              </Link>
            )}

            {/* Quick Access Admin Dashboard Icon */}
            {isAdminOrSuperAdmin && (
              <Link
                to="/dashboard/admin-home"
                className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-amber-400 border border-slate-700/50 transition-all duration-200 hover:scale-105"
                title="Admin Dashboard"
              >
                <LayoutDashboard className="w-5 h-5" />
              </Link>
            )}

            {/* Logged-In User Actions */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 transition-all duration-200"
                >
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
                    {user?.name ? user.name[0].toUpperCase() : "U"}
                  </div>
                  <span className="hidden sm:inline text-xs font-semibold text-slate-200 max-w-[100px] truncate">
                    {user?.name || "Account"}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      isProfileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 border-b border-slate-700/50">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-xs font-bold text-white truncate">
                        {user?.email || "User"}
                      </p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-slate-300 hover:bg-slate-700/50 hover:text-amber-400 transition-colors"
                    >
                      <User className="w-4 h-4" /> Profile
                    </Link>

                    <Link
                      to="/my-order"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-slate-300 hover:bg-slate-700/50 hover:text-amber-400 transition-colors"
                    >
                      <Receipt className="w-4 h-4" /> My Orders
                    </Link>

                    {isAdminOrSuperAdmin && (
                      <Link
                        to="/dashboard/admin-home"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-amber-400 hover:bg-slate-700/50 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                      </Link>
                    )}

                    <div className="border-t border-slate-700/50 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl bg-slate-800/80 text-slate-200 hover:text-white border border-slate-700/50 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-3 bg-slate-800/95 border border-slate-700/80 rounded-2xl p-4 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-3 duration-200">
            <div className="flex flex-col space-y-1">
              {[
                { path: "/", label: "Home" },
                { path: "/items", label: "Menu" },
                { path: "/about", label: "About Us" },
                { path: "/contact", label: "Contact" },
              ].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-amber-400 hover:bg-slate-700/50 transition-colors"
                >
                  {item.label}
                </Link>
              ))}

              {user && (
                <>
                  <div className="border-t border-slate-700/50 my-2 pt-2">
                    <Link
                      to="/my-order"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-amber-400 hover:bg-slate-700/50 flex items-center gap-2"
                    >
                      <Receipt className="w-4 h-4" /> My Orders
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-amber-400 hover:bg-slate-700/50 flex items-center gap-2"
                    >
                      <User className="w-4 h-4" /> Profile
                    </Link>
                    {isAdminOrSuperAdmin && (
                      <Link
                        to="/dashboard/admin-home"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="px-4 py-2.5 rounded-xl text-xs font-semibold text-amber-400 hover:bg-slate-700/50 flex items-center gap-2"
                      >
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                      </Link>
                    )}
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
