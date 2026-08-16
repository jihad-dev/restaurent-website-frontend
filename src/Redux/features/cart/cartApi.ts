/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../api/baseApi";

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder: any) => ({
    getCart: builder.query({
      query: () => ({
        url: "/cart",
        method: "GET",
      }),
      providesTags: ["cart"],
      transformResponse: (response: any) => {
        return response?.data;
      },
    }),
    addToCart: builder.mutation({
      query: (data: { foodId: string; quantity: number }) => ({
        url: "/cart/add-to-cart",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["cart"],
    }),
    updateCartItem: builder.mutation({
      query: ({ foodId, quantity }: { foodId: string; quantity: number }) => ({
        url: `/cart/update-cart`,
        method: "PUT",
        body: { foodId, quantity },
      }),
      invalidatesTags: ["cart"],
    }),
    removeFromCart: builder.mutation({
      query: ({ foodId }: { foodId: string }) => ({
        url: `/cart/remove-from-cart/${foodId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["cart"],
    }),
    clearCart: builder.mutation({
      query: () => ({
        url: `/cart/clear-cart`,
        method: "DELETE",
      }),
      invalidatesTags: ["cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
} = cartApi;