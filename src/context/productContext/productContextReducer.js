const ProductsReducer = (state, action) => {
  switch (action.type) {
    //get products
    case "GET_PRODUCTS_START":
      return {
        isFetching: true,
        products: [],
        error: false,
      };
    case "GET_PRODUCTS_SUCCESS":
      return {
        isFetching: false,
        products: action.payload,
        error: false,
      };
    case "GET_PRODUCTS_FAILURE":
      return {
        isFetching: false,
        products: [],
        error: action.payload,
      };

    //get product
    case "GET_PRODUCT_START":
      return {
        isFetching: true,
        product: [],
        error: false,
      };
    case "GET_PRODUCT_SUCCESS":
      return {
        isFetching: false,
        products: action.payload,
        error: false,
      };
    case "GET_PRODUCT_FAILURE":
      return {
        isFetching: false,
        products: [],
        error: action.payload,
      };

    //delete products
    case "DELETE_PRODUCT_START":
      return {
        ...state,
        isFetching: true,
        error: false,
      };
    case "DELETE_PRODUCT_SUCCESS":
      return {
        isFetching: false,
        error: false,
        products: state.products.filter(
          (product) => product._id !== action.payload
        ),
      };
    case "DELETE_PRODUCT_FAILURE":
      return {
        ...state,
        isFetching: false,
        error: action.payload,
      };

    //add product
    case "ADD_PRODUCT_START":
      return {
        ...state,
        isFetching: true,
        error: false,
      };
    case "ADD_PRODUCT_SUCCESS":
      return {
        isFetching: false,
        error: false,
        products: [...state.products, action.payload],
      };
    case "ADD_PRODUCT_FAILURE":
      return {
        ...state,
        isFetching: false,
        error: action.payload,
      };

    //update product
    case "UPDATE_PRODUCT_START":
      return {
        ...state,
        isFetching: true,
        error: false,
      };
    case "UPDATE_PRODUCT_SUCCESS":
      return {
        isFetching: false,
        error: false,
        products: state.products.map(
          (product) => product._id === action.payload._id && action.payload
        ),
      };
    case "UPDATE_PRODUCT_FAILURE":
      return {
        ...state,
        isFetching: false,
        error: action.payload,
      };

    default:
      return { ...state };
  }
};

export default ProductsReducer;
