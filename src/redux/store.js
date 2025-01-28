import { configureStore } from "@reduxjs/toolkit";
import runsReducer from "./runsSlice";

export const store = configureStore({
  reducer: {
    runs: runsReducer,
  },
});
