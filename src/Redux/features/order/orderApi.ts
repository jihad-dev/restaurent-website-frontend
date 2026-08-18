/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../api/baseApi";

// --- Types ---
export interface OrderItem {
  food: {
    _id: string;
    name: string;
    category: string;
    price: number;
    description: string;
    image: string;
    isAvailable: boolean;
    rating: number;
    createdAt: string;
    updatedAt: string;
  };
  qty: number;
  price: number;
}

export interface ShippingInfo {
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface Order {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  phone: string;
  orderItems: OrderItem[];
  shippingInfo: ShippingInfo;
  paymentMethod: string;
  paymentStatus: string;
  totalPrice: number;
  status: string;
  transactionId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export interface IOrderQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  searchTerm?: string;
  [key: string]: any;
}

// --- API Slice ---
const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create order
    createOrder: builder.mutation<ApiResponse<Order>, Partial<Order>>({
      query: (data) => ({
        url: "/orders/create-order",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["orders"],
    }),

    // Get all orders (Updated generic argument type)
    // Get all orders
    getAllOrders: builder.query<ApiResponse<Order[]> | any, IOrderQueryParams | void>({
      query: (params) => {
        // Return params only if defined to avoid passing 'void' to FetchArgs
        return {
          url: "/orders",
          method: "GET",
          ...(params ? { params } : {}),
        };
      },
      providesTags: ["orders"],
    }),

    // Get user orders
    getUserOrders: builder.query<ApiResponse<Order[]>, string>({
      query: (id) => ({
        url: `/orders/user/${id}`,
        method: "GET",
      }),
      providesTags: ["orders"],
    }),

    // Get order by ID
    getOrderById: builder.query<ApiResponse<Order>, string>({
      query: (id) => ({
        url: `/orders/${id}`,
        method: "GET",
      }),
      providesTags: ["orders"],
    }),

    // Update order status
    updateOrderStatus: builder.mutation<ApiResponse<Order>, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/orders/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["orders"],
    }),

    // Delete order
    deleteOrder: builder.mutation<ApiResponse<unknown>, string>({
      query: (id) => ({
        url: `/orders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["orders"],
    }),

    // --- Notification Endpoints ---
    getNotifications: builder.query<ApiResponse<any[]>, void>({
      query: () => ({
        url: "/notifications",
        method: "GET",
      }),
      providesTags: ["notifications"],
    }),

    markNotificationAsRead: builder.mutation<ApiResponse<unknown>, string>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["notifications"],
    }),

    markAllNotificationsAsRead: builder.mutation<ApiResponse<unknown>, void>({
      query: () => ({
        url: "/notifications/read-all",
        method: "PATCH",
      }),
      invalidatesTags: ["notifications"],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
  useGetUserOrdersQuery,
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} = orderApi;