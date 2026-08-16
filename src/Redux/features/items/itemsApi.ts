/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../api/baseApi";

const itemsApi = baseApi.injectEndpoints({
  endpoints: (builder: any) => ({
    // Get Featured Dishes
    getFeaturedFoods: builder.query({
      query: () => ({
        url: "/foods?isFeatured=true",
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
  }),
});

export const {
  useAddFoodItemMutation,
  useGetFoodByIdQuery,
  useGetFeaturedFoodsQuery,
  useGetAllFoodItemsQuery,
  useGetFoodsByCategoryQuery,
  useDeleteFoodItemMutation,
} = itemsApi;