/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  useGetUserOrdersQuery,
  useUpdateOrderStatusMutation,
} from "../../Redux/features/order/orderApi";
import { useAppSelector } from "../../Redux/hooks";
import Loader from "../../utils/Loader";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  ShoppingBag,
  Home,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  MapPin,
  CreditCard,
  ChevronRight,
  Star,
} from "lucide-react";
import { IFood } from "../Cart/Cart";

interface OrderItem {
  food: IFood | string;
  qty: number;
  price: number;
}

interface ShippingInfo {
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}

// ⚡ paymentInfo Interface matched with real JSON data
interface PaymentInfo {
  transactionId?: string;
  status?: string;
  val_id?: string;
  bank_tran_id?: string;
  [key: string]: any;
}

interface Order {
  _id: string;
  userId: string;
  phone: string;
  orderItems: OrderItem[];
  shippingInfo: ShippingInfo;
  paymentMethod: string;
  paymentStatus: "Pending" | "Paid" | "Failed" | string;
  paymentInfo?: PaymentInfo; // Added nested paymentInfo object
  totalPrice: number;
  status:
    | "Pending"
    | "Processing"
    | "Shipped"
    | "Delivered"
    | "Cancelled"
    | string;
  transactionId?: string; // Fallback for direct field
  tran_id?: string;
  createdAt: string;
  updatedAt: string;
}

interface OrdersResponse {
  data?: Order[];
  result?: Order[];
}

// ---------------- ⚡ ORDER STEPPER LOGIC & COMPONENT ----------------
const ORDER_STEPS = [
  { label: "Placed", key: "pending" },
  { label: "Preparing", key: "processing" },
  { label: "On the Way", key: "shipped" },
  { label: "Delivered", key: "delivered" },
];

const getStepIndex = (status: string) => {
  const s = status?.toLowerCase();
  if (s === "pending") return 0;
  if (s === "processing") return 1;
  if (s === "shipped" || s === "in transit") return 2;
  if (s === "delivered") return 3;
  return -1;
};

