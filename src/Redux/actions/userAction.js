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
    dispatch({type: "logoutRequest"});
    
    const { data } = await axios.get(`${server}/user/logout`, {
      withCredentials: true,
    });

    dispatch({ type: "logoutSuccess", payload: data });
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

// Action to load user profile
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
