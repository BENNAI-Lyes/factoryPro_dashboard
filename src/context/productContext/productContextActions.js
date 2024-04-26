// get products
export const GET_PRODUCTS_START = () => ({
  type: "GET_PRODUCTS_START",
});

export const GET_PRODUCTS_SUCCESS = (products) => ({
  type: "GET_PRODUCTS_SUCCESS",
  payload: products,
});

export const GET_PRODUCTS_FAILURE = (error) => ({
  type: "GET_PRODUCTS_FAILURE",
  payload: error,
});

// get product
export const GET_PRODUCT_START = () => ({
  type: "GET_PRODUCT_START",
});

export const GET_PRODUCT_SUCCESS = (id) => ({
  type: "GET_PRODUCT_SUCCESS",
  payload: id,
});

export const GET_PRODUCT_FAILURE = (error) => ({
  type: "GET_PRODUCT_FAILURE",
  payload: error,
});

// delete product
export const DELETE_PRODUCT_START = () => ({
  type: "DELETE_PRODUCT_START",
});

export const DELETE_PRODUCT_SUCCESS = (id) => ({
  type: "DELETE_PRODUCT_SUCCESS",
  payload: id,
});

export const DELETE_PRODUCT_FAILURE = (error) => ({
  type: "DELETE_PRODUCT_FAILURE",
  payload: error,
});

// add product
export const ADD_PRODUCT_START = () => ({
  type: "ADD_PRODUCT_START",
});

export const ADD_PRODUCT_SUCCESS = (product) => ({
  type: "ADD_PRODUCT_SUCCESS",
  payload: product,
});

export const ADD_PRODUCT_FAILURE = (error) => ({
  type: "ADD_PRODUCT_FAILURE",
  payload: error,
});

// update product
export const UPDATE_PRODUCT_START = () => ({
  type: "UPDATE_PRODUCT_START",
});

export const UPDATE_PRODUCT_SUCCESS = (product) => ({
  type: "UPDATE_PRODUCT_SUCCESS",
  payload: product,
});

export const UPDATE_PRODUCT_FAILURE = (error) => ({
  type: "UPDATE_PRODUCT_FAILURE",
  payload: error,
});
