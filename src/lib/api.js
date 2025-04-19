import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAuth } from "@clerk/clerk-react";

export const Api = createApi({
  reducerPath: "Api",
  baseQuery: fetchBaseQuery({ 
    baseUrl: "https://fed-storefront-backend-dinithi.onrender.com/api/",
    prepareHeaders: async (headers, { getState }) => {
      try {
        const token = await getAuth().getToken();
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
  useCreateOrderMutation,
  useGetOrderQuery,
  useGetOrdersByUserIdQuery,
} = Api;