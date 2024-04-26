import { createContext, useReducer } from "react";
import ClientsReducer from "./clientContextReducer";

const INITIAL_STATE = {
  isFetching: false,
  clients: [],
  error: false,
};

export const ClientsContext = createContext(INITIAL_STATE);

export const ClientsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(ClientsReducer, INITIAL_STATE);

  return (
    <ClientsContext.Provider
      value={{
        isFetching: state.isFetching,
        clients: state.clients,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </ClientsContext.Provider>
  );
};
