const PayrollsReducer = (state, action) => {
  switch (action.type) {
    //get payrolls
    case 'GET_PAYROLLS_START':
      return {
        isFetching: true,
        payrolls: [],
        error: false,
      };
    case 'GET_PAYROLLS_SUCCESS':
      return {
        isFetching: false,
        payrolls: action.payload,
        error: false,
      };
    case 'GET_PAYROLLS_FAILURE':
      return {
        isFetching: false,
        payrolls: [],
        error: action.payload,
      };

    //get payroll
    case 'GET_PAYROLL_START':
      return {
        isFetching: true,
        payrolls: [],
        error: false,
      };
    case 'GET_PAYROLL_SUCCESS':
      return {
        isFetching: false,
        payrolls: action.payload,
        error: false,
      };
    case 'GET_PAYROLL_FAILURE':
      return {
        isFetching: false,
        payrolls: [],
        error: action.payload,
      };

    //delete payroll
    case 'DELETE_PAYROLL_START':
      return {
        ...state,
        isFetching: true,
        error: false,
      };
    case 'DELETE_PAYROLL_SUCCESS':
      return {
        isFetching: false,
        error: false,
        payrolls: state.payrolls.filter(
          (payroll) => payroll._id !== action.payload
        ),
      };
    case 'DELETE_PAYROLL_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.payload,
      };

    //delete all payroll
    case 'DELETE_ALL_PAYROLL_START':
      return {
        ...state,
        isFetching: true,
        error: false,
      };
    case 'DELETE_ALL_PAYROLL_SUCCESS':
      return {
        isFetching: false,
        error: false,
        payrolls: [],
      };
    case 'DELETE_ALL_PAYROLL_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.payload,
      };

    //add payroll
    case 'ADD_PAYROLL_START':
      return {
        ...state,
        isFetching: true,
        error: false,
      };
    case 'ADD_PAYROLL_SUCCESS':
      return {
        isFetching: false,
        error: false,
        payrolls: [...state.payrolls, action.payload],
      };
    case 'ADD_PAYROLL_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.payload,
      };

    //update payroll
    case 'UPDATE_PAYROLL_START':
      return {
        ...state,
        isFetching: true,
        error: false,
      };
    case 'UPDATE_PAYROLL_SUCCESS':
      return {
        isFetching: false,
        error: false,
        payrolls: state.payrolls.map(
          (payroll) => payroll._id === action.payload._id && action.payload
        ),
      };
    case 'UPDATE_PAYROLL_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.payload,
      };

    // //get payrolls stats
    // case "GET_BILL_STATS_START":
    //   return {
    //     ...state,
    //     isFetching: true,
    //     error: false,
    //   };
    // case "GET_BILL_STATS_SUCCESS":
    //   return {
    //     isFetching: false,
    //     error: false,
    //     payrolls: action.payload,
    //   };
    // case "GET_BILL_STATS_FAILURE":
    //   return {
    //     ...state,
    //     isFetching: false,
    //     error: action.payload,
    //   };

    default:
      return { ...state };
  }
};

export default PayrollsReducer;
