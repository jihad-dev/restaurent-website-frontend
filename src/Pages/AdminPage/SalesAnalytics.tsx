/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  FiTrendingUp,
  FiDollarSign,
  FiClock,
  FiCalendar,
  FiAward,
  FiAlertTriangle,
  FiPieChart,
  FiLoader,
  FiFilter,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { useGetAllOrdersQuery } from "../../Redux/features/order/orderApi";

interface OrderItem {
  _id: string;
  totalAmount?: number;
  totalPrice?: number;
  createdAt: string;
  items?: Array<{
    name: string;
    quantity: number;
    price?: number;
    category?: string;
  }>;
}

const COLORS = [
  "#f59e0b",
  "#10b981",
  "#3b82f6",
  "#ec4899",
  "#8b5cf6",
  "#f97316",
];

// Framer Motion Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const SalesAnalytics = () => {
  const [activeRange, setActiveRange] = useState<
    "daily" | "weekly" | "monthly"
  >("weekly");

  const { data: ordersData, isLoading } = useGetAllOrdersQuery(undefined, {
    refetchOnMountOrArgChange: true,
  }) as any;

  const ordersList: OrderItem[] = useMemo(
    () => ordersData?.data || ordersData || [],
    [ordersData],
  );

  // Sales Overview Calculations
  const salesOverview = useMemo(() => {
    const now = new Date();
    const todayStr = now.toDateString();

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    let todaySales = 0;
    let weekSales = 0;
    let monthSales = 0;

    ordersList.forEach((order) => {
      const amount = order.totalAmount || order.totalPrice || 0;
      const orderDate = new Date(order.createdAt);

      if (orderDate.toDateString() === todayStr) todaySales += amount;
      if (orderDate >= startOfWeek) weekSales += amount;
      if (orderDate >= startOfMonth) monthSales += amount;
    });

    return { todaySales, weekSales, monthSales };
  }, [ordersList]);

  // Peak Hours Analysis
  const peakHoursData = useMemo(() => {
    const hoursCount = Array.from({ length: 24 }, (_, i) => ({
      hour: `${i === 0 ? 12 : i > 12 ? i - 12 : i}${i >= 12 ? "PM" : "AM"}`,
      orders: 0,
      sales: 0,
    }));

    ordersList.forEach((order) => {
      const date = new Date(order.createdAt);
      const hour = date.getHours();
      hoursCount[hour].orders += 1;
      hoursCount[hour].sales += order.totalAmount || order.totalPrice || 0;
    });

    return hoursCount.slice(10, 24);
  }, [ordersList]);

  // Day Comparison
  const dayComparisonData = useMemo(() => {
    let weekendSales = 0;
    let weekdaySales = 0;
    let weekendOrders = 0;
    let weekdayOrders = 0;

    ordersList.forEach((order) => {
      const day = new Date(order.createdAt).getDay();
      const amount = order.totalAmount || order.totalPrice || 0;

      if (day === 5 || day === 6) {
        weekendSales += amount;
        weekendOrders += 1;
      } else {
        weekdaySales += amount;
        weekdayOrders += 1;
      }
    });

    return [
      { name: "Weekend (Fri-Sat)", sales: weekendSales, orders: weekendOrders },
      {
        name: "Weekdays (Sun-Thu)",
        sales: weekdaySales,
        orders: weekdayOrders,
      },
    ];
  }, [ordersList]);

  // Menu Performance
  const { topDishes, lowDishes, categoryData } = useMemo(() => {
    const dishMap: Record<
      string,
      { name: string; quantity: number; revenue: number }
    > = {};
    const catMap: Record<string, number> = {};

    ordersList.forEach((order) => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach((item) => {
          const qty = item.quantity || 1;
          const price = item.price || 0;
          const name = item.name || "Unknown Item";
          const category = item.category || "General";

          if (!dishMap[name]) {
            dishMap[name] = { name, quantity: 0, revenue: 0 };
          }
          dishMap[name].quantity += qty;
          dishMap[name].revenue += qty * price;

          catMap[category] = (catMap[category] || 0) + qty * price;
        });
      }
    });

    const sortedDishes = Object.values(dishMap).sort(
      (a, b) => b.quantity - a.quantity,
    );

    return {
      topDishes: sortedDishes.slice(0, 5),
      lowDishes:
        sortedDishes.length > 5 ? sortedDishes.slice(-5).reverse() : [],
      categoryData: Object.keys(catMap).map((catName) => ({
        name: catName,
        value: catMap[catName],
      })),
    };
  }, [ordersList]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-amber-400 gap-3">
        <FiLoader className="w-10 h-10 animate-spin text-amber-500" />
        <p className="text-xs text-slate-400 tracking-wider">
          Loading Live Sales Analytics...
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8"
    >
      {/* Header & Quick Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <FiTrendingUp className="text-amber-400" /> Executive Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time revenue metrics, peak ordering hours, and menu insights.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 p-1 rounded-xl self-start md:self-auto">
          <FiFilter className="text-slate-400 ml-2 mr-1 text-xs" />
          {(["daily", "weekly", "monthly"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setActiveRange(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all duration-200 ${
                activeRange === type
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* FEATURE 1: Overview Cards */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-5"
      >
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 shadow-xl hover:border-amber-500/30 transition-all duration-300"
        >
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Today's Revenue
              </span>
              <h3 className="text-3xl font-black text-amber-400 mt-2 tracking-tight">
                ৳{salesOverview.todaySales.toLocaleString()}
              </h3>
            </div>
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl">
              <FiDollarSign className="w-6 h-6" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-4 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />{" "}
            Live Orders Total
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 shadow-xl hover:border-emerald-500/30 transition-all duration-300"
        >
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                This Week's Revenue
              </span>
              <h3 className="text-3xl font-black text-emerald-400 mt-2 tracking-tight">
                ৳{salesOverview.weekSales.toLocaleString()}
              </h3>
            </div>
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl">
              <FiCalendar className="w-6 h-6" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-4">
            Calculated Sun - Sat
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 shadow-xl hover:border-blue-500/30 transition-all duration-300"
        >
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                This Month's Revenue
              </span>
              <h3 className="text-3xl font-black text-blue-400 mt-2 tracking-tight">
                ৳{salesOverview.monthSales.toLocaleString()}
              </h3>
            </div>
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-2xl">
              <FiTrendingUp className="w-6 h-6" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-4">
            Current Calendar Month
          </p>
        </motion.div>
      </motion.div>

      {/* FEATURE 2 & 3: Peak Hours & Day Comparison */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 shadow-xl">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FiClock className="text-amber-400" /> Peak Hours & Rush Time
            </h2>
            <p className="text-xs text-slate-400">
              Hourly order density throughout the day
            </p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={peakHoursData}>
                <defs>
                  <linearGradient id="peakGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#334155"
                  opacity={0.3}
                />
                <XAxis
                  dataKey="hour"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "12px",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="orders"
                  name="Orders"
                  stroke="#f59e0b"
                  fill="url(#peakGradient)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
            <FiCalendar className="text-emerald-400" /> Day-over-Day Comparison
          </h2>
          <p className="text-xs text-slate-400 mb-6">
            Weekend (Fri-Sat) vs Workday Revenue
          </p>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dayComparisonData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#334155"
                  opacity={0.3}
                />
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  fontSize={10}
                  tickLine={false}
                />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "12px",
                  }}
                />
                <Bar
                  dataKey="sales"
                  name="Sales (৳)"
                  fill="#10b981"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* FEATURE 4, 5 & 6: Item & Category Analytics */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Top Selling */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <FiAward className="text-amber-400" /> Top Selling Dishes
          </h2>
          <div className="space-y-3">
            {topDishes.length > 0 ? (
              topDishes.map((dish, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-slate-800/30 border border-slate-800/60 rounded-xl hover:bg-slate-800/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-white">
                        {dish.name}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {dish.quantity} sold
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-amber-400">
                    ৳{dish.revenue.toLocaleString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500">
                No sales records available.
              </p>
            )}
          </div>
        </div>

        {/* Low Performers */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <FiAlertTriangle className="text-rose-400" /> Low Performing Dishes
          </h2>
          <div className="space-y-3">
            {lowDishes.length > 0 ? (
              lowDishes.map((dish, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-slate-800/30 border border-slate-800/60 rounded-xl hover:bg-slate-800/60 transition-colors"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-200">
                      {dish.name}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Only {dish.quantity} sold
                    </p>
                  </div>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    Low Demand
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500">
                No low performers detected.
              </p>
            )}
          </div>
        </div>

        {/* Category Revenue */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <FiPieChart className="text-blue-400" /> Category Revenue
          </h2>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                >
                  {categoryData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "12px",
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SalesAnalytics;
