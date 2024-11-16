import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  job: null,
  loading: false,
  error: null,
};

export const jobReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("createJobRequest", (state) => {
      state.loading = true;
    })
    .addCase("createJobSuccess", (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.message = action.payload.message;
    })
    .addCase("createJobFail", (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
    })
    .addCase("userHistoryRequest", (state) => {
      state.loading = true;
    })
    .addCase("userHistorySuccess", (state, action) => {
      state.loading = false;
      state.ongoingDeliveries = action.payload.ongoingDeliveries;
      state.pastDeliveries = action.payload.pastDeliveries;
      state.ongoingCount = action.payload.ongoingCount;
      state.pastDeliveriesCount = action.payload.pastDeliveriesCount;
    })
    .addCase("userHistoryFail", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    .addCase("driverHistoryRequest", (state) => {
      state.loading = true;
    })
    .addCase("driverHistorySuccess", (state, action) => {
      state.loading = false;
      state.ongoingDeliveries = action.payload.ongoingDeliveries;
      state.pastDeliveries = action.payload.pastDeliveries;
      state.ongoingCount = action.payload.ongoingCount;
      state.pastDeliveriesCount = action.payload.pastDeliveriesCount;
    })
    .addCase("driverHistoryFail", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    .addCase("uploadDetailsRequest", (state) => {
      state.loading = true;
    })
    .addCase("uploadDetailsSuccess", (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.message = action.payload.message;
      state.uploadedDocuments = action.payload.uploadedDocuments;
    })
    .addCase("uploadDetailsFail", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    .addCase("clearMessage", (state) => {
      state.message = "";
    })
    .addCase("clearError", (state) => {
      state.error = "";
    });
});
