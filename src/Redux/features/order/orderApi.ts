/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../api/baseApi";

const orderApi = baseApi.injectEndpoints({
    endpoints: (builder: any) => ({
        // Create order
        createOrder: builder.mutation({
            query: (data: any) => ({
                url: "/orders/create-order",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["orders"],
        }),

        // Get all orders
        getAllOrders: builder.query({
            query: () => ({
                url: "/orders",
                method: "GET",
            }),
            providesTags: ["orders"],
        }),

        // Get user orders
        getUserOrders: builder.query({
            query: (id: string) => ({
                url: `/orders/user/${id}`,
                method: "GET",
            }),
            providesTags: ["orders"],
        }),

        // Get order by ID
        getOrderById: builder.query({
            query: (id: string) => ({
                url: `/orders/${id}`,
                method: "GET",
            }),
            providesTags: ["orders"],
        }),

        // Update order status
        updateOrderStatus: builder.mutation({
            query: ({ id, status }: { id: string; status: string }) => ({
                url: `/orders/${id}`,
                method: "PATCH",
                body: { status },
            }),
            invalidatesTags: ["orders"],
        }),

        // Delete order
        deleteOrder: builder.mutation({
            query: (id: string) => ({
                url: `/orders/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["orders"],
        }),

        // --- Notification Endpoints ---
        getNotifications: builder.query({
            query: () => ({
                url: "/notifications",
                method: "GET",
            }),
            providesTags: ["notifications"],
        }),

        markNotificationAsRead: builder.mutation({
            query: (id: string) => ({
                url: `/notifications/${id}/read`,
                method: "PATCH",
            }),
            invalidatesTags: ["notifications"],
        }),

        markAllNotificationsAsRead: builder.mutation({
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