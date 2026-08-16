/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
} from "../../Redux/features/order/orderApi";
import { useState } from "react";
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
} from "lucide-react";

const ViewAllOrders = () => {
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const { data: ordersData, isLoading } = useGetAllOrdersQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  }) as any;
  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    if (!newStatus || updatingId === orderId) return;

    try {
      setUpdatingId(orderId);

      await updateOrderStatus({
        id: orderId,
        status: newStatus,
      }).unwrap();

      toast.success(`Order status updated to "${newStatus}"`);
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || "Failed to update order status. Try again.";
      toast.error(errorMessage);
    } finally {
      setUpdatingId(null);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  const orders = ordersData?.data || [];

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm shadow-emerald-500/5">
            <CheckCircle2 size={13} />
            Delivered
          </span>
        );
      case "shipped":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 shadow-sm shadow-sky-500/5">
            <Truck size={13} />
            Shipped
          </span>
        );
      case "processing":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-sm shadow-amber-500/5 animate-pulse">
            <Clock size={13} />
            Processing
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-sm shadow-rose-500/5">
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Title Section */}
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
            <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-400 shadow-inner">
              Total Orders:{" "}
              <span className="font-bold text-amber-400">{orders.length}</span>
            </div>
          </div>
        </div>

        {/* Orders Table Container */}
        {orders.length > 0 ? (
          <div className="relative rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-2xl overflow-hidden backdrop-blur-xl">
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
                  {orders.map((order: any) => (
                    <tr
                      key={order._id}
                      className="hover:bg-slate-800/40 transition-colors duration-150 group"
                    >
                      {/* Customer Info */}
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
                              {order.userId?.email}
                            </p>
                            <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1">
                              <MapPin size={10} className="text-amber-500" />
                              <span>
                                {order.shippingInfo?.city},{" "}
                                {order.shippingInfo?.country}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Dishes & Quantity */}
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          {order.orderItems?.map((item: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-2">
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

                      {/* Total Price */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-bold text-sm text-slate-100">
                          ৳{order.totalPrice?.toFixed(2)}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          ID: #{order._id?.slice(-6)}
                        </div>
                      </td>

                      {/* Payment */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                          <CreditCard size={13} className="text-amber-400" />
                          <span>{order.paymentMethod}</span>
                        </div>
                        <span
                          className={`inline-block mt-1 text-[10px] font-semibold ${
                            order?.paymentStatus === "Paid"
                              ? "text-emerald-600"
                              : order?.paymentStatus === "Pending"
                                ? "text-amber-500"
                                : "text-rose-500"
                          }`}
                        >
                          {order?.paymentStatus || "Unpaid"}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(order.status)}
                      </td>

                      {/* Status Dropdown Action */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <select
                          disabled={updatingId === order._id}
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }
                          className="bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-200 focus:outline-none focus:border-amber-500/50 hover:border-slate-600 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-12 text-center shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/5">
              <PackageCheck size={32} />
            </div>
            <h2 className="text-xl font-extrabold text-white mb-2">
              No Kitchen Orders Yet
            </h2>
            <p className="text-sm text-slate-400 max-w-sm mx-auto">
              When guests place food orders online, they will display here in
              real-time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewAllOrders;
