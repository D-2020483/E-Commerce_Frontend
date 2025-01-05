import { createSlice } from "@reduxjs/toolkit";

const savedItemsSlice = createSlice({
  name: "savedItems",
  initialState: [],
  reducers: {
    toggleSave: (state, action) => {
      const itemId = action.payload;
      if (state.includes(itemId)) {
        return state.filter((id) => id !== itemId);
      } else {
        return [...state, itemId];
      }
    },
  },
});

export const { toggleSave } = savedItemsSlice.actions;
export default savedItemsSlice.reducer;
