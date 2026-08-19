import React, { useState, FormEvent } from "react";
import {
  useClearCartMutation,
  useGetCartQuery,
} from "../../Redux/features/cart/cartApi";
import { useAppSelector } from "../../Redux/hooks";
import { toast } from "sonner";
import Loader from "../../utils/Loader";
import { useLocation, useNavigate } from "react-router-dom";
import { useCreateOrderMutation } from "../../Redux/features/order/orderApi";
import {
  ShoppingBag,
  MapPin,
  CreditCard,
  Wallet,
  Truck,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  UtensilsCrossed,
  AlertCircle,
} from "lucide-react";

interface FoodItem {
  _id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  isAvailable: boolean;
  rating: number;
}

interface CartItem {
  foodId: FoodItem;
  quantity: number;
  _id?: string;
}

interface CartData {
  _id: string;
  userId: string;
  items: CartItem[];
}

interface RtkError {
  status: number;
  data: {
    message: string;
  };
}

interface PaymentSession {
  payment_url?: string;
}

interface CreateOrderSuccessResponse {
  data?: {
    paymentSession?: PaymentSession;
  };
}

const CheckoutPage = () => {
  const [createOrder, { isLoading: isOrderLoading }] = useCreateOrderMutation();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [clearCart] = useClearCartMutation();
  const user = useAppSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const location = useLocation();
  const totalPrice = location.state?.totalPrice;

  const { data, isLoading } = useGetCartQuery(undefined, {
    skip: !user,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const cart: CartData | undefined = data as CartData | undefined;

  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "Bangladesh",
    phone: "",
  });

  const [phoneError, setPhoneError] = useState("");
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] =
    useState("bKash");

  // BD Phone Number Regex: Starts with 013, 014, 015, 016, 017, 018, 019 and exactly 11 digits
  const validateBDPhone = (phone: string) => {
    const bdPhoneRegex = /^01[3-9]\d{8}$/;
    return bdPhoneRegex.test(phone);
  };

  const paymentOptions = [
    {
      id: "bKash",
      name: "bKash",
      icon: <Wallet className="w-5 h-5 text-pink-600" />,
      badge: "Popular",
      description: "Fast & secure digital payment via bKash gateway.",
      buttonText: "Pay with bKash",
    },
    {
      id: "Nagad",
      name: "Nagad",
      icon: <Wallet className="w-5 h-5 text-orange-600" />,
      description: "Instant mobile transaction using your Nagad wallet.",
      buttonText: "Pay with Nagad",
    },
    {
      id: "Card",
      name: "Debit / Credit Card",
      icon: <CreditCard className="w-5 h-5 text-indigo-600" />,
      description: "Supports Visa, Mastercard, and local bank cards.",
      buttonText: "Pay via Card",
    },
    {
      id: "COD",
      name: "Cash on Delivery",
      icon: <Truck className="w-5 h-5 text-emerald-600" />,
      description:
        "Pay cash directly to the delivery hero upon receiving food.",
      buttonText: "Confirm COD Order",
    },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "phone") {
      // Allow only numbers and restrict max length to 11
      const onlyNums = value.replace(/\D/g, "").slice(0, 11);

      setShippingInfo((prevState) => ({
        ...prevState,
        phone: onlyNums,
      }));

      // Real-time validation message
      if (onlyNums.length > 0 && !validateBDPhone(onlyNums)) {
        setPhoneError("Enter a valid 11-digit BD number (e.g. 017XXXXXXXX)");
      } else {
        setPhoneError("");
      }
      return;
    }

    setShippingInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateBDPhone(shippingInfo.phone)) {
      toast.error("Please enter a valid 11-digit Bangladeshi mobile number.");
      setPhoneError("Valid 11-digit BD phone number required.");
      return;
    }

    if (
      !shippingInfo.address ||
      !shippingInfo.city ||
      !shippingInfo.postalCode ||
      !shippingInfo.country
    ) {
      toast.error("Please fill in all delivery details.");
      return;
    }

    if (!cart?.items?.length) {
      toast.error("Your cart is empty.");
      return;
    }

    if (!user?.id) {
      toast.error("User session not found. Please log in.");
      return;
    }

    if (totalPrice === undefined || totalPrice === null) {
      toast.error("Total amount is missing. Please review your cart.");
      return;
    }

    const selectedMethod =
      paymentOptions.find((p) => p.id === selectedPaymentMethodId)?.name ||
      "Unknown";
    const toastId = toast.loading("Creating your food order...");

    try {
      const formattedOrderItems = cart.items
        .filter((item) => item?.foodId?._id)
        .map((item) => ({
          food: item.foodId._id,
          qty: item.quantity,
          price: item.foodId.price || 0,
        }));

      const orderData = {
        userId: user.id,
        phone: shippingInfo.phone,
        orderItems: formattedOrderItems,
        shippingInfo,
        paymentMethod: selectedMethod,
        totalPrice,
      };

      const res = (await createOrder(
        orderData,
      ).unwrap()) as CreateOrderSuccessResponse;
      console.log(orderData, "orderdata");
      if (selectedPaymentMethodId === "COD") {
        toast.success("Order placed successfully! Fresh food is on the way.", {
          id: toastId,
        });
        await clearCart({});
        navigate("/my-order");
      } else {
        const paymentUrl = res?.data?.paymentSession?.payment_url;

        if (paymentUrl) {
          toast.success("Redirecting to payment gateway...", { id: toastId });
          setIsRedirecting(true);

          setTimeout(async () => {
            await clearCart({});
            window.location.href = paymentUrl;
          }, 800);
        } else {
          toast.error("Could not initiate payment gateway. Please try again.", {
            id: toastId,
          });
        }
      }
    } catch (error) {
      console.error("Failed to create order:", error);
      let errorMessage = "Failed to place order. Please try again.";

      if (
        typeof error === "object" &&
        error !== null &&
        "status" in error &&
        "data" in error
      ) {
        const rtkError = error as RtkError;
        if (typeof rtkError.data?.message === "string") {
          errorMessage = rtkError.data.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage, { id: toastId });
    }
  };

  if (isLoading) return <Loader />;

  if (!isRedirecting && !cart?.items?.length) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center bg-slate-50/50 p-4">
        <div className="text-center p-8 md:p-12 bg-white rounded-3xl shadow-xl border border-slate-100 max-w-md w-full animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-2">
            Your Cart is Empty
          </h2>
          <p className="text-slate-500 mb-8 text-sm leading-relaxed">
            Looks like you haven't added any delicious meals yet. Browse our
            menu to get started!
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-3.5 px-6 rounded-2xl hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-lg shadow-orange-500/25 active:scale-[0.98] flex items-center justify-center space-x-2"
          >
            <UtensilsCrossed className="w-5 h-5" />
            <span>Explore Menu</span>
          </button>
        </div>
      </div>
    );
  }

  const activePaymentObj = paymentOptions.find(
    (p) => p.id === selectedPaymentMethodId,
  );
  const isPhoneValid = validateBDPhone(shippingInfo.phone);

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 md:py-14 text-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <div className="mb-8 md:mb-10 text-center md:text-left flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200/60 pb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Checkout
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Complete your order details to receive fresh food at your
              doorstep.
            </p>
          </div>
          <div className="mt-4 md:mt-0 inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2 rounded-full text-xs font-semibold self-start md:self-auto">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>256-Bit SSL Encrypted & Secure</span>
          </div>
        </div>

        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Section */}
          <div className="lg:col-span-7 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Delivery Details Card */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8 transition-all hover:shadow-md">
                <div className="flex items-center space-x-3 border-b border-slate-100 pb-4 mb-6">
                  <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center font-bold">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Delivery Address
                    </h2>
                    <p className="text-xs text-slate-400">
                      Where should we deliver your order?
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">
                      Street Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleInputChange}
                      required
                      placeholder="House / Flat no., Road name, Area..."
                      className="w-full pl-4 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200"
                    />
                  </div>

                  {/* BD Phone Input Field */}
                  <div>
                    <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">
                      Contact Phone (BD){" "}
                      <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        name="phone"
                        value={shippingInfo.phone}
                        onChange={handleInputChange}
                        required
                        placeholder="017XXXXXXXX"
                        className={`w-full pl-4 pr-10 py-3 bg-slate-50/50 border rounded-2xl text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 transition-all duration-200 ${
                          phoneError
                            ? "border-rose-400 focus:ring-rose-500/20 focus:border-rose-500"
                            : isPhoneValid
                              ? "border-emerald-400 focus:ring-emerald-500/20 focus:border-emerald-500"
                              : "border-slate-200 focus:ring-orange-500/20 focus:border-orange-500"
                        }`}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        {isPhoneValid && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        )}
                        {phoneError && (
                          <AlertCircle className="w-5 h-5 text-rose-500" />
                        )}
                      </div>
                    </div>
                    {phoneError ? (
                      <p className="text-[11px] text-rose-500 font-semibold mt-1.5 flex items-center space-x-1">
                        <span>{phoneError}</span>
                      </p>
                    ) : (
                      <p className="text-[11px] text-slate-400 mt-1">
                        Example: 013, 014, 015, 016, 017, 018, 019
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">
                      City <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleInputChange}
                      required
                      placeholder="Dhaka, Barisal..."
                      className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">
                      Postal Code <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={shippingInfo.postalCode}
                      onChange={handleInputChange}
                      required
                      placeholder="1207"
                      className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">
                      Country <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={shippingInfo.country}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-2xl text-slate-600 text-sm font-medium cursor-not-allowed"
                      readOnly
                    />
                  </div>
                </div>
              </div>

              {/* Payment Methods Selection Card */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8 transition-all hover:shadow-md">
                <div className="flex items-center space-x-3 border-b border-slate-100 pb-4 mb-6">
                  <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center font-bold">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Payment Method
                    </h2>
                    <p className="text-xs text-slate-400">
                      Select how you want to pay
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {paymentOptions.map((option) => {
                    const isSelected = selectedPaymentMethodId === option.id;
                    return (
                      <div
                        key={option.id}
                        onClick={() => setSelectedPaymentMethodId(option.id)}
                        className={`relative cursor-pointer p-4 rounded-2xl border-2 transition-all duration-200 flex items-center justify-between ${
                          isSelected
                            ? "border-orange-500 bg-orange-50/30 ring-4 ring-orange-500/10 shadow-sm"
                            : "border-slate-100 hover:border-slate-200 bg-white"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`p-2.5 rounded-xl ${isSelected ? "bg-white shadow-xs" : "bg-slate-50"}`}
                          >
                            {option.icon}
                          </div>
                          <div>
                            <span className="block text-sm font-bold text-slate-900">
                              {option.name}
                            </span>
                            {option.badge && (
                              <span className="inline-block mt-0.5 px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-bold rounded-full">
                                {option.badge}
                              </span>
                            )}
                          </div>
                        </div>

                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            isSelected
                              ? "border-orange-500 bg-orange-500 text-white"
                              : "border-slate-300"
                          }`}
                        >
                          {isSelected && (
                            <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {activePaymentObj && (
                  <div className="bg-slate-50/80 border border-slate-200/60 rounded-2xl p-4 text-xs text-slate-600 flex items-start space-x-3">
                    <ShieldCheck className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      {activePaymentObj.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Submit Action Button */}
              <button
                type="submit"
                disabled={isOrderLoading || isRedirecting}
                className={`w-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white py-4 px-6 rounded-2xl font-black text-base shadow-lg shadow-orange-500/25 active:scale-[0.99] transition-all duration-300 flex items-center justify-center space-x-2 ${
                  isOrderLoading || isRedirecting
                    ? "opacity-60 cursor-not-allowed"
                    : ""
                }`}
              >
                {isOrderLoading || isRedirecting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Order...</span>
                  </div>
                ) : (
                  <>
                    <span>{activePaymentObj?.buttonText || "Place Order"}</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 sticky top-6">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                  <ShoppingBag className="w-5 h-5 text-orange-500" />
                  <span>Order Summary</span>
                </h2>
                <span className="bg-orange-100 text-orange-700 text-xs font-extrabold px-3 py-1 rounded-full">
                  {cart?.items?.length || 0} Items
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-4 max-h-[340px] overflow-y-auto pr-1">
                {cart?.items?.map((item, index) => {
                  const food = item?.foodId;
                  const price = food?.price || 0;
                  const quantity = item?.quantity || 1;

                  return (
                    <div
                      key={food?._id || index}
                      className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors duration-150"
                    >
                      <div className="flex items-center space-x-3.5">
                        <img
                          src={food?.image || "/placeholder.png"}
                          alt={food?.name || "Food Item"}
                          className="w-14 h-14 object-cover rounded-xl border border-slate-100 shadow-2xs"
                        />
                        <div>
                          <p className="font-bold text-slate-800 text-sm line-clamp-1">
                            {food?.name || "Item unavailable"}
                          </p>
                          <p className="text-xs text-slate-400 font-medium mt-0.5">
                            {food?.category && `${food.category} • `}Qty:{" "}
                            {quantity}
                          </p>
                        </div>
                      </div>
                      <p className="font-extrabold text-slate-900 text-sm">
                        ৳{(price * quantity).toFixed(2)}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Price Calculation */}
              <div className="border-t border-slate-100 pt-4 space-y-3">
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800">
                    ৳{totalPrice ? Number(totalPrice).toFixed(2) : "0.00"}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Delivery Fee</span>
                  <span className="text-emerald-600 font-semibold">FREE</span>
                </div>

                <div className="border-t border-dashed border-slate-200 pt-4 flex justify-between items-center">
                  <div>
                    <span className="block font-black text-slate-900 text-base">
                      Total Amount
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Inclusive of all taxes
                    </span>
                  </div>
                  <span className="text-2xl font-black text-orange-600 tracking-tight">
                    ৳{totalPrice ? Number(totalPrice).toFixed(2) : "0.00"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
