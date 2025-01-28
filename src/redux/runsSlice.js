import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  runs: JSON.parse(localStorage.getItem("runs")) || [], // Load runs from localStorage if user is not logged in
};

const runsSlice = createSlice({
  name: "runs",
  initialState,
  reducers: {
    setRuns: (state, action) => {
      state.runs = action.payload;
      localStorage.setItem("runs", JSON.stringify(state.runs)); // Save runs locally for guest users
    },
    addRun: (state, action) => {
      state.runs.push(action.payload);
      localStorage.setItem("runs", JSON.stringify(state.runs)); // Save new run locally
    },
    updateRun: (state, action) => {
      const { id, data } = action.payload;
      const index = state.runs.findIndex((run) => run.id === id);
      if (index >= 0) {
        state.runs[index] = { id, ...data };
        localStorage.setItem("runs", JSON.stringify(state.runs)); // Save updated runs locally
      }
    },
    clearLocalRuns: (state) => {
      state.runs = [];
      localStorage.removeItem("runs"); // Clear local runs when syncing to Firebase
    },
  },
});

export const { setRuns, addRun, updateRun, clearLocalRuns } = runsSlice.actions;

export default runsSlice.reducer;
