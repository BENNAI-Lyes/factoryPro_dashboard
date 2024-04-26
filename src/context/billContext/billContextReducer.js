const BillsReducer = (state, action) => {
  switch (action.type) {
    //get bills
    case "GET_BILLS_START":
      return {
        isFetching: true,
        bills: [],
        error: false,
      };
    case "GET_BILLS_SUCCESS":
      return {
        isFetching: false,
        bills: action.payload,
        error: false,
      };
    case "GET_BILLS_FAILURE":
      return {
        isFetching: false,
        bills: [],
        error: action.payload,
      };

    //get bill
    case "GET_BILL_START":
      return {
        isFetching: true,
        bills: [],
        error: false,
      };
    case "GET_BILL_SUCCESS":
      return {
        isFetching: false,
        bills: action.payload,
        error: false,
      };
    case "GET_BILL_FAILURE":
      return {
        isFetching: false,
        bills: [],
        error: action.payload,
      };

    //delete bill
    case "DELETE_BILL_START":
      return {
        ...state,
        isFetching: true,
        error: false,
      };
    case "DELETE_BILL_SUCCESS":
      return {
        isFetching: false,
        error: false,
        bills: state.bills.filter((bill) => bill._id !== action.payload),
      };
    case "DELETE_BILL_FAILURE":
      return {
        ...state,
        isFetching: false,
        error: action.payload,
      };

    //add bill
    case "ADD_BILL_START":
      return {
        ...state,
        isFetching: true,
        error: false,
      };
    case "ADD_BILL_SUCCESS":
      return {
        isFetching: false,
        error: false,
        bills: [...state.bills, action.payload],
      };
    case "ADD_BILL_FAILURE":
      return {
        ...state,
        isFetching: false,
        error: action.payload,
      };

    //update bill
    case "UPDATE_BILL_START":
      return {
        ...state,
        isFetching: true,
        error: false,
      };
    case "UPDATE_BILL_SUCCESS":
      return {
        isFetching: false,
        error: false,
        bills: state.bills.map(
          (bill) => bill._id === action.payload._id && action.payload
        ),
      };
    case "UPDATE_BILL_FAILURE":
      return {
        ...state,
        isFetching: false,
        error: action.payload,
      };

    //get bills stats
    case "GET_BILL_STATS_START":
      return {
        ...state,
        isFetching: true,
        error: false,
      };
    case "GET_BILL_STATS_SUCCESS":
      return {
        isFetching: false,
        error: false,
        bills: action.payload,
      };
    case "GET_BILL_STATS_FAILURE":
      return {
        ...state,
        isFetching: false,
        error: action.payload,
      };

    default:
      return { ...state };
  }
};

export default BillsReducer;
