// get bills
export const GET_BILLS_START = () => ({
  type: "GET_BILLS_START",
});
export const GET_BILLS_SUCCESS = (bills) => ({
  type: "GET_BILLS_SUCCESS",
  payload: bills,
});
export const GET_BILLS_FAILURE = (error) => ({
  type: "GET_BILLS_FAILURE",
  payload: error,
});

// get bill
export const GET_BILL_START = () => ({
  type: "GET_BILL_START",
});
export const GET_BILL_SUCCESS = (bills) => ({
  type: "GET_BILL_SUCCESS",
  payload: bills,
});
export const GET_BILL_FAILURE = (error) => ({
  type: "GET_BILL_FAILURE",
  payload: error,
});

// delete bill
export const DELETE_BILL_START = () => ({
  type: "DELETE_BILL_START",
});
export const DELETE_BILL_SUCCESS = (id) => ({
  type: "DELETE_BILL_SUCCESS",
  payload: id,
});
export const DELETE_BILL_FAILURE = (error) => ({
  type: "DELETE_BILL_FAILURE",
  payload: error,
});

// add bill
export const ADD_BILL_START = () => ({
  type: "ADD_BILL_START",
});
export const ADD_BILL_SUCCESS = (bill) => ({
  type: "ADD_BILL_SUCCESS",
  payload: bill,
});
export const ADD_BILL_FAILURE = (error) => ({
  type: "ADD_BILL_FAILURE",
  payload: error,
});

// update bill
export const UPDATE_BILL_START = () => ({
  type: "UPDATE_BILL_START",
});
export const UPDATE_BILL_SUCCESS = (bill) => ({
  type: "UPDATE_BILL_SUCCESS",
  payload: bill,
});
export const UPDATE_BILL_FAILURE = (error) => ({
  type: "UPDATE_BILL_FAILURE",
  payload: error,
});

// get bills stats
export const GET_BILL_STATS_START = () => ({
  type: "GET_BILL_STATS_START",
});
export const GET_BILL_STATS_SUCCESS = (bills) => ({
  type: "GET_BILL_STATS_SUCCESS",
  payload: bills,
});
export const GET_BILL_STATS_FAILURE = (error) => ({
  type: "GET_BILL_STATS_FAILURE",
  payload: error,
});
