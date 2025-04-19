import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const Api = createApi({
  reducerPath: "Api",
  baseQuery: fetchBaseQuery({ 
    baseUrl: "https://fed-storefront-backend-dinithi.onrender.com/api/",
    prepareHeaders: async (headers, { getState }) => {
      try {
        // The token will be passed through the component
        const token = localStorage.getItem('clerk-token');
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
      } catch (error) {
        console.error('Error setting auth header:', error);
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
    getProduct: builder.query({
      query: (id) => `products/${id}`,
    }),
    getOrder: builder.query({
      query: (id) => `orders/${id}`,
    }),
    getOrdersByUserId: builder.query({
      query: () => `orders/user/my-orders`,
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
  useGetProductQuery,
  useCreateOrderMutation,
  useGetOrderQuery,
  useGetOrdersByUserIdQuery,
} = Api;