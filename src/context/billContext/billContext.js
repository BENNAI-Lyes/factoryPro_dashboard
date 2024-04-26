import { createContext, useReducer } from "react";
import BillsReducer from "./billContextReducer";

const INITIAL_STATE = {
  isFetching: false,
  bills: [],
  error: false,
};

export const BillsContext = createContext(INITIAL_STATE);

export const BillsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(BillsReducer, INITIAL_STATE);

  return (
    <BillsContext.Provider
      value={{
        isFetching: state.isFetching,
        bills: state.bills,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </BillsContext.Provider>
  );
};
