const ReturnProductsReducer = (state, action) => {
  switch (action.type) {
    //get returnProducts
    case "GET_RETURN_PRODUCTS_START":
      return {
        isFetching: true,
        returnProducts: [],
        error: false,
      };
    case "GET_RETURN_PRODUCTS_SUCCESS":
      return {
        isFetching: false,
        returnProducts: action.payload,
        error: false,
      };
    case "GET_RETURN_PRODUCTS_FAILURE":
      return {
        isFetching: false,
        returnProducts: [],
        error: action.payload,
      };

    //delete returnProduct
    case "DELETE_RETURN_PRODUCT_START":
      return {
        ...state,
        isFetching: true,
        error: false,
      };
    case "DELETE_RETURN_PRODUCT_SUCCESS":
      return {
        isFetching: false,
        error: false,
        returnProducts: state.returnProducts.filter(
          (returnProduct) => returnProduct._id !== action.payload
        ),
      };
    case "DELETE_RETURN_PRODUCT_FAILURE":
      return {
        ...state,
        isFetching: false,
        error: action.payload,
      };

    //add returnProduct
    case "ADD_RETURN_PRODUCT_START":
      return {
        ...state,
        isFetching: true,
        error: false,
      };
    case "ADD_RETURN_PRODUCT_SUCCESS":
      return {
        isFetching: false,
        error: false,
        returnProducts: [...state.returnProducts, action.payload],
      };
    case "ADD_RETURN_PRODUCT_FAILURE":
      return {
        ...state,
        isFetching: false,
        error: action.payload,
      };
    //update returnProduct

    case "UPDATE_RETURN_PRODUCT_START":
      return {
        ...state,
        isFetching: true,
        error: false,
      };
    case "UPDATE_RETURN_PRODUCT_SUCCESS":
      return {
        isFetching: false,
        error: false,
        returnProducts: state.returnProducts.map(
          (returnProduct) =>
            returnProduct._id === action.payload._id && action.payload
        ),
      };
    case "UPDATE_RETURN_PRODUCT_FAILURE":
      return {
        ...state,
        isFetching: false,
        error: action.payload,
      };

    case "GET_RETURN_PRODUCT_STATS_START":
      return {
        ...state,
        isFetching: true,
        error: false,
      };
    case "GET_RETURN_PRODUCT_STATS_SUCCESS":
      return {
        isFetching: false,
        error: false,
        returnProducts: action.payload,
      };
    case "GET_RETURN_PRODUCT_STATS_FAILURE":
      return {
        ...state,
        isFetching: false,
        error: action.payload,
      };

    default:
      return { ...state };
  }
};

export default ReturnProductsReducer;
