/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import {
  FiUsers,
  FiShoppingBag,
  FiDollarSign,
  FiPackage,
  FiActivity,
  FiClock,
  FiTrendingUp,
  FiPlusCircle,
  FiBell,
  FiLoader,
  FiCheckCircle,
  FiChevronRight,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { io, Socket } from "socket.io-client";
import { useGetAllUsersQuery } from "../../Redux/features/admin/adminApi";
import {
  useGetAllOrdersQuery,
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} from "../../Redux/features/order/orderApi";

// ---------------- ⚡ STRICT TYPE DEFINITIONS ----------------
interface FoodItem {
  _id: string;
  name: string;
  price: number;
  image?: string;
  category?: string;
}

interface OrderItem {
  food: FoodItem | string;
  qty: number;
  price: number;
}

interface Order {
  _id: string;
  userId: string;
  phone: string;
  orderItems: OrderItem[];
  totalPrice: number;
  totalAmount?: number;
  status:
    | "Pending"
    | "Processing"
    | "Shipped"
    | "Delivered"
    | "Cancelled"
    | string;
  paymentMethod: string;
  paymentStatus: string;
  tableNumber?: string;
  orderType?: string;
  createdAt: string;
  updatedAt: string;
}

interface NotificationItem {
  _id: string;
  title?: string;
  message?: string;
  createdAt: string;
  isRead: boolean;
}

interface UserItem {
  _id: string;
  name?: string;
  email?: string;
  role?: string;
}

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || "https://restaurent-website-backend-mocha.vercel.app";

// ---------------- ⚡ ANIMATION VARIANTS ----------------
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const dropdownVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, y: 10, scale: 0.95, transition: { duration: 0.15 } },
};

