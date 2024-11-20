import axios from 'axios';
import { server } from '../store';

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
      payload: data  
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
