import { toast } from 'react-toastify';
import { axiosI } from '../../config';
import {
	LOGIN_FAILURE,
	LOGIN_SUCCESS,
	LOGIN_START,
	LOGOUT,
} from './authContextActions';

export const login = async (dispatch, user) => {
	dispatch(LOGIN_START());
	try {
		const res = await axiosI.post('auth/login', user);
		if (res.data.isAdmin) {
			dispatch(LOGIN_SUCCESS(res.data));
		}
	} catch (error) {
		dispatch(LOGIN_FAILURE(error));
		toast.error(error.response.data.message || 'Something went wrong!');
	}
};

export const logout = (dispatch) => {
	dispatch(LOGOUT());
	localStorage.removeItem('user');
};
