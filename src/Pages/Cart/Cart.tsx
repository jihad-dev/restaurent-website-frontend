/* eslint-disable @typescript-eslint/no-unused-vars */
import { Link } from "react-router-dom";
import {
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
} from "../../Redux/features/cart/cartApi";
import Loader from "../../utils/Loader";
import { toast } from "sonner";
import { useAppSelector } from "../../Redux/hooks";

export type IFood = {
  _id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  isAvailable?: boolean;
  rating?: number;
  isPopular?:boolean;
};

type CartItem = {
  _id?: string;
  foodId: IFood;
  quantity: number;
};

type CartType = {
  items: CartItem[];
};

const Cart = () => {
  const user = useAppSelector((state) => state.auth.user);
  const { data: cart, isLoading } = useGetCartQuery(undefined, {
    skip: !user,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  }) as { data: CartType | undefined; isLoading: boolean };

  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeFromCart] = useRemoveFromCartMutation();

  const cartItems = cart?.items;

  if (isLoading) {
    return <Loader />;
  }

  if (!cartItems?.length) {
    return (
      <div className="relative min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-slate-950 overflow-hidden mt-12">
        {/* Animated Glowing Background Orbs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl animate-pulse delay-1000" />

        {/* Main Card Container */}
        <div className="relative z-10 max-w-lg w-full p-8 sm:p-10 text-center bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl transition-all duration-500 hover:border-amber-500/30">
          <div className="mb-8 relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full blur-2xl opacity-20 animate-pulse" />
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto bg-slate-800/80 border border-slate-700/60 rounded-full flex items-center justify-center shadow-inner group">
              <svg
                className="w-14 h-14 sm:w-16 sm:h-16 text-amber-500 animate-bounce transition-transform duration-300 group-hover:scale-110"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.75"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black mb-3 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500">
            Your Cart is Empty!
          </h1>

          <p className="text-slate-400 text-base sm:text-lg mb-8 max-w-sm mx-auto leading-relaxed">
            Looks like you haven't added anything to your cart yet. Hungry for
            something delicious?
          </p>

          <Link
            to="/items"
            className="group relative inline-flex items-center justify-center px-8 py-4 text-base sm:text-lg font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 rounded-2xl shadow-lg shadow-amber-500/20 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 overflow-hidden"
          >
            <span className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
            <span className="relative z-10 flex items-center gap-2">
              Explore Menu
              <svg
                className="w-5 h-5 transform group-hover:translate-x-1.5 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    );
  }

  const handleQuantityChange = async (foodId: string, newQuantity: number) => {
    const toastId = toast.loading("Updating quantity...");
    try {
      await updateCartItem({ foodId, quantity: newQuantity }).unwrap();
      toast.success("Quantity updated", { id: toastId });
    } catch (error) {
      toast.error("Failed to update quantity", { id: toastId });
    }
  };

  const handleRemoveItem = async (foodId: string) => {
    const toastId = toast.loading("Removing item...");
    try {
      await removeFromCart({ foodId }).unwrap();
      toast.success("Item removed from cart", { id: toastId });
    } catch (error) {
      toast.error("Failed to remove item", { id: toastId });
    }
  };

  const subtotal = cartItems.reduce(
    (acc: number, item: CartItem) =>
      acc + (item?.foodId?.price || 0) * item?.quantity,
    0,
  );
// TODO : TAX RATE
  const shipping = 15.99;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;
console.log(total,'cart toal');

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden pt-24">
      {/* Background Glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-32 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <h1 className="text-3xl sm:text-4xl font-black mb-8 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500">
          Your Food Cart
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items List */}
          <div className="lg:w-2/3 space-y-4">
            {cartItems.map((item: CartItem, index: number) => {
              const food = item?.foodId;
              const itemTotal = (food?.price || 0) * item?.quantity;

              return (
                <div
                  key={food?._id || index}
                  className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl transition-all duration-300 hover:border-slate-700/80 group"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                    <img
                      src={food?.image}
                      alt={food?.name}
                      className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl border border-slate-800/80 shadow-md group-hover:scale-105 transition-transform duration-300"
                    />

                    <div className="flex-1 w-full">
                      <div className="flex justify-between items-start">
                        <h2 className="text-lg sm:text-xl font-bold text-slate-100 group-hover:text-amber-400 transition-colors">
                          {food?.name}
                        </h2>
                        <button
                          className="text-slate-500 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-slate-800/60"
                          onClick={() => handleRemoveItem(food?._id)}
                          title="Remove item"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>

                      <p className="text-slate-400 text-xs sm:text-sm mt-1 line-clamp-2">
                        {food?.description}
                      </p>

                      <div className="flex items-center justify-between mt-5 pt-3 border-t border-slate-800/60">
                        {/* Quantity Controls */}
                        <div className="flex items-center bg-slate-950/60 border border-slate-800 rounded-xl p-1">
                          <button
                            className={`w-8 h-8 flex items-center justify-center rounded-lg text-slate-300 hover:bg-slate-800 transition-colors ${
                              item?.quantity <= 1
                                ? "cursor-not-allowed opacity-40"
                                : "cursor-pointer hover:text-amber-400"
                            }`}
                            onClick={() => {
                              if (item?.quantity > 1) {
                                handleQuantityChange(
                                  food?._id,
                                  item?.quantity - 1,
                                );
                              }
                            }}
                            disabled={item?.quantity <= 1}
                          >
                            -
                          </button>

                          <span className="w-10 text-center font-semibold text-amber-400 text-sm">
                            {item?.quantity}
                          </span>

                          <button
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-300 hover:bg-slate-800 hover:text-amber-400 transition-colors cursor-pointer"
                            onClick={() =>
                              handleQuantityChange(
                                food?._id,
                                item?.quantity + 1,
                              )
                            }
                          >
                            +
                          </button>
                        </div>

                        {/* Price Display */}
                        <div className="text-right">
                          <span className="text-xs text-slate-500 block sm:inline mr-1">
                            Total:
                          </span>
                          <span className="font-extrabold text-lg text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                            ৳{itemTotal.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary Section */}
          <div className="lg:w-1/3">
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl sticky top-28">
              <h2 className="text-xl font-bold mb-6 text-slate-100 flex items-center gap-2">
                Order Summary
              </h2>

              <div className="space-y-4 text-sm text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Subtotal</span>
                  <span className="font-semibold text-slate-200">
                    ৳{subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Delivery Fee</span>
                  <span className="font-semibold text-slate-200">
                    ৳{shipping.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Tax (10%)</span>
                  <span className="font-semibold text-slate-200">
                    ৳{tax.toFixed(2)}
                  </span>
                </div>

                <div className="border-t border-slate-800 pt-4 mt-4">
                  <div className="flex justify-between items-center text-base sm:text-lg font-bold">
                    <span className="text-slate-100">Total Amount</span>
                    <span className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500">
                      ৳{total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <Link to="/order" state={{ totalPrice: total.toFixed(2) }}>
                <button className="w-full mt-8 group relative inline-flex items-center justify-center px-6 py-4 text-base font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 rounded-2xl shadow-lg shadow-amber-500/20 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 overflow-hidden cursor-pointer">
                  <span className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Proceed to Checkout
                    <svg
                      className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
