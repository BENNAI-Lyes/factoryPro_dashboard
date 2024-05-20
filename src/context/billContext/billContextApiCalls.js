import { toast } from 'react-toastify';
import { axiosI } from '../../config';
import {
	ADD_BILL_FAILURE,
	ADD_BILL_START,
	ADD_BILL_SUCCESS,
	DELETE_BILL_FAILURE,
	DELETE_BILL_START,
	DELETE_BILL_SUCCESS,
	GET_BILLS_FAILURE,
	GET_BILLS_START,
	GET_BILLS_SUCCESS,
	GET_BILL_FAILURE,
	GET_BILL_START,
	GET_BILL_SUCCESS,
	UPDATE_BILL_FAILURE,
	UPDATE_BILL_START,
	UPDATE_BILL_SUCCESS,
	GET_BILL_STATS_FAILURE,
	GET_BILL_STATS_START,
	GET_BILL_STATS_SUCCESS,
} from './billContextActions';

//get bills
export const getBills = async (dispatch) => {
	dispatch(GET_BILLS_START());
	try {
		const res = await axiosI.get('bon', {
			headers: {
				token: 'Bearer ' + JSON.parse(localStorage.getItem('user')).accessToken,
			},
		});
		dispatch(GET_BILLS_SUCCESS(res.data));
	} catch (error) {
		dispatch(GET_BILLS_FAILURE(error));
		toast.error(error?.response?.data?.message);
	}
};

//get bill
export const getBill = async (dispatch, id) => {
	dispatch(GET_BILL_START());
	try {
		const res = await axiosI.get('bon/find/' + id, {
			headers: {
				token: 'Bearer ' + JSON.parse(localStorage.getItem('user')).accessToken,
			},
		});
		dispatch(GET_BILL_SUCCESS(res.data));
	} catch (error) {
		dispatch(GET_BILL_FAILURE(error));
		toast.error(error?.response?.data?.message);
	}
};

//delete bill

export const deleteBill = async (dispatch, id) => {
	dispatch(DELETE_BILL_START());
	try {
		await axiosI.delete('bon/' + id, {
			headers: {
				token: 'Bearer ' + JSON.parse(localStorage.getItem('user')).accessToken,
			},
		});
		toast.success('Bill Deleted Successfully.');
		dispatch(DELETE_BILL_SUCCESS(id));
	} catch (error) {
		dispatch(DELETE_BILL_FAILURE(error));
		toast.error(error?.response?.data?.message);
	}
};

//add bill
export const addBill = async (dispatch, bill) => {
	dispatch(ADD_BILL_START());
	try {
		const res = await axiosI.post('bon/', bill, {
			headers: {
				token: 'Bearer ' + JSON.parse(localStorage.getItem('user')).accessToken,
			},
		});
		toast.success('Bill Added Successfully.');
		dispatch(ADD_BILL_SUCCESS(res.data));

		//discount products quantity
	} catch (error) {
		dispatch(ADD_BILL_FAILURE(error));
		toast.error(error?.response?.data?.message);
	}
};

//update bill
export const updateBill = async (dispatch, bill) => {
	dispatch(UPDATE_BILL_START());
	try {
		const res = await axiosI.put('bon/' + bill._id, bill, {
			headers: {
				token: 'Bearer ' + JSON.parse(localStorage.getItem('user')).accessToken,
			},
		});
		toast.success('Bill Updated Successfully.');
		dispatch(UPDATE_BILL_SUCCESS(res.data));
	} catch (error) {
		dispatch(UPDATE_BILL_FAILURE(error));
		toast.error(error?.response?.data?.message);
	}
};

//get bills stats
export const getBillsStats = async (dispatch) => {
	dispatch(GET_BILL_STATS_START());
	try {
		const res = await axiosI.get('bon/stats', {
			headers: {
				token: 'Bearer ' + JSON.parse(localStorage.getItem('user')).accessToken,
			},
		});

		dispatch(GET_BILL_STATS_SUCCESS(res.data));
	} catch (error) {
		dispatch(GET_BILL_STATS_FAILURE(error));
		toast.error(error?.response?.data?.message);
	}
};
