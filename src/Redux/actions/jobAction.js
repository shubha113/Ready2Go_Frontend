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
