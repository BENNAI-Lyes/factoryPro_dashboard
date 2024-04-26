import { createContext, useReducer } from "react";
import WorkersReducer from "./workerContextReducer";

const INITIAL_STATE = {
  isFetching: false,
  workers: [],
  error: false,
};

export const WorkersContext = createContext(INITIAL_STATE);

export const WorkersContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(WorkersReducer, INITIAL_STATE);

  return (
    <WorkersContext.Provider
      value={{
        isFetching: state.isFetching,
        workers: state.workers,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </WorkersContext.Provider>
  );
};