// ---------------- ⚡ HELPER FUNCTIONS ----------------
const formatTimeAgo = (dateString: string): string => {
  if (!dateString) return "Just now";
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const AdminHome = () => {
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);

  // Ref to detect clicks outside notification panel
  const notificationRef = useRef<HTMLDivElement>(null);

  // ---------------- GLOBAL USER INTERACTION LISTENER ----------------
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
      }
    };

    // Global listener attach
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup listener on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ---------------- 1. RTK QUERY HOOKS ----------------
  const { data: usersData, isLoading: isUsersLoading } = useGetAllUsersQuery(
    undefined,
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    },
  );

  const {
    data: ordersData,
    isLoading: isOrdersLoading,
    refetch: refetchOrders,
  } = useGetAllOrdersQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
    pollingInterval: 2000,
  });

  const {
    data: notificationsData,
    isLoading: isNotificationsLoading,
    refetch: refetchNotifications,
  } = useGetNotificationsQuery(undefined, {
    pollingInterval: 5000,
  });

  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [markAllAsRead] = useMarkAllNotificationsAsReadMutation();

  // ---------------- 2. REALTIME SOCKET LISTENER ----------------
  const playNotificationSound = useCallback(() => {
    try {
      const audio = new Audio("/notification2.wav");
      audio.play().catch((err) => {
        console.warn("Autoplay blocked or audio error:", err);
      });
    } catch (err) {
      console.error("Audio playback error:", err);
    }
  }, []);

  useEffect(() => {
    const socket: Socket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
    });

    socket.on("new_order_notification", () => {
      refetchNotifications();
      refetchOrders();
      playNotificationSound();
    });

    return () => {
      socket.disconnect();
    };
  }, [refetchNotifications, refetchOrders, playNotificationSound]);

  // ---------------- 3. DATA EXTRACTION ----------------
  // ---------------- 3. DATA EXTRACTION ----------------
  const usersList: UserItem[] = useMemo(() => {
    if (Array.isArray(usersData)) return usersData;
    const res = usersData as any;
    return res?.data || res?.result || [];
  }, [usersData]);

  const ordersList: Order[] = useMemo(() => {
    if (Array.isArray(ordersData)) return ordersData;
    const res = ordersData as any;
    return res?.data || res?.result || [];
  }, [ordersData]);

  const notificationsList: NotificationItem[] = useMemo(() => {
    if (Array.isArray(notificationsData)) return notificationsData;
    const res = notificationsData as any;
    return res?.data || res?.result || [];
  }, [notificationsData]);

  // ---------------- 4. METRICS COMPUTATION ----------------
  const todaySales = useMemo(() => {
    const today = new Date().toDateString();
    return ordersList.reduce((acc, order) => {
      const orderDate = new Date(order.createdAt).toDateString();
      if (orderDate === today) {
        return acc + (order.totalPrice || order.totalAmount || 0);
      }
      return acc;
    }, 0);
  }, [ordersList]);

  const activeKitchenOrdersCount = useMemo(() => {
    return ordersList.filter((order) => {
      const s = order.status?.toLowerCase();
      return s === "pending" || s === "processing" || s === "cooking";
    }).length;
  }, [ordersList]);

  const recentOrders = useMemo(() => {
    return [...ordersList]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 5);
  }, [ordersList]);

  const unreadCount = useMemo(
    () => notificationsList.filter((n) => !n.isRead).length,
    [notificationsList],
  );

  // ---------------- 5. HANDLERS ----------------
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead(undefined).unwrap();
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const handleMarkSingleAsRead = async (id: string) => {
    try {
      await markAsRead(id).unwrap();
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 selection:bg-amber-500 selection:text-slate-950">
      <motion.div
        className="max-w-7xl mx-auto space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Console */}
        <motion.div
          className="relative z-30 bg-gradient-to-r from-slate-900 via-slate-900/95 to-amber-950/30 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl backdrop-blur-xl"
          variants={itemVariants}
        >
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                Live Operational Control
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Executive Chef & Manager Console
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
                Real-time operational metrics for orders, revenue insights,
                kitchen activity queues, and instant notifications.
              </p>
            </div>

            {/* Quick Actions & Notifications Wrapper */}
            <div className="flex items-center gap-3 relative">
              {/* Notification Container with Ref */}
              <div className="relative" ref={notificationRef}>
                <button
                  aria-label="Toggle Notifications"
                  onClick={() => setIsNotificationOpen((prev) => !prev)}
                  className="relative p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded-2xl text-slate-300 hover:text-white transition-all active:scale-95 shadow-md cursor-pointer"
                >
                  <FiBell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500 border-2 border-slate-900" />
                    </span>
                  )}
                </button>

                {/* Notifications Overlay Dropdown */}
                <AnimatePresence>
                  {isNotificationOpen && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute right-0 mt-3 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-[9999] overflow-hidden backdrop-blur-2xl"
                    >
                      <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-white">
                            Activity Alerts
                          </h3>
                          {unreadCount > 0 && (
                            <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-400 rounded-full border border-amber-500/30">
                              {unreadCount} New
                            </span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllAsRead}
                            className="text-xs cursor-pointer text-amber-400 hover:text-amber-300 font-semibold transition-colors"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>

                      {/* Dynamic Notification List */}
                      <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60">
                        {isNotificationsLoading ? (
                          <div className="p-6 flex justify-center text-amber-400">
                            <FiLoader className="w-5 h-5 animate-spin" />
                          </div>
                        ) : notificationsList.length > 0 ? (
                          notificationsList.map((n) => (
                            <div
                              key={n._id}
                              onClick={() => handleMarkSingleAsRead(n._id)}
                              className={`p-3.5 flex items-start gap-3 transition-colors hover:bg-slate-800/60 cursor-pointer ${
                                !n.isRead ? "bg-amber-500/5" : ""
                              }`}
                            >
                              <div className="p-2 bg-slate-800 rounded-xl text-amber-400 mt-0.5 shrink-0">
                                <FiBell className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-slate-200 truncate">
                                  {n.title || n.message}
                                </p>
                                <span className="text-[10px] text-slate-500 mt-1 block">
                                  {formatTimeAgo(n.createdAt)}
                                </span>
                              </div>
                              {!n.isRead && (
                                <span className="h-2 w-2 rounded-full bg-amber-400 mt-2 shrink-0" />
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="p-8 text-center text-xs text-slate-500">
                            No notifications recorded yet
                          </div>
                        )}
                      </div>

                      <div className="p-3 bg-slate-950 text-center border-t border-slate-800">
                        <Link
                          to="/dashboard/notifications"
                          onClick={() => setIsNotificationOpen(false)}
                          className="text-xs text-slate-400 font-semibold hover:text-amber-400 transition-colors inline-flex items-center gap-1"
                        >
                          View complete activity log <FiChevronRight />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link to="/dashboard/items/add-item">
                <button className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-extrabold px-5 py-3 rounded-2xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all text-xs sm:text-sm">
                  <FiPlusCircle className="w-5 h-5" />
                  New Menu Dish
                </button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Operational Stats Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={containerVariants}
        >
          {/* Revenue Card */}
          <motion.div
            className="bg-slate-900/80 rounded-3xl p-6 border border-slate-800/80 backdrop-blur-xl hover:border-amber-500/40 transition-all shadow-xl"
            variants={itemVariants}
            whileHover={{ y: -4 }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Today's Revenue
                </p>
                <h3 className="text-3xl font-black text-white mt-2">
                  {isOrdersLoading ? (
                    <FiLoader className="w-6 h-6 animate-spin text-amber-400" />
                  ) : (
                    `৳${todaySales.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`
                  )}
                </h3>
                <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-400">
                  <FiTrendingUp className="w-4 h-4" />
                  <span>Calculated from live orders</span>
                </div>
              </div>
              <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-400">
                <FiDollarSign className="w-6 h-6" />
              </div>
            </div>
          </motion.div>

          {/* Diners / Users Card */}
          <motion.div
            className="bg-slate-900/80 rounded-3xl p-6 border border-slate-800/80 backdrop-blur-xl hover:border-amber-500/40 transition-all shadow-xl"
            variants={itemVariants}
            whileHover={{ y: -4 }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Registered Diners
                </p>
                <h3 className="text-3xl font-black text-white mt-2">
                  {isUsersLoading ? (
                    <FiLoader className="w-6 h-6 animate-spin text-orange-400" />
                  ) : (
                    usersList.length
                  )}
                </h3>
                <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-400">
                  <FiTrendingUp className="w-4 h-4" />
                  <span>Active customer base</span>
                </div>
              </div>
              <div className="p-3.5 bg-orange-500/10 border border-orange-500/20 rounded-2xl text-orange-400">
                <FiUsers className="w-6 h-6" />
              </div>
            </div>
          </motion.div>

          {/* Orders Metric Card */}
          <motion.div
            className="bg-slate-900/80 rounded-3xl p-6 border border-slate-800/80 backdrop-blur-xl hover:border-amber-500/40 transition-all shadow-xl"
            variants={itemVariants}
            whileHover={{ y: -4 }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Total Orders
                </p>
                <h3 className="text-3xl font-black text-white mt-2">
                  {isOrdersLoading ? (
                    <FiLoader className="w-6 h-6 animate-spin text-emerald-400" />
                  ) : (
                    ordersList.length
                  )}
                </h3>
                <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-amber-400">
                  <FiClock className="w-4 h-4" />
                  <span>{activeKitchenOrdersCount} active in kitchen</span>
                </div>
              </div>
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400">
                <FiShoppingBag className="w-6 h-6" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Management & Stream Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Management Shortcuts */}
          <motion.div
            className="bg-slate-900/80 rounded-3xl border border-slate-800 p-6 backdrop-blur-xl shadow-xl flex flex-col justify-between"
            variants={itemVariants}
          >
            <div>
              <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                Restaurant Operations Management
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <Link to="/dashboard/items/add-item">
                  <motion.div
                    className="p-4 bg-slate-800/40 hover:bg-amber-500/10 border border-slate-700/60 hover:border-amber-500/30 rounded-2xl text-center group transition-all"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl w-fit mx-auto mb-2 group-hover:scale-110 transition-transform">
                      <FiPackage className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-200">
                      Add Menu Dish
                    </span>
                  </motion.div>
                </Link>

                <Link to="/dashboard/customers">
                  <motion.div
                    className="p-4 bg-slate-800/40 hover:bg-amber-500/10 border border-slate-700/60 hover:border-amber-500/30 rounded-2xl text-center group transition-all"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="p-3 bg-orange-500/10 text-orange-400 rounded-xl w-fit mx-auto mb-2 group-hover:scale-110 transition-transform">
                      <FiUsers className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-200">
                      View Customers
                    </span>
                  </motion.div>
                </Link>

                <Link to="/dashboard/orders">
                  <motion.div
                    className="p-4 bg-slate-800/40 hover:bg-amber-500/10 border border-slate-700/60 hover:border-amber-500/30 rounded-2xl text-center group transition-all"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl w-fit mx-auto mb-2 group-hover:scale-110 transition-transform">
                      <FiShoppingBag className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-200">
                      Kitchen Queue
                    </span>
                  </motion.div>
                </Link>

                <Link to="/dashboard/sales-analytics">
                  <motion.div
                    className="p-4 bg-slate-800/40 hover:bg-amber-500/10 border border-slate-700/60 hover:border-amber-500/30 rounded-2xl text-center group transition-all"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl w-fit mx-auto mb-2 group-hover:scale-110 transition-transform">
                      <FiActivity className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-200">
                      Sales Reports
                    </span>
                  </motion.div>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Live Kitchen Order Stream */}
          <motion.div
            className="bg-slate-900/80 rounded-3xl border border-slate-800 p-6 backdrop-blur-xl shadow-xl"
            variants={itemVariants}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
                Live Kitchen Stream
              </h2>
              <span className="text-[11px] font-mono text-slate-500">
                SOCKET CONNECTED
              </span>
            </div>

            <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
              {isOrdersLoading ? (
                <div className="p-10 flex justify-center text-amber-400">
                  <FiLoader className="w-6 h-6 animate-spin" />
                </div>
              ) : recentOrders.length > 0 ? (
                recentOrders.map((order) => {
                  const itemsSummary =
                    order.orderItems && order.orderItems.length > 0
                      ? order.orderItems
                          .map((item) => {
                            const foodName =
                              typeof item.food === "object" &&
                              item.food !== null
                                ? item.food.name
                                : "Item";
                            return `${item.qty}x ${foodName}`;
                          })
                          .join(", ")
                      : `Total: ৳${order.totalPrice || order.totalAmount || 0}`;

                  return (
                    <motion.div
                      key={order._id}
                      className="flex items-center justify-between p-3.5 bg-slate-800/40 hover:bg-slate-800/80 border border-slate-800/80 rounded-2xl cursor-pointer transition-colors"
                      whileHover={{ x: 4 }}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-2.5 w-2.5 rounded-full bg-amber-400 shrink-0" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-bold text-slate-100">
                              Order #{order._id.slice(-5).toUpperCase()}
                            </p>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              {order.paymentMethod || "COD"}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[180px] sm:max-w-xs">
                            {itemsSummary}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium shrink-0 ml-2">
                        {formatTimeAgo(order.createdAt)}
                      </span>
                    </motion.div>
                  );
                })
              ) : (
                <div className="p-10 text-center text-xs text-slate-500">
                  No live orders received
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Analytics Section */}
        <motion.div
          className="bg-slate-900/80 rounded-3xl border border-slate-800 p-6 backdrop-blur-xl shadow-xl"
          variants={itemVariants}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <h2 className="text-base font-bold text-white">
              Revenue & Kitchen Velocity
            </h2>
            <div className="flex gap-2">
              <button className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors">
                Daily
              </button>
              <button className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-semibold text-amber-400">
                Weekly
              </button>
            </div>
          </div>
          <div className="h-52 bg-slate-950/60 rounded-2xl border border-slate-800/80 flex flex-col items-center justify-center p-6 text-center">
            <FiCheckCircle className="w-8 h-8 text-amber-500/50 mb-2" />
            <p className="text-sm font-bold text-slate-300">
              POS Peak Hours & Live Analytics Ready
            </p>
            <p className="text-xs text-slate-500 mt-1 max-w-md">
              Integrate chart components (e.g., Recharts) to render detailed
              hourly cover rates, order completion times, and sales metrics.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminHome;
