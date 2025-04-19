import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const variantName = product.variantName || 'default';

      // Find existing item in cart
      const foundItem = state.value.find(
        (item) => item.product._id === product._id
      );

      if (foundItem) {
        // Get the variant to check stock
        const variant = product.variants?.find(v => v.name === variantName);
        if (variant && variant.stock > foundItem.quantity) {
          foundItem.quantity += 1;
        }
      } else {
        // Add new item
        state.value.push({ 
          product: action.payload, 
          quantity: 1,
          variantName
        });
      }
    },
    clearCart: (state) => {
      state.value = [];
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.value.find(
        (item) => item.product._id === productId
      );
      if (item) {
        item.quantity = quantity;
      }
    },
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.value = state.value.filter(item => item.product._id !== productId);
    }
  },
});

// Action creators are generated for each case reducer function
export const { addToCart, clearCart, updateQuantity, removeFromCart } = cartSlice.actions;

export default cartSlice.reducer;