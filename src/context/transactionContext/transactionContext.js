import { createContext, useReducer } from "react";
import TransactionsReducer from "./transactionContextReducer";

const INITIAL_STATE = {
  isFetching: false,
  transactions: [],
  error: false,
};

export const TransactionsContext = createContext(INITIAL_STATE);

export const TransactionsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(TransactionsReducer, INITIAL_STATE);

  return (
    <TransactionsContext.Provider
      value={{
        isFetching: state.isFetching,
        transactions: state.transactions,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};
