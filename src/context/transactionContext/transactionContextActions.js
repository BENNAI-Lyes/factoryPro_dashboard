// get transactions
export const GET_TRANSACTIONS_START = () => ({
  type: "GET_TRANSACTIONS_START",
});

export const GET_TRANSACTIONS_SUCCESS = (transactions) => ({
  type: "GET_TRANSACTIONS_SUCCESS",
  payload: transactions,
});

export const GET_TRANSACTIONS_FAILURE = (error) => ({
  type: "GET_TRANSACTIONS_FAILURE",
  payload: error,
});

// delete transaction
export const DELETE_TRANSACTION_START = () => ({
  type: "DELETE_TRANSACTION_START",
});

export const DELETE_TRANSACTION_SUCCESS = (id) => ({
  type: "DELETE_TRANSACTION_SUCCESS",
  payload: id,
});

export const DELETE_TRANSACTION_FAILURE = (error) => ({
  type: "DELETE_TRANSACTION_FAILURE",
  payload: error,
});

// add transaction
export const ADD_TRANSACTION_START = () => ({
  type: "ADD_TRANSACTION_START",
});

export const ADD_TRANSACTION_SUCCESS = (transaction) => ({
  type: "ADD_TRANSACTION_SUCCESS",
  payload: transaction,
});

export const ADD_TRANSACTION_FAILURE = (error) => ({
  type: "ADD_TRANSACTION_FAILURE",
  payload: error,
});

// update transaction
export const UPDATE_TRANSACTION_START = () => ({
  type: "UPDATE_TRANSACTION_START",
});

export const UPDATE_TRANSACTION_SUCCESS = (transaction) => ({
  type: "UPDATE_TRANSACTION_SUCCESS",
  payload: transaction,
});

export const UPDATE_TRANSACTION_FAILURE = (error) => ({
  type: "UPDATE_TRANSACTION_FAILURE",
  payload: error,
});
