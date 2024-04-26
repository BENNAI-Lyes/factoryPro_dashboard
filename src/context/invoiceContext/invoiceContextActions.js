// get invoices
export const GET_INVOICES_START = () => ({
  type: "GET_INVOICES_START",
});

export const GET_INVOICES_SUCCESS = (invoices) => ({
  type: "GET_INVOICES_SUCCESS",
  payload: invoices,
});

export const GET_INVOICES_FAILURE = (error) => ({
  type: "GET_INVOICES_FAILURE",
  payload: error,
});

// delete invoice
export const DELETE_INVOICE_START = () => ({
  type: "DELETE_INVOICE_START",
});

export const DELETE_INVOICE_SUCCESS = (id) => ({
  type: "DELETE_INVOICE_SUCCESS",
  payload: id,
});

export const DELETE_INVOICE_FAILURE = (error) => ({
  type: "DELETE_INVOICE_FAILURE",
  payload: error,
});

// add invoice
export const ADD_INVOICE_START = () => ({
  type: "ADD_INVOICE_START",
});

export const ADD_INVOICE_SUCCESS = (invoice) => ({
  type: "ADD_INVOICE_SUCCESS",
  payload: invoice,
});

export const ADD_INVOICE_FAILURE = (error) => ({
  type: "ADD_INVOICE_FAILURE",
  payload: error,
});

// update invoice
export const UPDATE_INVOICE_START = () => ({
  type: "UPDATE_INVOICE_START",
});

export const UPDATE_INVOICE_SUCCESS = (invoice) => ({
  type: "UPDATE_INVOICE_SUCCESS",
  payload: invoice,
});

export const UPDATE_INVOICE_FAILURE = (error) => ({
  type: "UPDATE_INVOICE_FAILURE",
  payload: error,
});
