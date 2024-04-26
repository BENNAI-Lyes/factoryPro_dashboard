import { createContext, useReducer } from "react";
import PayrollsReducer from "./payrollContextReducer";

const INITIAL_STATE = {
  isFetching: false,
  payrolls: [],
  error: false,
};

export const PayrollsContext = createContext(INITIAL_STATE);

export const PayrollsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(PayrollsReducer, INITIAL_STATE);

  return (
    <PayrollsContext.Provider
      value={{
        isFetching: state.isFetching,
        payrolls: state.payrolls,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </PayrollsContext.Provider>
  );
};
