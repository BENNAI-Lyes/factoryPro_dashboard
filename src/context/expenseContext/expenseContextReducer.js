const ExpensesReducer = (state, action) => {
  switch (action.type) {
    //get expenses
    case "GET_EXPENSES_START":
      return {
        isFetching: true,
        expenses: [],
        error: false,
      };
    case "GET_EXPENSES_SUCCESS":
      return {
        isFetching: false,
        expenses: action.payload,
        error: false,
      };
    case "GET_EXPENSES_FAILURE":
      return {
        isFetching: false,
        expenses: [],
        error: action.payload,
      };

    //delete expense
    case "DELETE_EXPENSE_START":
      return {
        ...state,
        isFetching: true,
        error: false,
      };
    case "DELETE_EXPENSE_SUCCESS":
      return {
        isFetching: false,
        error: false,
        expenses: state.expenses.filter(
          (expense) => expense._id !== action.payload
        ),
      };
    case "DELETE_EXPENSE_FAILURE":
      return {
        ...state,
        isFetching: false,
        error: action.payload,
      };
    //add expense

    case "ADD_EXPENSE_START":
      return {
        ...state,
        isFetching: true,
        error: false,
      };
    case "ADD_EXPENSE_SUCCESS":
      return {
        isFetching: false,
        error: false,
        expenses: [...state.expenses, action.payload],
      };
    case "ADD_EXPENSE_FAILURE":
      return {
        ...state,
        isFetching: false,
        error: action.payload,
      };
    //update expense

    case "UPDATE_EXPENSE_START":
      return {
        ...state,
        isFetching: true,
        error: false,
      };
    case "UPDATE_EXPENSE_SUCCESS":
      return {
        isFetching: false,
        error: false,
        expenses: state.expenses.map(
          (expense) => expense._id === action.payload._id && action.payload
        ),
      };
    case "UPDATE_EXPENSE_FAILURE":
      return {
        ...state,
        isFetching: false,
        error: action.payload,
      };

    //update expense stats

    case "GET_EXPENSE_STATS_START":
      return {
        ...state,
        isFetching: true,
        error: false,
      };
    case "GET_EXPENSE_STATS_SUCCESS":
      return {
        isFetching: false,
        error: false,
        expenses: action.payload,
      };
    case "GET_EXPENSE_STATS_FAILURE":
      return {
        ...state,
        isFetching: false,
        error: action.payload,
      };

    default:
      return { ...state };
  }
};

export default ExpensesReducer;
