// get returnProducts
export const GET_RETURN_PRODUCTS_START = () => ({
  type: "GET_RETURN_PRODUCTS_START",
});

export const GET_RETURN_PRODUCTS_SUCCESS = (returnProducts) => ({
  type: "GET_RETURN_PRODUCTS_SUCCESS",
  payload: returnProducts,
});

export const GET_RETURN_PRODUCTS_FAILURE = (error) => ({
  type: "GET_RETURN_PRODUCTS_FAILURE",
  payload: error,
});

// get returnProducts
export const GET_RETURN_PRODUCT_STATS_START = () => ({
  type: "GET_RETURN_PRODUCT_STATS_START",
});

export const GET_RETURN_PRODUCT_STATS_SUCCESS = (returnProducts) => ({
  type: "GET_RETURN_PRODUCT_STATS_SUCCESS",
  payload: returnProducts,
});

export const GET_RETURN_PRODUCT_STATS_FAILURE = (error) => ({
  type: "GET_RETURN_PRODUCT_STATS_FAILURE",
  payload: error,
});

// delete bill
export const DELETE_RETURN_PRODUCT_START = () => ({
  type: "DELETE_RETURN_PRODUCT_START",
});

export const DELETE_RETURN_PRODUCT_SUCCESS = (id) => ({
  type: "DELETE_RETURN_PRODUCT_SUCCESS",
  payload: id,
});

export const DELETE_RETURN_PRODUCT_FAILURE = (error) => ({
  type: "DELETE_RETURN_PRODUCT_FAILURE",
  payload: error,
});

// add returnProduct
export const ADD_RETURN_PRODUCT_START = () => ({
  type: "ADD_RETURN_PRODUCT_START",
});

export const ADD_RETURN_PRODUCT_SUCCESS = (returnProduct) => ({
  type: "ADD_RETURN_PRODUCT_SUCCESS",
  payload: returnProduct,
});

export const ADD_RETURN_PRODUCT_FAILURE = (error) => ({
  type: "ADD_RETURN_PRODUCT_FAILURE",
  payload: error,
});

// // update returnProduct
export const UPDATE_RETURN_PRODUCT_START = () => ({
  type: "UPDATE_RETURN_PRODUCT_START",
});

export const UPDATE_RETURN_PRODUCT_SUCCESS = (bill) => ({
  type: "UPDATE_RETURN_PRODUCT_SUCCESS",
  payload: bill,
});

export const UPDATE_RETURN_PRODUCT_FAILURE = (error) => ({
  type: "UPDATE_RETURN_PRODUCT_FAILURE",
  payload: error,
});
