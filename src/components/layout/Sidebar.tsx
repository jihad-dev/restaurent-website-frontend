/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart,
  X,
  ChevronDown,
  ChevronRight,
  Home,
  Users2,
  UtensilsCrossed,
  Grid,
  UsersRound,
  Ticket,
  Star,
  LogOut,
  UserCheck,
  User,

  Images,
} from "lucide-react";
import { useGetAllOrdersQuery } from "../../Redux/features/order/orderApi";
import { useAppDispatch, useAppSelector } from "../../Redux/hooks";
import { logout } from "../../Redux/features/auth/authSlice";

interface ChildNavItem {
  to: string;
  label: string;
}

interface NavItem {
  to: string;
  icon: React.ReactNode;
  label: string;
  badge?: number | string;
  children?: ChildNavItem[];
}

interface NavGroup {
  groupLabel: string;
  items: NavItem[];
}

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  badge?: number | string;
  children?: ChildNavItem[];
}

const SidebarLink: React.FC<SidebarLinkProps> = ({
  to,
  icon,
  label,
  active,
  badge,
  children,
}) => {
  const location = useLocation();
  const hasChildren = children && children.length > 0;

  const isAnyChildActive =
    hasChildren && children.some((child) => location.pathname === child.to);

  const [isOpen, setIsOpen] = useState(isAnyChildActive);

  const toggleSubmenu = (e: React.MouseEvent) => {
    if (hasChildren) {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="mb-1.5">
      <Link
        to={hasChildren ? "#" : to}
        onClick={toggleSubmenu}
        className={`
          group relative flex items-center px-3.5 py-2.5 text-xs font-semibold rounded-xl w-full
          transition-all duration-200
          ${
            active || isAnyChildActive
              ? "bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-sm shadow-amber-500/5"
              : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
          }
        `}
      >
        {(active || isAnyChildActive) && (
          <span className="absolute left-0 top-2 bottom-2 w-1 bg-amber-400 rounded-r-full shadow-sm shadow-amber-400/50" />
        )}

        <span
          className={`mr-3 text-lg transition-transform duration-200 group-hover:scale-110 ${
            active || isAnyChildActive
              ? "text-amber-400"
              : "text-slate-500 group-hover:text-amber-400"
          }`}
        >
          {icon}
        </span>
        <span className="flex-1 tracking-wide">{label}</span>

        {/* Dynamic Badge Rendering */}
        {badge !== undefined && Number(badge) > 0 && (
          <span className="ml-auto mr-2 px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500 text-slate-950 animate-pulse">
            {badge}
          </span>
        )}

        {hasChildren && (
          <span className="ml-auto text-slate-500 group-hover:text-slate-300">
            {isOpen ? (
              <ChevronDown size={15} className="text-amber-400" />
            ) : (
              <ChevronRight size={15} />
            )}
          </span>
        )}
      </Link>

      {hasChildren && isOpen && (
        <div className="ml-9 mt-1 space-y-1 pl-2 border-l border-slate-800/80">
          {children.map((child, index) => {
            const isChildActive = location.pathname === child.to;
            return (
              <Link
                key={index}
                to={child.to}
                className={`
                  block px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-150
                  ${
                    isChildActive
                      ? "text-amber-400 bg-amber-500/10 font-semibold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                  }
                `}
              >
                {child.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

interface SidebarProps {
  isMobile: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobile, isOpen, onClose }) => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // RTK Query call
  const { data: responseData } = useGetAllOrdersQuery(undefined);
  const user = useAppSelector((state) => state.auth.user);
  const pendingOrders = responseData?.data?.filter((order: any) => {
    const status = order?.status?.toLowerCase();
    return status === "pending" || status === "processing";
  });

  const pendingCount = pendingOrders?.length ?? 0;

  // TODO
  const navigationGroups: NavGroup[] = [
    {
      groupLabel: "Main Menu",
      items: [
        {
          to: "/dashboard/admin-home",
          icon: <LayoutDashboard size={18} />,
          label: "Dashboard",
        },
        {
          to: "/dashboard/orders",
          icon: <ShoppingCart size={18} />,
          label: "Kitchen Orders",
          badge: pendingCount > 0 ? pendingCount : undefined,
        },
      ],
    },
    {
      groupLabel: "Menu Management",
      items: [
        {
          to: "/dashboard/items",
          icon: <Package size={18} />,
          label: "Menu Items",
          children: [
            { to: "/dashboard/all-items", label: "All Dishes" },
            { to: "/dashboard/items/add-item", label: "Add New Dish" },
          ],
        },
        {
          to: "/dashboard/categories",
          icon: <Grid size={18} />,
          label: "Categories",
          children: [
            { to: "/dashboard/categories", label: "All Categories" },
            { to: "/dashboard/categories/add-category", label: "Add Category" },
          ],
        },
      ],
    },
    {
      groupLabel: "User Management",
      items: [
        {
          to: "/dashboard/customers",
          icon: <Users2 size={18} />,
          label: "All Customers",
        },
        {
          to: "/dashboard/all-admin",
          icon: <UserCheck size={18} />,
          label: "All Admins",
        },
        {
          to: "/dashboard/admin/create-admin",
          icon: <UsersRound size={18} />,
          label: "Create Admin",
        },
      ],
    },
    {
      groupLabel: "Marketing & Analytics",
      items: [
        {
          to: "/dashboard/sales-analytics",
          icon: <BarChart size={18} />,
          label: "Sales Analytics",
        },
        {
          to: "/dashboard/coupons",
          icon: <Ticket size={18} />,
          label: "Coupons & Offers",
        },
        {
          to: "/dashboard/all-reviews",
          icon: <Star size={18} />,
          label: "Customer Reviews",
        },
        {
          to: "/dashboard/all-banners",
          icon: <Images size={18} />,
          label: "All Banners",
        },
      ],
    },
    {
      groupLabel: "System",
      items: [
        {
          to: "/",
          icon: <Home size={18} />,
          label: "Home",
        },
      ],
    },
  ];

  const renderNavContent = () => (
    <div className="flex-1 px-3 py-4 space-y-6">
      {navigationGroups.map((group, idx) => (
        <div key={idx}>
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            {group.groupLabel}
          </div>
          {group.items.map((item) => (
            <SidebarLink
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              badge={item.badge}
              active={location.pathname === item.to}
              children={item.children}
            />
          ))}
        </div>
      ))}
    </div>
  );

  const renderProfileFooter = () => (
    <div className="p-3.5 border-t border-slate-800/80 bg-slate-950/40 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="relative">
          {/* Premium Styled Avatar Icon Wrapper */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500/20 via-slate-800 to-slate-800 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-sm shadow-amber-500/10">
            <User size={18} className="text-amber-400" />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-slate-900" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-bold text-slate-100 truncate">
            {user?.email}
          </span>
          <span className="capitalize text-[10px] font-medium text-amber-400">
            {user?.role}
          </span>
        </div>
      </div>
      <button
        onClick={() => {
          dispatch(logout());
          navigate("/login");
        }}
        title="Logout"
        className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
      >
        <LogOut size={16} />
      </button>
    </div>
  );

  if (isMobile) {
    return (
      <div
        className={`
          fixed inset-0 z-50 flex transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div
          className={`
            fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300
            ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
          `}
          onClick={onClose}
        />

        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-slate-900 border-r border-slate-800 shadow-2xl">
          <div className="absolute top-0 right-0 -mr-12 pt-3">
            <button
              className="flex items-center justify-center h-9 w-9 rounded-xl bg-slate-800 text-slate-400 hover:text-white border border-slate-700/60 focus:outline-none"
              onClick={onClose}
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 h-0 pt-5 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex-shrink-0 flex items-center px-5 mb-6">
                <Link
                  to="/dashboard/admin-home"
                  className="flex items-center gap-2.5 group"
                  onClick={onClose}
                >
                  <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 transition-transform duration-300 group-hover:rotate-12 shadow-md shadow-amber-500/20">
                    <UtensilsCrossed className="w-5 h-5" />
                  </div>
                  <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-amber-400 transition-colors">
                    Foodie<span className="text-amber-400">Hub</span>
                  </span>
                </Link>
              </div>

              <nav>{renderNavContent()}</nav>
            </div>

            {renderProfileFooter()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 bg-slate-900 border-r border-slate-800/80">
          <div className="flex items-center h-16 flex-shrink-0 px-5 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md">
            <Link
              to="/dashboard/admin-home"
              className="flex items-center gap-2.5 group"
            >
              <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 transition-transform duration-300 group-hover:rotate-12 shadow-md shadow-amber-500/20">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-amber-400 transition-colors">
                Foodie<span className="text-amber-400">Hub</span>
              </span>
            </Link>
          </div>

          <div className="flex-1 flex flex-col justify-between overflow-y-auto">
            <nav>{renderNavContent()}</nav>
            {renderProfileFooter()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
