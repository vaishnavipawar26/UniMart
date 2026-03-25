import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import ownerSlice from "./ownerSlice";
import itemSlice from "./itemSlice";  // ✅ import this

export const store = configureStore({
  reducer: {
    user: userSlice,
    owner:ownerSlice,
    items:itemSlice,
  },
});
