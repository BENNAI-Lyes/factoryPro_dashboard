import { createContext, useEffect, useReducer } from 'react';

import AuthReducer from './authContextReducer';

const INITIAL_STATE = {
	isFetching: false,
	user: JSON.parse(localStorage.getItem('user')) || null,
	error: false,
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

	useEffect(() => {
		localStorage.setItem('user', JSON.stringify(state.user));
	}, [state.user]);

	return (
		<AuthContext.Provider
			value={{
				isFetching: state.isFetching,
				user: state.user,
				error: state.error,
				dispatch,
			}}>
			{children}
		</AuthContext.Provider>
	);
};
