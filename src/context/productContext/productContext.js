import { createContext, useReducer } from "react";
import ProductsReducer from "./productContextReducer";

const INITIAL_STATE = {
  isFetching: false,
  products: [],
  error: false,
};

export const ProductsContext = createContext(INITIAL_STATE);

export const ProductsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(ProductsReducer, INITIAL_STATE);

  return (
    <ProductsContext.Provider
      value={{
        isFetching: state.isFetching,
        products: state.products,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};
