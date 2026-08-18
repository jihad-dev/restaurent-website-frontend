
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useTransition, useMemo } from "react";
import {
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
} from "../../Redux/features/order/orderApi";
import { toast } from "sonner";
import Loader from "../../utils/Loader";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  CreditCard,
  User,
  MapPin,
  PackageCheck,
  Search,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";

const ViewAllOrders = () => {
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("All");

  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [, startTransition] = useTransition();

  // ⚡ Auto Polling & Focus Refetch with typed arguments
  const {
    data: ordersData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetAllOrdersQuery(
    {
      page,
      limit,
      status: activeTab === "All" ? "" : activeTab.toLowerCase(),
      searchTerm: debouncedSearch,
    },
    {
      pollingInterval: 15000,
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    },
  );

  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  // Extract raw orders from API response
  const rawOrders: any[] = useMemo(() => {
    return ordersData?.data?.result || ordersData?.data || [];
  }, [ordersData]);

  // ⚡ 1. Newest Orders First
  const sortedRawOrders = useMemo(() => {
    return [...rawOrders].sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA; // Descending order
    });
  }, [rawOrders]);

  // ⚡ 2. Multi-Field Client-Side Search Filter (Customer Name, Dish Title, Phone, Txn, ID)
  const searchFilteredOrders = useMemo(() => {
    if (!debouncedSearch.trim()) return sortedRawOrders;

    const term = debouncedSearch.toLowerCase().trim();

    return sortedRawOrders.filter((order: any) => {
      // Customer Name & Phone
      const userName = order?.userId?.name?.toLowerCase() || "";
      const phone =
        order?.shippingInfo?.phone?.toLowerCase() ||
        order?.phone?.toLowerCase() ||
        "";

      // Transaction ID & Order ID
      const txnId = order?.paymentInfo?.transactionId?.toLowerCase() || "";
      const orderId = order?._id?.toLowerCase() || "";

      // Shipping Address Info
      const city = order?.shippingInfo?.city?.toLowerCase() || "";
      const address = order?.shippingInfo?.address?.toLowerCase() || "";

      // Food / Item Titles
      const itemMatch = order?.orderItems?.some((item: any) =>
        item?.food?.name?.toLowerCase().includes(term),
      );

      return (
        userName.includes(term) ||
        phone.includes(term) ||
        txnId.includes(term) ||
        orderId.includes(term) ||
        city.includes(term) ||
        address.includes(term) ||
        itemMatch
      );
    });
  }, [sortedRawOrders, debouncedSearch]);

  // ⚡ 3. Status Tab Filter
  const filteredOrders = useMemo(() => {
    return searchFilteredOrders.filter((order: any) => {
      if (activeTab === "All") return true;
      return order?.status?.toLowerCase() === activeTab.toLowerCase();
    });
  }, [searchFilteredOrders, activeTab]);

  // ⚡ 4. Tab Count Calculation (Reflects current search query)
  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = {
      All: searchFilteredOrders.length,
      Pending: 0,
      Processing: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0,
    };

    searchFilteredOrders.forEach((order) => {
      const status = order?.status?.toLowerCase();
      if (status === "pending") counts.Pending++;
      else if (status === "processing") counts.Processing++;
      else if (status === "shipped") counts.Shipped++;
      else if (status === "delivered") counts.Delivered++;
      else if (status === "cancelled") counts.Cancelled++;
    });

    return counts;
  }, [searchFilteredOrders]);

  const meta = ordersData?.data?.meta || {
    total: filteredOrders.length,
    page: 1,
    totalPage: Math.ceil(filteredOrders.length / limit) || 1,
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    startTransition(() => {
      setDebouncedSearch(val);
      setPage(1);
    });
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setPage(1);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const currentOrder = filteredOrders.find((o: any) => o._id === orderId);

    if (currentOrder?.status?.toLowerCase() === "delivered") {
      toast.error("Delivered orders are final and cannot be modified.");
      return;
    }

    if (!newStatus || updatingId === orderId) return;

    try {
      setUpdatingId(orderId);

      await updateOrderStatus({
        id: orderId,
        status: newStatus,
      }).unwrap();

      toast.success(`Order status updated to "${newStatus}"`);
    } catch (err: any) {
      const errorMessage =
        err?.data?.message || err?.message || "Failed to update order status.";
      toast.error(errorMessage);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm">
            <CheckCircle2 size={13} />
            Delivered
          </span>
        );
      case "shipped":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 shadow-sm">
            <Truck size={13} />
            Shipped
          </span>
        );
      case "processing":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-sm animate-pulse">
            <Clock size={13} />
            Processing
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-sm">
            <XCircle size={13} />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
            <Clock size={13} />
            Pending
          </span>
        );
    }
  };

  const tabs = [
    "All",
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Title & Refetch Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
              <ShoppingBag size={14} /> Kitchen Fulfillment
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Customer Orders
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer disabled:opacity-50"
              title="Refresh Data"
            >
              <RefreshCw
                size={16}
                className={isFetching ? "animate-spin" : ""}
              />
            </button>

            <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-400 shadow-inner">
              Total Records:{" "}
              <span className="font-bold text-amber-400">
                {filteredOrders.length}
              </span>
            </div>
          </div>
        </div>

        {/* Search Bar & Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Tab Buttons with Count Badges */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {tabs.map((tab) => {
              const count = tabCounts[tab] || 0;
              const isActive = activeTab === tab;

              return (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/10"
                      : "bg-slate-900 text-slate-400 border border-slate-800/80 hover:bg-slate-800/60 hover:text-slate-200"
                  }`}
                >
                  <span>{tab}</span>
                  <span
                    className={`px-1.5 py-0.5 text-[10px] rounded-full font-bold transition-all ${
                      isActive
                        ? "bg-slate-950 text-amber-400"
                        : "bg-slate-800 text-slate-300 border border-slate-700"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by customer, dish, phone, Txn..."
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-all"
            />
          </div>
        </div>

        {/* Error State */}
        {isError && (
          <div className="rounded-2xl bg-rose-500/10 border border-rose-500/20 p-6 text-center text-rose-400 space-y-3">
            <AlertTriangle className="w-8 h-8 mx-auto" />
            <h3 className="font-bold text-base">Failed to Load Orders</h3>
            <p className="text-xs text-rose-300">
              {(error as any)?.data?.message ||
                "Network error occurred or server unresponsive."}
            </p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-rose-500 text-white rounded-xl text-xs font-bold hover:bg-rose-600 transition-all"
            >
              Retry
            </button>
          </div>
        )}

        {/* Orders Table Container */}
        {!isError && filteredOrders.length > 0 ? (
          <div className="relative rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-2xl overflow-hidden backdrop-blur-xl">
            {isFetching && (
              <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px] flex items-center justify-center z-10">
                <RefreshCw className="w-6 h-6 text-amber-400 animate-spin" />
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 uppercase font-semibold tracking-wider">
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Dishes & Quantity</th>
                    <th className="px-6 py-4">Total Amount</th>
                    <th className="px-6 py-4">Payment</th>
                    <th className="px-6 py-4">Order Status</th>
                    <th className="px-6 py-4 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredOrders.map((order: any) => {
                    const isDelivered =
                      order.status?.toLowerCase() === "delivered";

                    return (
                      <tr
                        key={order._id}
                        className="hover:bg-slate-800/40 transition-colors duration-150 group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-start gap-3">
                            <div className="p-2.5 rounded-xl bg-slate-800 text-amber-400 border border-slate-700/60 group-hover:border-amber-500/30 transition-colors">
                              <User size={16} />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-200 group-hover:text-amber-400 transition-colors">
                                {order.userId?.name || "Guest Customer"}
                              </p>
                              <p className="text-[11px] text-slate-400">
                                📞{" "}
                                {order.shippingInfo?.phone ||
                                  order.phone ||
                                  "N/A"}
                              </p>
                              <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1">
                                <MapPin size={10} className="text-amber-500" />
                                <span>
                                  {order.shippingInfo?.city || "Dhaka"},{" "}
                                  {order.shippingInfo?.country || "Bangladesh"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            {order.orderItems?.map((item: any, idx: number) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2"
                              >
                                {item.food?.image && (
                                  <img
                                    src={item.food.image}
                                    alt={item.food?.name}
                                    className="w-7 h-7 rounded-lg object-cover border border-slate-700"
                                  />
                                )}
                                <div>
                                  <span className="font-medium text-slate-300">
                                    {item.food?.name || "Food Item"}
                                  </span>
                                  <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                    x{item.qty}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-bold text-sm text-slate-100">
                            ৳{order.totalPrice?.toFixed(2)}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            Txn: {order?.paymentInfo?.transactionId || "N/A"}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                            <CreditCard size={13} className="text-amber-400" />
                            <span>{order.paymentMethod || "COD"}</span>
                          </div>
                          <span
                            className={`inline-block mt-1 text-[10px] font-semibold ${
                              order?.paymentStatus === "Paid"
                                ? "text-emerald-400"
                                : order?.paymentStatus === "Pending"
                                  ? "text-amber-400"
                                  : "text-rose-400"
                            }`}
                          >
                            {order?.paymentStatus || "Unpaid"}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(order.status)}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <select
                            disabled={updatingId === order._id || isDelivered}
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(order._id, e.target.value)
                            }
                            className="bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-200 focus:outline-none focus:border-amber-500/50 hover:border-slate-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="px-6 py-4 bg-slate-900/90 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-400">
                Showing Page <strong className="text-amber-400">{page}</strong>{" "}
                of{" "}
                <strong className="text-amber-400">
                  {meta.totalPage || 1}
                </strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1 || isFetching}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl disabled:opacity-40 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft size={14} /> Prev
                </button>
                <button
                  disabled={page >= (meta.totalPage || 1) || isFetching}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl disabled:opacity-40 transition-all flex items-center gap-1 cursor-pointer"
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          !isError && (
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-12 text-center shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/5">
                <PackageCheck size={32} />
              </div>
              <h2 className="text-xl font-extrabold text-white mb-2">
                No Orders Found
              </h2>
              <p className="text-sm text-slate-400 max-w-sm mx-auto">
                No matching order records found for "{activeTab}" tab and search
                term "{debouncedSearch}".
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ViewAllOrders;
