// get expenses
export const GET_EXPENSES_START = () => ({
  type: "GET_EXPENSES_START",
});

export const GET_EXPENSES_SUCCESS = (expenses) => ({
  type: "GET_EXPENSES_SUCCESS",
  payload: expenses,
});

export const GET_EXPENSES_FAILURE = (error) => ({
  type: "GET_EXPENSES_FAILURE",
  payload: error,
});

// delete expense
export const DELETE_EXPENSE_START = () => ({
  type: "DELETE_EXPENSE_START",
});

export const DELETE_EXPENSE_SUCCESS = (id) => ({
  type: "DELETE_EXPENSE_SUCCESS",
  payload: id,
});

export const DELETE_EXPENSE_FAILURE = (error) => ({
  type: "DELETE_EXPENSE_FAILURE",
  payload: error,
});

// add expense
export const ADD_EXPENSE_START = () => ({
  type: "ADD_EXPENSE_START",
});

export const ADD_EXPENSE_SUCCESS = (expense) => ({
  type: "ADD_EXPENSE_SUCCESS",
  payload: expense,
});

export const ADD_EXPENSE_FAILURE = (error) => ({
  type: "ADD_EXPENSE_FAILURE",
  payload: error,
});

// update expense
// export const UPDATE_BILL_START = () => ({
//   type: "UPDATE_BILL_START",
// });

// export const UPDATE_BILL_SUCCESS = (expense) => ({
//   type: "UPDATE_BILL_SUCCESS",
//   payload: expense,
// });

// export const UPDATE_BILL_FAILURE = (error) => ({
//   type: "UPDATE_BILL_FAILURE",
//   payload: error,
// });

//get expense stats
export const GET_EXPENSE_STATS_START = () => ({
  type: "GET_EXPENSE_STATS_START",
});

export const GET_EXPENSE_STATS_SUCCESS = (expenses) => ({
  type: "GET_EXPENSE_STATS_SUCCESS",
  payload: expenses,
});

export const GET_EXPENSE_STATS_FAILURE = (error) => ({
  type: "GET_EXPENSE_STATS_FAILURE",
  payload: error,
});
