const InvoiceReducer = (state, action) => {
  switch (action.type) {
    //get invoices
    case "GET_INVOICES_START":
      return {
        isFetching: true,
        invoices: [],
        error: false,
      };
    case "GET_INVOICES_SUCCESS":
      return {
        isFetching: false,
        invoices: action.payload,
        error: false,
      };
    case "GET_INVOICES_FAILURE":
      return {
        isFetching: false,
        invoices: [],
        error: action.payload,
      };

    //delete invoices
    case "DELETE_INVOICE_START":
      return {
        ...state,
        isFetching: true,
        error: false,
      };
    case "DELETE_INVOICE_SUCCESS":
      return {
        isFetching: false,
        error: false,
        invoices: state.invoices.filter(
          (invoice) => invoice._id !== action.payload
        ),
      };
    case "DELETE_INVOICE_FAILURE":
      return {
        ...state,
        isFetching: false,
        error: action.payload,
      };

    //add invoice
    case "ADD_INVOICE_START":
      return {
        ...state,
        isFetching: true,
        error: false,
      };
    case "ADD_INVOICE_SUCCESS":
      return {
        isFetching: false,
        error: false,
        invoices: [...state.invoices, action.payload],
      };
    case "ADD_INVOICE_FAILURE":
      return {
        ...state,
        isFetching: false,
        error: action.payload,
      };

    //update invoice
    case "UPDATE_INVOICE_START":
      return {
        ...state,
        isFetching: true,
        error: false,
      };
    case "UPDATE_INVOICE_SUCCESS":
      return {
        isFetching: false,
        error: false,
        invoices: state.invoices.map(
          (invoice) => invoice._id === action.payload._id && action.payload
        ),
      };
    case "UPDATE_INVOICE_FAILURE":
      return {
        ...state,
        isFetching: false,
        error: action.payload,
      };

    default:
      return { ...state };
  }
};

export default InvoiceReducer;
