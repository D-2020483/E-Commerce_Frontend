import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const Api = createApi({
  reducerPath: "Api",
  baseQuery: fetchBaseQuery({ 
    baseUrl: "https://fed-storefront-backend-dinithi.onrender.com/api/",
    prepareHeaders: async (headers, { getState }) => {
      // Wait a bit to ensure token is available
      const waitForToken = async () => {
        let token = localStorage.getItem('clerk-token');
        let attempts = 0;
        while (!token && attempts < 3) {
          await new Promise(resolve => setTimeout(resolve, 500));
          token = localStorage.getItem('clerk-token');
          attempts++;
        }
        return token;
      };

      try {
        const token = await waitForToken();
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
      // Add retry logic for auth errors
      extraOptions: {
        maxRetries: 3,
        retryCondition: (error) => error.status === 401
      }
    }),
    createOrder: builder.mutation({
      query: (body) => ({
        url: `orders`,
        method: "POST",
        body,
      }),
    }),
    updateOrder: builder.mutation({
      query: ({ orderId, type }) => ({
        url: `payments/webhook`,
        method: "POST",
        body: {
          type,
          data: { orderId }
        }
      }),
      // Invalidate relevant queries after mutation
      invalidatesTags: (result, error, { orderId }) => [
        { type: 'Order', id: orderId },
        'Orders'
      ]
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetProductsQuery,
  useGetCategoriesQuery,
  useGetProductQuery,
  useCreateOrderMutation,
  useGetOrderQuery,
  useGetOrdersByUserIdQuery,
  useUpdateOrderMutation,
} = Api;