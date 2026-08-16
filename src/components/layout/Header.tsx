import React, { useState, useRef, useEffect } from "react";
import {
  Menu,
  ChevronDown,
  User,
  LogOut,
  Utensils,
} from "lucide-react";
import { useAppDispatch } from "../../Redux/hooks";
import { logout } from "../../Redux/features/auth/authSlice";
import { Link } from "react-router-dom";

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 w-full bg-slate-900 border-b border-slate-800 text-slate-100 shadow-lg">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center flex-1">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-xl text-slate-400 lg:hidden hover:text-amber-400 hover:bg-slate-800 focus:outline-none"
              onClick={onMenuClick}
            >
              <Menu className="block h-6 w-6" />
            </button>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                className="flex items-center space-x-2.5 p-1.5 rounded-xl hover:bg-slate-800 focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
              >
                <div className="h-9 w-9 rounded-full bg-amber-500 p-[2px]">
                  <div className="h-full w-full bg-slate-900 rounded-full flex items-center justify-center">
                    <Utensils className="h-4 w-4 text-amber-400" />
                  </div>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-slate-400 hidden lg:block ${isOpen ? "rotate-180 text-amber-400" : ""}`}
                />
              </button>

              {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-52 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl py-1.5 z-50">
                  <div className="px-4 py-2 border-b border-slate-800">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                      Restaurant Staff
                    </p>
                  </div>
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-amber-500/10"
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="h-4 w-4 text-amber-400" />
                      Your Profile
                    </Link>
                    <button
                      onClick={() => {
                        dispatch(logout());
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-2.5 w-full text-left px-4 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10"
                    >
                      <LogOut className="h-4 w-4 text-rose-400" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
