import { createReducer } from "@reduxjs/toolkit";


const initialState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  message: null,
  error: null,
  currentDriverLocation: null,
  locationUpdateSuccess: false,
  trackingData: null,
  callInitiating: false,
  callEnding: false,
  callActive: false,
  callError: null,
  callSid: null,
};

export const userReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("registerRequest", (state) => {
      state.loading = true;
    })
    .addCase("registerSuccess", (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = action.payload.user;
      state.message = action.payload.message;
    })
    .addCase("registerFail", (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
    })
    .addCase("loginRequest", (state) => {
      state.loading = true;
    })
    .addCase("loginSuccess", (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.message = action.payload.message;
    })
    .addCase("loginFail", (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
    })
    .addCase("logoutRequest", (state) => {
      state.loading = true;
    })
    .addCase("logoutSuccess", (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.message = action.payload;
    })
    .addCase("logoutFail", (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.error = action.payload;
    })
    .addCase("forgotPasswordRequest", (state) => {
      state.loading = true;
    })
    .addCase("forgotPasswordSuccess", (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
    })
    .addCase("forgotPasswordFail", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    
    .addCase("resetPasswordRequest", (state) => {
      state.loading = true;
    })
    .addCase("resetPasswordSuccess", (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
    })
    .addCase("resetPasswordFail", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase("verifyRequest", (state) => {
      state.loading = true;
    })
    .addCase("verifySuccess", (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.message = action.payload.message;
    })
    .addCase("verifyFail", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase("resendRequest", (state) => {
      state.loading = true;
    })
    .addCase("resendSuccess", (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
    })
    .addCase("resendFail", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase("loadUserRequest", (state) => {
      state.loading = true;
    })
    .addCase("loadUserSuccess", (state, action) => {
      state.loading = false;
      state.isAuthenticated = true; 
      state.user = action.payload;
    })
    .addCase("loadUserFail", (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
    })
    
    .addCase("updateProfileRequest", (state) => {
      state.loading = true;
    })
    .addCase("updateProfileSuccess", (state, action) => {
      state.loading = false;
      state.isAuthenticated = true; 
      state.user = action.payload;
    })
    .addCase("updateProfileFail", (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
    })
    
    .addCase("updateLocationRequest", (state) => {
      state.loading = true;
      state.locationUpdateSuccess = false;
      state.error = null;
    })
    .addCase("updateLocationSuccess", (state, action) => {
      state.loading = false;
      state.locationUpdateSuccess = true;
      state.error = null;
      if (action.payload.location) {
        if (state.user) {
          state.user.location = {
            type: "Point",
            coordinates: action.payload.location
          };
        }
      }
      state.message = action.payload.message;
    })
    .addCase("updateLocationFail", (state, action) => {
      state.loading = false;
      state.locationUpdateSuccess = false;
      state.error = action.payload;
    })
    .addCase("UPDATE_LOCATION_VIA_SOCKET", (state, action) => {
      if (action.payload.coordinates) {
        if (state.user && state.user.role === 'driver') {
          state.user.location = {
            type: "Point",
            coordinates: action.payload.coordinates
          };
        }
        state.trackingData = {
          jobId: action.payload.jobId,
          status: action.payload.status,
          isAtPickup: action.payload.isAtPickup,
          isAtDestination: action.payload.isAtDestination,
          timestamp: action.payload.timestamp,
          driverDetails: action.payload.driverDetails,
          coordinates: action.payload.coordinates
        };
      }
    })
    .addCase("initiateCallRequest", (state) => {
      state.callInitiating = true;
      state.callError = null;
    })
    .addCase("initiateCallSuccess", (state, action) => {
      state.callInitiating = false;
      state.callActive = true;
      state.callSid = action.payload.callSid;
      state.message = action.payload.message;
    })
    .addCase("initiateCallFail", (state, action) => {
      state.callInitiating = false;
      state.callActive = false;
      state.callError = action.payload;
    })
    .addCase("endCallRequest", (state) => {
      state.callEnding = true;
      state.callError = null;
    })
    .addCase("endCallSuccess", (state, action) => {
      state.callEnding = false;
      state.callActive = false;
      state.callSid = null;
      state.message = action.payload.message;
    })
    .addCase("endCallFail", (state, action) => {
      state.callEnding = false;
      state.callError = action.payload;
    })
    .addCase("clearMessage", (state) => {
      state.message = "";
    })
    .addCase("clearError", (state) => {
      state.error = "";
    });
});
