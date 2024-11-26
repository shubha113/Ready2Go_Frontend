import axios from 'axios';
import { server } from '../store';
import { useNavigate } from 'react-router-dom';

export const createJob = formData => async dispatch => {
  
  try {

    dispatch({ type: 'createJobRequest' });

    const { data } = await axios.post(`${server}/job/create`, formData, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    dispatch({ type: 'createJobSuccess', payload: data });

  } catch (error) {
    dispatch({ type: 'createJobFail', payload: error.response.data.message });
  }
};


export const userHistory = () => async (dispatch) => {
  try {
    dispatch({ type: 'userHistoryRequest' });
    
    const { data } = await axios.get(`${server}/job/user`, {
      withCredentials: true,
    });
    
    dispatch({ type: 'userHistorySuccess', payload: data });

  } catch (error) {
    dispatch({
      type: 'userHistoryFail',
      payload: error.response?.data?.message || 'Error fetching history'
    });
  }
};



export const driverHistory = () => async (dispatch) => {
  try {
    dispatch({ type: 'driverHistoryRequest' });
    
    const { data } = await axios.get(`${server}/job/driver`, {
      withCredentials: true,
    });
    
    dispatch({ type: 'driverHistorySuccess', payload: data });

  } catch (error) {
    dispatch({
      type: 'driverHistoryFail',
      payload: error.response?.data?.message || 'Error fetching history'
    });
  }
};



export const uploadDetails = () => async (dispatch) => {
  try {
    dispatch({ type: 'uploadDetailsRequest' });
    
    const { data } = await axios.get(`${server}/user/upload-documents`, {
      withCredentials: true,
    });
    
    dispatch({ type: 'uploadDetailsSuccess', payload: data });

  } catch (error) {
    dispatch({
      type: 'uploadDetailsFail',
      payload: error.response?.data?.message || 'Error uploading Details'
    });
  }
};



export const getJobs = (radius = 10) => async (dispatch) => {
  try {
    dispatch({ type: "getJobsRequest" });

    const config = {
      params: { radius },
      withCredentials: true,
    };

    const { data } = await axios.get(`${server}/job/jobs/driver`, config);

    dispatch({
      type: "getJobsSuccess",
      payload: {
        ...data,
        availableJobs: data.availableJobs,
        hasActiveJob: data.hasActiveJob
      }
    });
  } catch (error) {
    dispatch({ 
      type: "getJobsFail", 
      payload: error.response?.data?.message || "Something went wrong" 
    });
  }
};

export const cancelJob = (jobId) => async (dispatch) => {
  try {
    dispatch({ type: 'cancelJobRequest' });
    
    const { data } = await axios.delete(
      `${server}/job/jobs/${jobId}`,
      {
        withCredentials: true,
      }
    );
    
    dispatch({ type: 'cancelJobSuccess', payload: data });
  } catch (error) {
    dispatch({
      type: 'cancelJobFail',
      payload: error.response?.data?.message || 'Error canceling job',
    });
  }
};



export const acceptJob = (jobId, fare) => async (dispatch) => {
  try {
    dispatch({ type: 'acceptJobRequest' });

    const { data } = await axios.post(
      `${server}/job/jobs/${jobId}/accept`,
      { jobId, fare },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );
    dispatch({ type: 'acceptJobSuccess', payload: data });
  } catch (error) {
    dispatch({
      type: 'acceptJobFail',
      payload: error.response?.data?.message || 'Error accepting job',
    });
  }
};



export const getSubmittedFares = (jobId) => async (dispatch) => {
  try {
    dispatch({ type: 'getSubmittedFaresRequest' });

    const { data } = await axios.get(`${server}/job/jobs/${jobId}/fares`, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    dispatch({
      type: 'getSubmittedFaresSuccess',
      payload: data
    });
  } catch (error) {
    dispatch({
      type: 'getSubmittedFaresFail',
      payload: error.response?.data?.message || 'Error fetching submitted fares',
    });
  }
};





export const acceptFareOffer = (jobId, driverId, fareId) => async (dispatch) => {
  try {
    dispatch({ type: "acceptFareRequest" });

    // First, get Razorpay key
    const { data: keyData } = await axios.get(`${server}/payment/razorpaykey`, {
      withCredentials: true
    });

    // Create order and get order details
    const { data } = await axios.post(
      `${server}/job/jobs/${jobId}/accept-fare-offer`,
      { jobId, driverId, fareId },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    // Prepare Razorpay options
    const options = {
      key: keyData.key, // Razorpay key
      amount: data.currentBlockedAmount * 100, // Amount in paisa
      currency: "INR",
      name: "Ready2Go",
      description: `Block amount for Job ${jobId}`,
      order_id: data.razorpayOrderId,
      handler: async function (response) {
        console.log('Razorpay Response:', {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature
        });
        try {
          // Verify payment block
          const verifyResponse = await axios.post(
            `${server}/payment/verify`,
            {
              orderId: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            },
            {
              withCredentials: true
            }
          );

          // Dispatch success action
          dispatch({ 
            type: "acceptFareSuccess", 
            payload: {
              ...data,
              paymentVerification: verifyResponse.data
            }
          });

          window.location.href = '/payment-success';

          // Show success toast or redirect
          alert("Amount blocked successfully!");
        } catch (error) {
          // Handle verification failure
          dispatch({
            type: "acceptFareFail",
            payload: error.response?.data?.message || "Payment block verification failed"
          });

          //window.location.href = '/payment-failure';
        }
      },
      prefill: {
        name: "Logistics Customer",
        email: "customer@example.com",
        contact: ""
      },
      notes: {
        jobId: jobId,
        driverId: driverId
      },
      theme: {
        color: "#b903d8"
      }
    };

    // Open Razorpay payment window
    const razorpay = new window.Razorpay(options);
    razorpay.open();

  } catch (error) {
    console.error('Fare Acceptance Error:', error);
    dispatch({
      type: "acceptFareFail",
      payload: error.response?.data?.message || "Failed to accept fare"
    });
  }
};




// Add these to your jobActions.js
export const getJobTracking = (jobId) => async (dispatch) => {
  try {
    dispatch({ type: 'getJobTrackingRequest' });

    const { data } = await axios.get(`${server}/job/jobs/${jobId}/tracking`, {
      withCredentials: true,
    });

    dispatch({ 
      type: 'getJobTrackingSuccess', 
      payload: data 
    });
  } catch (error) {
    dispatch({
      type: 'getJobTrackingFail',
      payload: error.response?.data?.message || 'Error fetching tracking details'
    });
  }
};
