import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
    jobs: [],
    error: null,
    message: null,
    hasActiveJob: false,
    acceptedFare: null,
    currentBlockedAmount: 0,
    totalBlockedAmount: 0,
    blockedPayments: [],
    currentDriverLocation: null,
    locationUpdateSuccess: false,
    trackingData: null,
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

    .addCase('getJobsRequest', (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase('getJobsSuccess', (state, action) => {
      state.loading = false;
      state.jobs = action.payload.availableJobs;
      state.hasActiveJob = action.payload.hasActiveJob;
      state.error = null;
    })
    .addCase('getJobsFail', (state, action) => {
      state.loading = false;
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
      state.error = null;
    })
    .addCase('acceptJobSuccess', (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      if (!state.jobs) {
        state.jobs = [];
      }
      // Update jobs array and set hasActiveJob
      state.jobs = [...state.jobs, action.payload];
      state.hasActiveJob = true;
    })
    .addCase('acceptJobFail', (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    .addCase('getSubmittedFaresRequest', (state) => {
      state.loading = true;
    })
    .addCase('getSubmittedFaresSuccess', (state, action) => {
      state.loading = false;
      state.submittedFares = action.payload.submittedFares;
      state.jobDetails = action.payload.jobDetails;
      state.totalSubmissions = action.payload.totalSubmissions;
    })
    .addCase('getSubmittedFaresFail', (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    .addCase("acceptFareRequest", (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase("acceptFareSuccess", (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      state.acceptedFare = action.payload.acceptedFare;
      state.currentBlockedAmount = action.payload.currentBlockedAmount;
      state.totalBlockedAmount = action.payload.totalBlockedAmount;
      state.blockedPayments = action.payload.blockedPayments;
      state.hasActiveJob = true; 
    })
    .addCase("acceptFareFail", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    .addCase("getJobTrackingRequest", (state) => {
      state.loading = true;
    })
    .addCase("getJobTrackingSuccess", (state, action) => {
      state.loading = false;
      state.trackingData = action.payload.tracking;
      state.error = null;
    })
    .addCase("getJobTrackingFail", (state, action) => {
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
