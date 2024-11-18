import { createReducer } from "@reduxjs/toolkit";


const initialState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  message: null,
  error: null,
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

     // Location update actions
     .addCase('locationUpdateRequest', (state) => {
      state.loading = true;
    })
    .addCase('locationUpdateSuccess', (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      state.user.location = action.payload.location; // Update location in the state
    })
    .addCase('locationUpdateFail', (state, action) => {
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
