import { configureStore } from "@reduxjs/toolkit";
import authenticateReducer from "./slices/authenticateSlice";

export const store = configureStore({
  reducer: {
    authenticate: authenticateReducer,
  },
});
