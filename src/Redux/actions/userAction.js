import axios from 'axios';
import { server } from '../store';

export const register = formData => async dispatch => {
  
  try {

    dispatch({ type: 'registerRequest' });

    const { data } = await axios.post(`${server}/user/register`, formData, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    dispatch({ type: 'registerSuccess', payload: data });

  } catch (error) {
    dispatch({ type: 'registerFail', payload: error.response.data.message });
  }
};


export const login = formData => async dispatch => {
  try {
    dispatch({type: "loginRequest"});
    
    const {data} = await axios.post(`${server}/user/login`, formData, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    dispatch({type: 'loginSuccess', payload: data})
  } catch (error) {
    dispatch({type: 'loginFail', payload: error.response.data.message})
  }
}

export const logout = () => async dispatch => {
  try {
     dispatch({ type: "logoutRequest" });
     
     const { data } = await axios.get(`${server}/user/logout`, {
        withCredentials: true,
     });

     dispatch({ type: "logoutSuccess", payload: data.message });

  } catch (error) {
     dispatch({ type: "logoutFail", payload: error.response.data.message });
  }
};



export const forgotPassword = formData => async dispatch =>{
  try {
    dispatch({type: 'forgotPasswordRequest'});

    const requestData = {
      phoneNumber: Number(formData.phoneNumber),
    };

    const { data } = await axios.post(`${server}/user/forgot-password`, requestData, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    dispatch({type: "forgotPasswordSuccess", payload: data})
    
  } catch (error) {
    dispatch({type: 'forgotPasswordFail', payload: error.response.data.message})
  }
}

export const resetPassword = (formData) => async (dispatch) => {
  try {
    dispatch({ type: "resetPasswordRequest" });

    const requestData = {
      password: formData.password,
      phoneNumber: formData.phoneNumber,
    };

    const { data } = await axios.post(`${server}/user/reset-password`, requestData, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    dispatch({ type: "resetPasswordSuccess", payload: data });
    
  } catch (error) {
    dispatch({ type: "resetPasswordFail", payload: error.response.data.message });
  }
};


export const verifyOtp = formData => async dispatch => {
  try {
    dispatch({ type: 'verifyRequest' });

    const requestData = {
      phoneNumber: formData.phoneNumber,
      otp: Number(formData.otp),        
    };

    const { data } = await axios.post(`${server}/user/verify-otp`, requestData, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    dispatch({ type: 'verifySuccess', payload: data });
  } catch (error) {
    dispatch({ type: 'verifyFail', payload: error.response.data.message });
  }
};



export const resendOtp = formData => async dispatch =>{
  try {
    dispatch({type: 'resendRequest'});

    const requestData = {
      phoneNumber: Number(formData.phoneNumber),
    };

    const { data } = await axios.post(`${server}/user/resend-otp`, requestData, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    dispatch({type: "resendSuccess", payload: data})
    
  } catch (error) {
    dispatch({type: 'resendFail', payload: error.response.data.message})
  }
}

export const loadUser = () => async (dispatch) => {
  try {
    dispatch({ type: "loadUserRequest" });

    const { data } = await axios.get(`${server}/user/profile`, {
      withCredentials: true,
    });

    dispatch({ type: "loadUserSuccess", payload: data.user });
  } catch (error) {
    dispatch({ type: "loadUserFail", payload: error.response.data.message });
  }
};


export const updateProfile = (profileData) => async (dispatch) => {
  try {
    dispatch({ type: "updateProfileRequest" });

    const config = {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    };

    const { data } = await axios.put(`${server}/user/profile`, profileData, config);

    dispatch({ type: "updateProfileSuccess", payload: data.updatedProfile });
  } catch (error) {
    dispatch({ type: "updateProfileFail", payload: error.response.data.message });
  }
};

// 6. userAction.js

export const updateLocation = (coordinates, jobId = null) => async (dispatch) => {
  try {
    dispatch({ type: 'updateLocationRequest' });
    
    // Update the URL to match the backend route
    const url = `${server}/user/driver/location`;
    
    const { data } = await axios.patch(
      url,
      { coordinates, jobId }, // Include jobId in the request body
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );

    dispatch({
      type: 'updateLocationSuccess',
      payload: data
    });
  } catch (error) {
    dispatch({
      type: 'updateLocationFail',
      payload: error.response?.data?.message || 'Error updating location'
    });
  }
};


export const updateLocationViaSocket = ({
  jobId,
  coordinates,
  status,
  isAtPickup,
  isAtDestination,
  timestamp,
  driverDetails
}) => ({
  type: 'UPDATE_LOCATION_VIA_SOCKET',
  payload: {
    jobId,
    coordinates,
    status,
    isAtPickup,
    isAtDestination,
    timestamp,
    driverDetails
  }
});


export const initiateCall = (jobId) => async (dispatch) => {
  try {
    dispatch({ type: 'initiateCallRequest' });

    const { data } = await axios.post(`${server}/user/jobs/${jobId}/initiate-call`, {}, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    dispatch({ 
      type: 'initiateCallSuccess', 
      payload: { 
        callSid: data.callSid, 
        message: data.message 
      } 
    });
  } catch (error) {
    dispatch({ 
      type: 'initiateCallFail', 
      payload: error.response?.data?.message || 'Failed to initiate call' 
    });
  }
};

// End Call Action
export const endCall = (jobId) => async (dispatch) => {
  try {
    dispatch({ type: 'endCallRequest' });

    const { data } = await axios.post(`${server}/user/jobs/${jobId}/end-call`, {}, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    dispatch({ 
      type: 'endCallSuccess', 
      payload: { 
        message: data.message 
      } 
    });
  } catch (error) {
    dispatch({ 
      type: 'endCallFail', 
      payload: error.response?.data?.message || 'Failed to end call' 
    });
  }
};