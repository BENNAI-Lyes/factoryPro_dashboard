// get payrolls
export const GET_PAYROLLS_START = () => ({
  type: 'GET_PAYROLLS_START',
});
export const GET_PAYROLLS_SUCCESS = (payrolls) => ({
  type: 'GET_PAYROLLS_SUCCESS',
  payload: payrolls,
});
export const GET_PAYROLLS_FAILURE = (error) => ({
  type: 'GET_PAYROLLS_FAILURE',
  payload: error,
});

// get payroll
export const GET_PAYROLL_START = () => ({
  type: 'GET_PAYROLL_START',
});
export const GET_PAYROLL_SUCCESS = (payrolls) => ({
  type: 'GET_PAYROLL_SUCCESS',
  payload: payrolls,
});
export const GET_PAYROLL_FAILURE = (error) => ({
  type: 'GET_PAYROLL_FAILURE',
  payload: error,
});

// delete payroll
export const DELETE_PAYROLL_START = () => ({
  type: 'DELETE_PAYROLL_START',
});
export const DELETE_PAYROLL_SUCCESS = (id) => ({
  type: 'DELETE_PAYROLL_SUCCESS',
  payload: id,
});
export const DELETE_PAYROLL_FAILURE = (error) => ({
  type: 'DELETE_PAYROLL_FAILURE',
  payload: error,
});

// delete all payrolls
export const DELETE_ALL_PAYROLL_START = () => ({
  type: 'DELETE_ALL_PAYROLL_START',
});
export const DELETE_ALL_PAYROLL_SUCCESS = () => ({
  type: 'DELETE_ALL_PAYROLL_SUCCESS',
});
export const DELETE_ALL_PAYROLL_FAILURE = (error) => ({
  type: 'DELETE_ALL_PAYROLL_FAILURE',
  payload: error,
});

// add payroll
export const ADD_PAYROLL_START = () => ({
  type: 'ADD_PAYROLL_START',
});
export const ADD_PAYROLL_SUCCESS = (payroll) => ({
  type: 'ADD_PAYROLL_SUCCESS',
  payload: payroll,
});
export const ADD_PAYROLL_FAILURE = (error) => ({
  type: 'ADD_PAYROLL_FAILURE',
  payload: error,
});

// update payroll
export const UPDATE_PAYROLL_START = () => ({
  type: 'UPDATE_PAYROLL_START',
});
export const UPDATE_PAYROLL_SUCCESS = (payroll) => ({
  type: 'UPDATE_PAYROLL_SUCCESS',
  payload: payroll,
});
export const UPDATE_PAYROLL_FAILURE = (error) => ({
  type: 'UPDATE_PAYROLL_FAILURE',
  payload: error,
});
