/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../api/baseApi";

const itemsApi = baseApi.injectEndpoints({
  endpoints: (builder: any) => ({
    // Get Featured Dishes
    getPopularFoods: builder.query({
      query: () => ({
        url: "/foods?isPopular=true",
        method: "GET",
      }),
      providesTags: ["foods"],
      transformResponse: (response: any) => response?.data?.result || response?.data,
    }),

    // Add New Dish / Food Item
    addFoodItem: builder.mutation({
      query: (data: any) => ({
        url: "/foods/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["foods"],
    }),

    // Fetch All Menu Items
    getAllFoodItems: builder.query({
      query: () => ({
        url: "/foods",
        method: "GET",
      }),
      providesTags: ["foods"],
      transformResponse: (response: any) => response?.data,
    }),

    // Fetch Single Dish by ID
    getFoodById: builder.query({
      query: (id: string) => ({
        url: `/foods/${id}`,
        method: "GET",
      }),
      providesTags: ["foods"],
      // response.data থাকলে সেটা নিবে, না থাকলে পুরো response-ই রিটার্ন করবে
      transformResponse: (response: any) => response?.data,
    }),
    // Delete Dish
    deleteFoodItem: builder.mutation({
      query: (id: string) => ({
        url: `/foods/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["foods"],
    }),

    // Filter Dishes by Category
    getFoodsByCategory: builder.query({
      query: (category: string) => ({
        url: `/foods?category=${encodeURIComponent(category)}`,
        method: "GET",
      }),
      providesTags: ["foods"],
      transformResponse: (response: any) => response?.data,
    }),
    // REVIEW API 
    getSingleReview: builder.query({
      query: ({ orderId, foodId, userId }: { orderId: string; foodId: string; userId: string }) => ({
        url: `/reviews/single?orderId=${orderId}&foodId=${foodId}&userId=${userId}`,
        method: "GET",
      }),
      providesTags: ["reviews"],
    }),

    addReview: builder.mutation({
      query: (data: any) => ({
        url: "/reviews/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["reviews"],
    }),
    getAllReviews: builder.query({
      query: () => ({
        url: "/reviews",
        method: "GET",
      }),
      providesTags: ["reviews"],
      transformResponse: (response: any) => response?.data,
    }),
    updateReview: builder.mutation({
      query: (data: any) => ({
        url: "/reviews/update",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["reviews"],
    }),
  }),
});

export const {
  useAddFoodItemMutation,
  useGetFoodByIdQuery,
  useGetPopularFoodsQuery,
  useGetAllFoodItemsQuery,
  useGetFoodsByCategoryQuery,
  useDeleteFoodItemMutation,
  useAddReviewMutation,
  useUpdateReviewMutation,
  useGetSingleReviewQuery,
  useGetAllReviewsQuery
} = itemsApi;