import { toast } from 'react-toastify';
import { axiosI } from '../../config';
import {
  ADD_CLIENT_FAILURE,
  ADD_CLIENT_START,
  ADD_CLIENT_SUCCESS,
  DELETE_CLIENT_FAILURE,
  DELETE_CLIENT_START,
  DELETE_CLIENT_SUCCESS,
  GET_CLIENTS_FAILURE,
  GET_CLIENTS_START,
  GET_CLIENTS_SUCCESS,
  GET_CLIENT_FAILURE,
  GET_CLIENT_START,
  GET_CLIENT_SUCCESS,
} from './clientContextActions';

//get clients
export const getClients = async (dispatch) => {
  dispatch(GET_CLIENTS_START());
  try {
    const res = await axiosI.get('client', {
      headers: {
        token: 'Bearer ' + JSON.parse(localStorage.getItem('user')).accessToken,
      },
    });
    dispatch(GET_CLIENTS_SUCCESS(res.data));
  } catch (error) {
    toast.error(error.response.data.message);
    dispatch(GET_CLIENTS_FAILURE(error));
  }
};

//get client
export const getClient = async (dispatch, id) => {
  dispatch(GET_CLIENT_START());
  try {
    const res = await axiosI.get('client/find/' + id, {
      headers: {
        token: 'Bearer ' + JSON.parse(localStorage.getItem('user')).accessToken,
      },
    });
    dispatch(GET_CLIENT_SUCCESS([res.data]));
  } catch (error) {
    toast.error(error.response.data.message);
    dispatch(GET_CLIENT_FAILURE(error));
  }
};

//delete client
export const deleteClient = async (dispatch, id) => {
  dispatch(DELETE_CLIENT_START());
  try {
    await axiosI.delete('client/' + id, {
      headers: {
        token: 'Bearer ' + JSON.parse(localStorage.getItem('user')).accessToken,
      },
    });
    toast.success('Client Deleted successfully.');
    dispatch(DELETE_CLIENT_SUCCESS(id));
  } catch (error) {
    toast.error(error.response.data.message);
    dispatch(DELETE_CLIENT_FAILURE(error));
  }
};

//add client
export const addClient = async (dispatch, client) => {
  dispatch(ADD_CLIENT_START());
  try {
    const res = await axiosI.post('client', client, {
      headers: {
        token: 'Bearer ' + JSON.parse(localStorage.getItem('user')).accessToken,
      },
    });
    dispatch(ADD_CLIENT_SUCCESS(res.data));
    toast.success('Client Added successfully.');
  } catch (error) {
    toast.error(error.response.data.message);
    dispatch(ADD_CLIENT_FAILURE(error));
  }
};

//update client
export const updateClient = async (dispatch, client) => {
  dispatch(ADD_CLIENT_START());
  try {
    const res = await axiosI.put('client/' + client._id, client, {
      headers: {
        token: 'Bearer ' + JSON.parse(localStorage.getItem('user')).accessToken,
      },
    });
    dispatch(ADD_CLIENT_SUCCESS(res.data));
    toast.success('Client Updated successfully.');
  } catch (error) {
    toast.error(error.response.data.message);
    dispatch(ADD_CLIENT_FAILURE(error));
  }
};
