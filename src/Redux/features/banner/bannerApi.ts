
// ==========================================
// 1. Interfaces & Types Definition

import { baseApi } from "../../api/baseApi";

// ==========================================
export interface IBanner {
    _id?: string;
    title: string;
    description?: string;
    imageUrl: string;
    discountPercentage?: number;
    promoCode?: string;
    linkUrl?: string;
    isActive: boolean;
    startDate?: string;
    endDate?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface IBannerResponse {
    success: boolean;
    message: string;
    data: IBanner[];
}

export interface ISingleBannerResponse {
    success: boolean;
    message: string;
    data: IBanner;
}

export interface IUpdateBannerPayload {
    id: string;
    data: Partial<IBanner>;
}

// ==========================================
// 2. Inject Endpoints into baseApi (Full CRUD)
// ==========================================
export const bannerApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // CREATE: নতুন ব্যানার তৈরি করার জন্য
        createBanner: builder.mutation<ISingleBannerResponse, Partial<IBanner>>({
            query: (body) => ({
                url: '/banners/create',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Banner'],
        }),

        // READ (All): অ্যাডমিন প্যানেলে সব ব্যানার পাওয়ার জন্য
        getAllBanners: builder.query<IBannerResponse, void>({
            query: () => ({ url: '/banners' }),
            providesTags: ['Banner'],
        }),

        getActiveBanners: builder.query<IBannerResponse, void>({
            query: () => ({ url: '/banners/active' }),
            providesTags: ['Banner'],
        }),

        // UPDATE: ব্যানার আপডেট বা Active Status টগল করার জন্য
        updateBanner: builder.mutation<ISingleBannerResponse, IUpdateBannerPayload>({
            query: ({ id, data }) => ({
                url: `/banners/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Banner'],
        }),

        // DELETE: ব্যানার ডিলিট করার জন্য
        deleteBanner: builder.mutation<ISingleBannerResponse, string>({
            query: (id) => ({
                url: `/banners/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Banner'],
        }),
    }),
    overrideExisting: false,
});

// ==========================================
// 3. Export Auto-generated Hooks
// ==========================================
export const {
    useCreateBannerMutation,
    useGetAllBannersQuery,
    useGetActiveBannersQuery,
    useUpdateBannerMutation,
    useDeleteBannerMutation,
} = bannerApi;