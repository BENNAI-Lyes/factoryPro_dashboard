import { createContext, useReducer } from "react";
import InvoiceReducer from "./invoiceContextReducer";

const INITIAL_STATE = {
  isFetching: false,
  invoices: [],
  error: false,
};

export const InvoicesContext = createContext(INITIAL_STATE);

export const InvoicesContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(InvoiceReducer, INITIAL_STATE);

  return (
    <InvoicesContext.Provider
      value={{
        isFetching: state.isFetching,
        invoices: state.invoices,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </InvoicesContext.Provider>
  );
};
