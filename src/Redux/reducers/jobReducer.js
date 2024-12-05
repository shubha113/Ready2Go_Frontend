import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  users: [],
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
  totalUsers: 0,
  totalPages: 1,
  currentPage: 1,
  documentVerificationLoading: false,
  documentVerificationError: null
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
      state.error = null;
    })
    .addCase("getJobsSuccess", (state, action) => {
      state.loading = false;
      state.jobs = action.payload.availableJobs;
      state.hasActiveJob = action.payload.hasActiveJob;
      state.error = null;
    })
    .addCase("getJobsFail", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    .addCase("cancelJobRequest", (state) => {
      state.loading = true;
      state.isAuthenticated = false;
    })
    .addCase("cancelJobSuccess", (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.message = action.payload.message;
      state.jobs = state.jobs.filter((job) => job._id !== action.payload.jobId);
    })
    .addCase("cancelJobFail", (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
    })

    .addCase("acceptJobRequest", (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase("acceptJobSuccess", (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      if (!state.jobs) {
        state.jobs = [];
      }
      // Update jobs array and set hasActiveJob
      state.jobs = [...state.jobs, action.payload];
      state.hasActiveJob = true;
    })
    .addCase("acceptJobFail", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    .addCase("getSubmittedFaresRequest", (state) => {
      state.loading = true;
    })
    .addCase("getSubmittedFaresSuccess", (state, action) => {
      state.loading = false;
      state.submittedFares = action.payload.submittedFares;
      state.jobDetails = action.payload.jobDetails;
      state.totalSubmissions = action.payload.totalSubmissions;
    })
    .addCase("getSubmittedFaresFail", (state, action) => {
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

    .addCase("updateDriverPickupRequest", (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase("updateDriverPickupSuccess", (state, action) => {
      state.loading = false;
      // Update the specific job in ongoingDeliveries
      if (state.ongoingDeliveries) {
        const index = state.ongoingDeliveries.findIndex(
          (job) => job._id === action.payload.job._id
        );
        if (index !== -1) {
          state.ongoingDeliveries[index] = action.payload.job;
        }
      }
      state.message = action.payload.message;
      state.error = null;
    })
    .addCase("updateDriverPickupFail", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    // Add these cases to your existing builder
    .addCase("updateDriverCompleteDeliveryRequest", (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase("updateDriverCompleteDeliverySuccess", (state, action) => {
      state.loading = false;
      // Update the specific job in ongoingDeliveries
      if (state.ongoingDeliveries) {
        const index = state.ongoingDeliveries.findIndex(
          (job) => job._id === action.payload.job._id
        );
        if (index !== -1) {
          state.ongoingDeliveries[index] = action.payload.job;
        }
      }
      state.message = action.payload.message;
      state.error = null;
    })
    .addCase("updateDriverCompleteDeliveryFail", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    .addCase("rateJobRequest", (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase("rateJobSuccess", (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      state.error = null;
    })
    .addCase("rateJobFail", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    .addCase('getAllUsersRequest', (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase('getAllUsersSuccess', (state, action) => {
      state.loading = false;
      state.users = action.payload.users;
      state.totalUsers = action.payload.totalUsers;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
      state.error = null;
    })
    .addCase('getAllUsersFail', (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.users = [];
    })

    .addCase('verifyDocumentRequest', (state) => {
      state.documentVerificationLoading = true;
      state.documentVerificationError = null;
    })
    .addCase('verifyDocumentSuccess', (state, action) => {
      state.documentVerificationLoading = false;
      
      // Update the specific user in the users array
      const userIndex = state.users.findIndex(user => user._id === action.payload.userId);
      
      if (userIndex !== -1) {
        // Create a new user object with updated verification status
        const updatedUser = {
          ...state.users[userIndex],
          verificationStatus: {
            ...state.users[userIndex].verificationStatus,
            [action.payload.documentType]: action.payload.status
          },
          isVerified: action.payload.user.isVerified,
          overallVerificationStatus: action.payload.user.overallVerificationStatus
        };
  
        // Create a new users array with the updated user
        state.users = [
          ...state.users.slice(0, userIndex),
          updatedUser,
          ...state.users.slice(userIndex + 1)
        ];
      }
  
      state.documentVerificationError = null;
      state.message = `Document ${action.payload.documentType} ${action.payload.status}`;
    })
    .addCase('verifyDocumentFail', (state, action) => {
      state.documentVerificationLoading = false;
      state.documentVerificationError = action.payload;
    })

    .addCase("clearMessage", (state) => {
      state.message = "";
    })
    .addCase("clearError", (state) => {
      state.error = "";
    });
});
