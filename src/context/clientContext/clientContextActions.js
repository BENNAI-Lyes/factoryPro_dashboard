// get clients
export const GET_CLIENTS_START = () => ({
  type: 'GET_CLIENTS_START',
});

export const GET_CLIENTS_SUCCESS = (clients) => ({
  type: 'GET_CLIENTS_SUCCESS',
  payload: clients,
});

export const GET_CLIENTS_FAILURE = (error) => ({
  type: 'GET_CLIENTS_FAILURE',
  payload: error,
});

// get client
export const GET_CLIENT_START = () => ({
  type: 'GET_CLIENT_START',
});

export const GET_CLIENT_SUCCESS = (client) => ({
  type: 'GET_CLIENT_SUCCESS',
  payload: client,
});

export const GET_CLIENT_FAILURE = (error) => ({
  type: 'GET_CLIENT_FAILURE',
  payload: error,
});

// delete client
export const DELETE_CLIENT_START = () => ({
  type: 'DELETE_CLIENT_START',
});

export const DELETE_CLIENT_SUCCESS = (id) => ({
  type: 'DELETE_CLIENT_SUCCESS',
  payload: id,
});

export const DELETE_CLIENT_FAILURE = (error) => ({
  type: 'DELETE_CLIENT_FAILURE',
  payload: error,
});

// add client
export const ADD_CLIENT_START = () => ({
  type: 'ADD_CLIENT_START',
});

export const ADD_CLIENT_SUCCESS = (client) => ({
  type: 'ADD_CLIENT_SUCCESS',
  payload: client,
});

export const ADD_CLIENT_FAILURE = (error) => ({
  type: 'ADD_CLIENT_FAILURE',
  payload: error,
});

// update client
export const UPDATE_CLIENT_START = () => ({
  type: 'UPDATE_CLIENT_START',
});

export const UPDATE_CLIENT_SUCCESS = (client) => ({
  type: 'UPDATE_CLIENT_SUCCESS',
  payload: client,
});

export const UPDATE_CLIENT_FAILURE = (error) => ({
  type: 'UPDATE_CLIENT_FAILURE',
  payload: error,
});
