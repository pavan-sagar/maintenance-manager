import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { combineReducers } from "redux";

import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import authenticateReducer from "./slices/authenticateSlice";

const rootConfig = {
  key: "root",
  storage: storage,
  blacklist: [""],
  transforms: null,
};

const rootReducer = combineReducers({
  authenticate: authenticateReducer,
})

const persistedReducer = persistReducer(rootConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
});
