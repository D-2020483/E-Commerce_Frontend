import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const Api = createApi({
  reducerPath: "Api",
  baseQuery: fetchBaseQuery({ 
    baseUrl: "https://fed-storefront-backend-dinithi.onrender.com/api/",
    prepareHeaders: async (headers) => {
      try {
        // Get token directly from Clerk session
        const token = await window.Clerk?.session?.getToken();
        console.log("Auth token present:", !!token);
        
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        } else {
          console.warn("No auth token available");
        }
        return headers;
      } catch (error) {
        console.error('Error getting auth token:', error);
        return headers;
      }
    },
  }),
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => `products`,
    }),
    getCategories: builder.query({
      query: () => `categories`,
    }),
    getOrder: builder.query({
      query: (id) => `orders/${id}`,
    }),
    getOrdersByUserId: builder.query({
      query: () => ({
        url: `orders/user/my-orders`,
        method: 'GET',
      }),
    }),
    createOrder: builder.mutation({
      query: (body) => ({
        url: `orders`,
        method: "POST",
        body,
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetProductsQuery,
  useGetCategoriesQuery,
  useCreateOrderMutation,
  useGetOrderQuery,
  useGetOrdersByUserIdQuery,
} = Api;