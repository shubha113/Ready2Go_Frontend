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