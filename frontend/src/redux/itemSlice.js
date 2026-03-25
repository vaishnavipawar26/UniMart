
import { createSlice } from "@reduxjs/toolkit";

const itemSlice = createSlice({
  name: "items",
  initialState: {
    canteenItems: [],
    stationeryItems: [],
    itemsByShopType: [],
  },
  reducers: {

    setCanteenItems: (state, action) => {
      state.canteenItems = action.payload;
    },
    setStationeryItems: (state, action) => {
      state.stationeryItems = action.payload;
    },
  },
});

export const { setCanteenItems, setStationeryItems } = itemSlice.actions;
export default itemSlice.reducer;
