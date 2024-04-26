import { createContext, useReducer } from "react";
import ExpensesReducer from "./expenseContextReducer";

const INITIAL_STATE = {
  isFetching: false,
  expenses: [],
  error: false,
};

export const ExpensesContext = createContext(INITIAL_STATE);

export const ExpensesContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(ExpensesReducer, INITIAL_STATE);

  return (
    <ExpensesContext.Provider
      value={{
        isFetching: state.isFetching,
        expenses: state.expenses,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </ExpensesContext.Provider>
  );
};
