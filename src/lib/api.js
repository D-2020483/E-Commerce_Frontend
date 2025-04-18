import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const Api = createApi({
  reducerPath: "Api",
  baseQuery: fetchBaseQuery({ 
    baseUrl: "https://fed-storefront-backend-dinithi.onrender.com/api/" }),
    prepareHeaders: async (headers, { getState }) => {
    const token = await window.Clerk?.Session?.getToken();
    console.log(token);

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
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