const OrderStepper = ({ status }: { status: string }) => {
  const currentStep = getStepIndex(status);
  const isCancelled = status?.toLowerCase() === "cancelled";

  if (isCancelled) {
    return (
      <div className="py-2.5 px-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-center text-xs text-rose-400 font-semibold my-2">
        ❌ This order has been cancelled.
      </div>
    );
  }

  return (
    <div className="w-full py-4 px-2 my-1">
      <div className="relative flex items-center justify-between">
        {/* Progress Background Bar */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-700 -translate-y-1/2 z-0 rounded-full" />

        {/* Active Animated Progress Bar */}
        <div
          className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-orange-500 to-amber-500 -translate-y-1/2 z-0 rounded-full transition-all duration-500"
          style={{
            width: `${(Math.max(0, currentStep) / (ORDER_STEPS.length - 1)) * 100}%`,
          }}
        />

        {/* Individual Step Circles & Labels */}
        {ORDER_STEPS.map((step, idx) => {
          const isCompleted = idx <= currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div
              key={step.key}
              className="relative z-10 flex flex-col items-center"
            >
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isCompleted
                    ? "bg-gradient-to-tr from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30 ring-4 ring-slate-800"
                    : "bg-slate-800 border-2 border-slate-600 text-slate-400"
                } ${isCurrent ? "scale-110 ring-orange-500/50" : ""}`}
              >
                {isCompleted ? "✓" : idx + 1}
              </div>

              <span
                className={`text-[10px] sm:text-xs font-semibold mt-2 whitespace-nowrap ${
                  isCompleted ? "text-orange-400" : "text-slate-500"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
// -------------------------------------------------------------------

const MyOrder = () => {
  const user = useAppSelector((state) => state.auth.user);

  const { data: responseData, isLoading } = useGetUserOrdersQuery(user?.id, {
    pollingInterval: 3000,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  }) as {
    data: OrdersResponse | Order[] | undefined;
    isLoading: boolean;
  };

  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // ⚡ FIX: paymentInfo.transactionId থেকে নিরাপদে Txn ID এক্সট্র্যাক্ট করার লজিক
  const getTransactionId = (order: Order) => {
    return (
      order?.paymentInfo?.transactionId ||
      order?.transactionId ||
      order?.tran_id ||
      "N/A"
    );
  };

  // Order Cancel Handler
  const handleCancelOrder = async (orderId: string) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to cancel this order?",
    );
    if (!isConfirmed) return;

    try {
      setCancellingId(orderId);
      await updateOrderStatus({
        id: orderId,
        status: "Cancelled",
      }).unwrap();

      toast.success("Order cancelled successfully");
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || "Failed to cancel order. Please try again.";
      toast.error(errorMessage);
    } finally {
      setCancellingId(null);
    }
  };

  if (isLoading) return <Loader />;

  const orders: Order[] = Array.isArray(responseData)
    ? responseData
    : responseData?.data || responseData?.result || [];

  const filteredOrders = orders.filter((order) => {
    const searchLower = searchTerm.toLowerCase();
    const txnId = getTransactionId(order).toLowerCase();

    return (
      order._id.toLowerCase().includes(searchLower) ||
      txnId.includes(searchLower) ||
      order.status.toLowerCase().includes(searchLower)
    );
  });

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
          </span>
        );
      case "in transit":
      case "shipped":
      case "processing":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5" /> {status}
          </span>
        );
      case "cancelled":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header and Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 backdrop-blur-md">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Order ID or Transaction..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-orange-500 transition-all"
            />
          </div>

          <Link
            to="/"
            className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 shrink-0"
          >
            <Home className="w-4 h-4" /> Home
          </Link>
        </div>

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-5">
            {filteredOrders.map((order) => {
              const lowerStatus = order.status?.toLowerCase();
              const lowerPaymentMethod = order.paymentMethod?.toLowerCase();
              const lowerPaymentStatus = order.paymentStatus?.toLowerCase();

              const isCashOnDelivery =
                lowerPaymentMethod === "cod" ||
                lowerPaymentMethod === "cash on delivery" ||
                lowerPaymentMethod === "cash";

              const isCancelable =
                isCashOnDelivery &&
                lowerPaymentStatus !== "paid" &&
                (lowerStatus === "pending" || lowerStatus === "processing");

              const isDelivered = lowerStatus === "delivered";

              return (
                <div
                  key={order._id}
                  className="bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-700/60 p-5 shadow-xl transition-all hover:border-slate-600 space-y-4"
                >
                  {/* Top Info Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-700/60">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 font-medium">
                          Txn ID:
                        </span>
                        <span className="text-xs font-mono font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                          {getTransactionId(order)}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Placed on:{" "}
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {getStatusBadge(order.status)}
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                          order.paymentStatus === "Paid"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>

                  {/* ⚡ VISUAL ORDER STEPPER */}
                  <OrderStepper status={order.status} />

                  {/* Items Mapping */}
                  <div className="divide-y divide-slate-700/40 my-2">
                    {order.orderItems?.map((item, index) => {
                      const foodObj =
                        typeof item.food === "object" && item.food !== null
                          ? item.food
                          : null;
                      const foodName = foodObj
                        ? foodObj.name
                        : `Item #${index + 1}`;
                      const foodImg = foodObj ? foodObj.image : null;

                      return (
                        <div
                          key={index}
                          className="py-3 flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3">
                            {foodImg ? (
                              <img
                                src={foodImg}
                                alt={foodName}
                                className="w-12 h-12 object-cover rounded-xl border border-slate-700 shrink-0"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center border border-slate-700 text-slate-500 shrink-0">
                                <ShoppingBag className="w-5 h-5" />
                              </div>
                            )}
                            <div>
                              <h4 className="text-sm font-semibold text-slate-200">
                                {foodName}
                              </h4>
                              <p className="text-xs text-slate-400 mt-0.5">
                                Qty:{" "}
                                <span className="text-slate-200 font-bold">
                                  {item.qty}
                                </span>{" "}
                                × ৳{item.price}
                              </p>
                            </div>
                          </div>
                          <span className="text-sm font-bold text-slate-200">
                            ৳{(item.qty * item.price).toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Bottom Order Details & Actions */}
                  <div className="pt-4 border-t border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-400">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-300">
                          Deliver To:
                        </span>{" "}
                        {order.shippingInfo?.address},{" "}
                        {order.shippingInfo?.city} ({order.shippingInfo?.phone})
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6">
                      <div className="flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-amber-400" />
                        <span>{order.paymentMethod}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-400 block">
                          Total Amount
                        </span>
                        <span className="text-base font-black text-orange-400">
                          ৳{order.totalPrice?.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons Section */}
                  {(isCancelable || isDelivered) && (
                    <div className="pt-3 border-t border-slate-700/40 flex justify-end gap-3">
                      {isCancelable && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          disabled={cancellingId === order._id}
                          className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl font-semibold text-xs transition-all flex items-center gap-1.5 disabled:opacity-50"
                        >
                          <XCircle className="w-4 h-4" />
                          {cancellingId === order._id
                            ? "Cancelling..."
                            : "Cancel Order"}
                        </button>
                      )}

                      {isDelivered && (
                        <Link
                          to={`/review/${order._id}`}
                          className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl font-semibold text-xs transition-all flex items-center gap-1.5"
                        >
                          <Star className="w-4 h-4" /> Give Review
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-800/40 rounded-3xl border border-slate-700/60 backdrop-blur-md">
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-700 text-slate-500">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-200">
              No Orders Found
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              You haven't placed any orders yet or no match found for your
              search.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 mt-6 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-orange-500/20"
            >
              Explore Menu <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrder;
