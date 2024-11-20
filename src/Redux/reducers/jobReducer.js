import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: null,
  message: null,
  jobs: [],
  ongoingDeliveries: [],
  pastDeliveries: [],
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

    
    .addCase("getJobsRequest", (state) => {
      state.loading = true;
      state.jobs = []; 
    })
    .addCase("getJobsSuccess", (state, action) => {
      state.loading = false;
      state.jobs = action.payload.availableJobs;
      state.message = action.payload.message || null; 
      state.error = null;
    })
    .addCase("getJobsFail", (state, action) => {
      state.loading = false;
      state.jobs = []; 
      state.error = action.payload;
    })   

    .addCase("cancelJobRequest", (state) => {
      state.loading = true;
      state.isAuthenticated = false
    })
    .addCase("cancelJobSuccess", (state, action) => {
      state.loading = false;
      state.isAuthenticated = true
      state.message = action.payload.message;
      state.jobs = state.jobs.filter((job) => job._id !== action.payload.jobId);
    })
    .addCase("cancelJobFail", (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
    })

    .addCase('acceptJobRequest', (state) => {
      state.loading = true;
    })
    .addCase('acceptJobSuccess', (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      const jobIndex = state.jobs.findIndex(
        (job) => job._id === action.payload.fareSubmission.jobId
      );
      if (jobIndex !== -1) {
        state.jobs[jobIndex].submittedFares = [
          ...(state.jobs[jobIndex].submittedFares || []),
          action.payload.fareSubmission,
        ];
      }
    })
    .addCase('acceptJobFail', (state, action) => {
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
