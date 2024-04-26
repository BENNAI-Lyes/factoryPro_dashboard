import { createContext, useReducer } from "react";
import ReturnProductReducer from "./returnProductContextReducer";

const INITIAL_STATE = {
  isFetching: false,
  returnProducts: [],
  error: false,
};

export const ReturnProductsContext = createContext(INITIAL_STATE);

export const ReturnProductsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(ReturnProductReducer, INITIAL_STATE);

  return (
    <ReturnProductsContext.Provider
      value={{
        isFetching: state.isFetching,
        returnProducts: state.returnProducts,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </ReturnProductsContext.Provider>
  );
};
