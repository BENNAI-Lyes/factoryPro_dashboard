const TransactionsReducer = (state, action) => {
  switch (action.type) {
    //get transactions
    case "GET_TRANSACTIONS_START":
      return {
        isFetching: true,
        transactions: [],
        error: false,
      };
    case "GET_TRANSACTIONS_SUCCESS":
      return {
        isFetching: false,
        transactions: action.payload,
        error: false,
      };
    case "GET_TRANSACTIONS_FAILURE":
      return {
        isFetching: false,
        transactions: [],
        error: action.payload,
      };

    //delete transactions
    case "DELETE_TRANSACTION_START":
      return {
        ...state,
        isFetching: true,
        error: false,
      };
    case "DELETE_TRANSACTION_SUCCESS":
      return {
        isFetching: false,
        error: false,
        transactions: state.transactions.filter(
          (transaction) => transaction._id !== action.payload
        ),
      };
    case "DELETE_TRANSACTION_FAILURE":
      return {
        ...state,
        isFetching: false,
        error: action.payload,
      };

    //add transaction
    case "ADD_TRANSACTION_START":
      return {
        ...state,
        isFetching: true,
        error: false,
      };
    case "ADD_TRANSACTION_SUCCESS":
      return {
        isFetching: false,
        error: false,
        transactions: [...state.transactions, action.payload],
      };
    case "ADD_TRANSACTION_FAILURE":
      return {
        ...state,
        isFetching: false,
        error: action.payload,
      };

    //update transaction
    case "UPDATE_TRANSACTION_START":
      return {
        ...state,
        isFetching: true,
        error: false,
      };
    case "UPDATE_TRANSACTION_SUCCESS":
      return {
        isFetching: false,
        error: false,
        transactions: state.transactions.map(
          (transaction) =>
            transaction._id === action.payload._id && action.payload
        ),
      };
    case "UPDATE_TRANSACTION_FAILURE":
      return {
        ...state,
        isFetching: false,
        error: action.payload,
      };

    default:
      return { ...state };
  }
};

export default TransactionsReducer;
