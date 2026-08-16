/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo, useEffect } from "react";
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
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";
import { useGetAllUsersQuery } from "../../Redux/features/admin/adminApi";
import {
  useGetAllOrdersQuery,
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} from "../../Redux/features/order/orderApi";
import { useAppDispatch } from "../../Redux/hooks"; // 👈 আপনার প্রজেক্টের useDispatch হুক

// Type definitions for integrated backend data
interface NotificationItem {
  _id: string;
  title: string;
  message?: string;
  createdAt: string;
  isRead: boolean;
}

interface OrderItem {
  _id: string;
  totalAmount?: number;
  totalPrice?: number;
  tableNumber?: string;
  orderType?: string;
  items?: Array<{ name: string; quantity: number }>;
  createdAt: string;
  status?: string;
}

// ⚡ ব্যাকএন্ড সার্ভার URL (আপনার প্রয়োজন অনুযায়ী পোর্ট পরিবর্তন করুন)
const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const AdminHome = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();

  // 1. Fetch Backend Data via RTK Query
  const { data: usersData, isLoading: isUsersLoading } = useGetAllUsersQuery(
    undefined,
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    },
  ) as any;

  const {
    data: ordersData,
    isLoading: isOrdersLoading,
    refetch: refetchOrders,
  } = useGetAllOrdersQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  }) as any;

  const {
    data: notificationsData,
    isLoading: isNotificationsLoading,
    refetch: refetchNotifications,
  } = useGetNotificationsQuery(undefined, {
    pollingInterval: 1000,
  }) as any;

  // Mutations for Notification Actions
  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [markAllAsRead] = useMarkAllNotificationsAsReadMutation();

  // ⚡ 2. Real-time Socket.io Listener Configuration
  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
    });

    // নতুন অর্ডার নোটিফিকেশন ক্যাচ করা
    socket.on("new_order_notification", (notificationData) => {
      console.log(
        "⚡ Real-time Order Notification Received:",
        notificationData,
      );

      // নোটিফিকেশন ও অর্ডার ডাটা রি-ফেচ করে স্টেট আপডেট
      refetchNotifications();
      refetchOrders();

      // অডিও অ্যালার্ট সাউন্ড প্লে (ঐচ্ছিক)
      try {
        const audio = new Audio("/notification.mp3");
        audio.play().catch(() => {});
      } catch (err) {
        console.error("Audio playback error:", err);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [refetchNotifications, refetchOrders, dispatch]);

  // 3. Extract Data Arrays Safely
  const usersList: any[] = useMemo(
    () => usersData?.data || usersData || [],
    [usersData],
  );

  const ordersList: OrderItem[] = useMemo(
    () => ordersData?.data || ordersData || [],
    [ordersData],
  );

  const notificationsList: NotificationItem[] = useMemo(
    () => notificationsData?.data || notificationsData || [],
    [notificationsData],
  );

  // 4. Computed Operational Metrics from Live Orders
  const todaySales = useMemo(() => {
    const today = new Date().toDateString();
    return ordersList.reduce((acc, order) => {
      const orderDate = new Date(order.createdAt).toDateString();
      if (orderDate === today) {
        return acc + (order.totalAmount || order.totalPrice || 0);
      }
      return acc;
    }, 0);
  }, [ordersList]);

  const activeKitchenOrders = useMemo(() => {
    return ordersList.filter(
      (order) =>
        order.status?.toLowerCase() === "pending" ||
        order.status?.toLowerCase() === "processing" ||
        order.status?.toLowerCase() === "cooking",
    ).length;
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

  // 5. Helper Handlers
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

  const formatTimeAgo = (dateString: string) => {
    if (!dateString) return "Just now";
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8">
      <motion.div
        className="max-w-7xl mx-auto space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Restaurant Welcome Header */}
        <motion.div
          className="relative bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/40 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl overflow-visible"
          variants={itemVariants}
        >
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                Kitchen & POS Operations
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Executive Chef & Manager Console
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-xl">
                Real-time operational overview for menu items, customer
                reservations, and table orders.
              </p>
            </div>

            {/* Quick Actions & Live Notifications Dropdown */}
            <div className="flex items-center gap-3 relative">
              <div className="relative">
                <button
                  aria-label="Notifications"
                  onClick={() => setIsOpen(!isOpen)}
                  className="relative p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded-2xl text-slate-300 hover:text-white transition-all active:scale-95 shadow-md"
                >
                  <FiBell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2.5 right-2.5 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                    </span>
                  )}
                </button>

                {/* Notification Dropdown Overlay */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden"
                    >
                      <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/50">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-white">
                            Notifications
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
                            className="text-xs text-amber-400 hover:underline font-medium"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>

                      {/* Dynamic Notification List */}
                      <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/50">
                        {isNotificationsLoading ? (
                          <div className="p-6 flex justify-center text-amber-400">
                            <FiLoader className="w-5 h-5 animate-spin" />
                          </div>
                        ) : notificationsList.length > 0 ? (
                          notificationsList.map((n) => (
                            <div
                              key={n._id}
                              onClick={() => handleMarkSingleAsRead(n._id)}
                              className={`p-3.5 flex items-start gap-3 transition-colors hover:bg-slate-800/50 cursor-pointer ${
                                !n.isRead ? "bg-amber-500/5" : ""
                              }`}
                            >
                              <div className="p-2 bg-slate-800 rounded-xl text-amber-400 mt-0.5">
                                <FiBell className="w-4 h-4" />
                              </div>
                              <div className="flex-1">
                                <p className="text-xs font-medium text-slate-200">
                                  {n.title || n.message}
                                </p>
                                <span className="text-[10px] text-slate-500 mt-1 block">
                                  {formatTimeAgo(n.createdAt)}
                                </span>
                              </div>
                              {!n.isRead && (
                                <span className="h-2 w-2 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="p-6 text-center text-xs text-slate-500">
                            No notifications yet
                          </div>
                        )}
                      </div>

                      <div className="p-3 bg-slate-950/60 text-center border-t border-slate-800">
                        <Link
                          to="/dashboard/notifications"
                          onClick={() => setIsOpen(false)}
                          className="text-xs text-slate-400 font-medium hover:text-white"
                        >
                          View all activity log
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link to="/dashboard/items/add-item">
                <button className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold px-5 py-3 rounded-2xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all text-sm">
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
          {/* Revenue Metric */}
          <motion.div
            className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800/80 backdrop-blur-xl hover:border-amber-500/40 transition-colors shadow-lg"
            variants={itemVariants}
            whileHover={{ y: -4 }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Today's Sales
                </p>
                <h3 className="text-3xl font-extrabold text-white mt-2">
                  {isOrdersLoading ? "..." : `৳${todaySales.toLocaleString()}`}
                </h3>
                <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-emerald-400">
                  <FiTrendingUp className="w-4 h-4" />
                  <span>Calculated from live orders</span>
                </div>
              </div>
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-400">
                <FiDollarSign className="w-6 h-6" />
              </div>
            </div>
          </motion.div>

          {/* Customers Metric */}
          <motion.div
            className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800/80 backdrop-blur-xl hover:border-amber-500/40 transition-colors shadow-lg"
            variants={itemVariants}
            whileHover={{ y: -4 }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Total Guests / Users
                </p>
                <h3 className="text-3xl font-extrabold text-white mt-2">
                  {isUsersLoading ? "..." : usersList.length}
                </h3>
                <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-emerald-400">
                  <FiTrendingUp className="w-4 h-4" />
                  <span>Registered diners</span>
                </div>
              </div>
              <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-2xl text-orange-400">
                <FiUsers className="w-6 h-6" />
              </div>
            </div>
          </motion.div>

          {/* Orders Metric */}
          <motion.div
            className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800/80 backdrop-blur-xl hover:border-amber-500/40 transition-colors shadow-lg"
            variants={itemVariants}
            whileHover={{ y: -4 }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Total Orders
                </p>
                <h3 className="text-3xl font-extrabold text-white mt-2">
                  {isOrdersLoading ? "..." : ordersList.length}
                </h3>
                <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-amber-400">
                  <FiClock className="w-4 h-4" />
                  <span>{activeKitchenOrders} active in kitchen</span>
                </div>
              </div>
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400">
                <FiShoppingBag className="w-6 h-6" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Management Actions & Live Kitchen Activity Stream */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions Panel */}
          <motion.div
            className="bg-slate-900/80 rounded-3xl border border-slate-800 p-6 backdrop-blur-xl shadow-xl"
            variants={itemVariants}
          >
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              Restaurant Management Actions
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/dashboard/products/add-product" className="block">
                <motion.div
                  className="p-4 bg-slate-800/50 hover:bg-amber-500/10 border border-slate-700/60 hover:border-amber-500/30 rounded-2xl text-center group transition-all"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl w-fit mx-auto mb-2 group-hover:scale-110 transition-transform">
                    <FiPackage className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-200">
                    Add Menu Dish
                  </span>
                </motion.div>
              </Link>

              <Link to="/dashboard/customers" className="block">
                <motion.div
                  className="p-4 bg-slate-800/50 hover:bg-amber-500/10 border border-slate-700/60 hover:border-amber-500/30 rounded-2xl text-center group transition-all"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="p-3 bg-orange-500/10 text-orange-400 rounded-xl w-fit mx-auto mb-2 group-hover:scale-110 transition-transform">
                    <FiUsers className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-200">
                    View Diners
                  </span>
                </motion.div>
              </Link>

              <Link to="/dashboard/orders" className="block">
                <motion.div
                  className="p-4 bg-slate-800/50 hover:bg-amber-500/10 border border-slate-700/60 hover:border-amber-500/30 rounded-2xl text-center group transition-all"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl w-fit mx-auto mb-2 group-hover:scale-110 transition-transform">
                    <FiShoppingBag className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-200">
                    Kitchen Queue
                  </span>
                </motion.div>
              </Link>

              <Link to="/analytics" className="block">
                <motion.div
                  className="p-4 bg-slate-800/50 hover:bg-amber-500/10 border border-slate-700/60 hover:border-amber-500/30 rounded-2xl text-center group transition-all"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl w-fit mx-auto mb-2 group-hover:scale-110 transition-transform">
                    <FiActivity className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-200">
                    Sales Reports
                  </span>
                </motion.div>
              </Link>
            </div>
          </motion.div>

          {/* Live Kitchen Stream Activity */}
          <motion.div
            className="bg-slate-900/80 rounded-3xl border border-slate-800 p-6 backdrop-blur-xl shadow-xl"
            variants={itemVariants}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
                Live Kitchen Stream
              </h2>
              <span className="text-xs text-slate-400">
                Live Backend Stream
              </span>
            </div>

            <div className="space-y-3 max-h-[260px] overflow-y-auto">
              {isOrdersLoading ? (
                <div className="p-6 flex justify-center text-amber-400">
                  <FiLoader className="w-6 h-6 animate-spin" />
                </div>
              ) : recentOrders.length > 0 ? (
                recentOrders.map((order) => {
                  const itemsSummary = order.items
                    ? order.items
                        .map((i) => `${i.quantity}x ${i.name}`)
                        .join(", ")
                    : `Order total: ৳${order.totalAmount || order.totalPrice || 0}`;

                  return (
                    <motion.div
                      key={order._id}
                      className="flex items-center justify-between p-3.5 bg-slate-800/40 hover:bg-slate-800/80 border border-slate-800 rounded-2xl cursor-pointer transition-colors"
                      whileHover={{ x: 6 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-2.5 w-2.5 rounded-full bg-amber-400 flex-shrink-0" />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-bold text-slate-100">
                              Order #{order._id.slice(-4).toUpperCase()}
                            </p>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              {order.tableNumber || order.orderType || "Table"}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[180px] sm:max-w-xs">
                            {itemsSummary}
                          </p>
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap">
                        {formatTimeAgo(order.createdAt)}
                      </span>
                    </motion.div>
                  );
                })
              ) : (
                <div className="p-6 text-center text-xs text-slate-500">
                  No orders recorded in system
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Performance & Revenue Chart Placeholder */}
        <motion.div
          className="bg-slate-900/80 rounded-3xl border border-slate-800 p-6 backdrop-blur-xl shadow-xl"
          variants={itemVariants}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">
              Revenue & Peak Hours Overview
            </h2>
            <div className="flex gap-2">
              <button className="px-3 py-1 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white">
                Daily
              </button>
              <button className="px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-semibold text-amber-400">
                Weekly
              </button>
            </div>
          </div>
          <div className="h-60 bg-slate-950/60 rounded-2xl border border-slate-800/80 flex flex-col items-center justify-center p-6 text-center">
            <FiActivity className="w-8 h-8 text-amber-500/60 mb-2" />
            <p className="text-sm font-semibold text-slate-300">
              Peak Hours Analytics Ready
            </p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Connect your POS chart library (e.g., Recharts or Chart.js) to
              visualize order velocity and cover rates.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminHome;
