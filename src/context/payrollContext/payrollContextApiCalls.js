import { toast } from 'react-toastify';
import { axiosI } from '../../config';
import {
  ADD_PAYROLL_FAILURE,
  ADD_PAYROLL_START,
  ADD_PAYROLL_SUCCESS,
  DELETE_ALL_PAYROLL_START,
  DELETE_ALL_PAYROLL_SUCCESS,
  DELETE_PAYROLL_FAILURE,
  DELETE_PAYROLL_START,
  DELETE_PAYROLL_SUCCESS,
  GET_PAYROLLS_FAILURE,
  GET_PAYROLLS_START,
  GET_PAYROLLS_SUCCESS,
  GET_PAYROLL_FAILURE,
  GET_PAYROLL_START,
  GET_PAYROLL_SUCCESS,
  UPDATE_PAYROLL_FAILURE,
  UPDATE_PAYROLL_START,
  UPDATE_PAYROLL_SUCCESS,
} from './payrollContextActions';

//get payrolls
export const getPayrolls = async (dispatch, workerId) => {
  dispatch(GET_PAYROLLS_START());
  try {
    const res = await axiosI.get('payroll/' + workerId, {
      headers: {
        token: 'Bearer ' + JSON.parse(localStorage.getItem('user')).accessToken,
      },
    });
    dispatch(GET_PAYROLLS_SUCCESS(res.data));
  } catch (error) {
    dispatch(GET_PAYROLLS_FAILURE(error));
    toast.error(error.response.data.message);
  }
};

//get payroll
export const getPayroll = async (dispatch, id) => {
  dispatch(GET_PAYROLL_START());
  try {
    const res = await axiosI.get('payroll/' + id, {
      headers: {
        token: 'Bearer ' + JSON.parse(localStorage.getItem('user')).accessToken,
      },
    });
    dispatch(GET_PAYROLL_SUCCESS(res.data));
  } catch (error) {
    dispatch(GET_PAYROLL_FAILURE(error));
    toast.error(error.response.data.message);
  }
};

//delete payroll
export const deletePayroll = async (dispatch, id) => {
  dispatch(DELETE_PAYROLL_START());
  try {
    await axiosI.delete('payroll/find/' + id, {
      headers: {
        token: 'Bearer ' + JSON.parse(localStorage.getItem('user')).accessToken,
      },
    });
    toast.success('Payroll Deleted Successfully.');
    dispatch(DELETE_PAYROLL_SUCCESS(id));
  } catch (error) {
    dispatch(DELETE_PAYROLL_FAILURE(error));
    toast.error(error.response.data.message);
  }
};

// //delete all payroll
// export const deleteAllPayroll = async (dispatch, id) => {
//   dispatch(DELETE_ALL_PAYROLL_START());
//   try {
//     await axiosI.delete(
//       'payroll/',
//       { id },
//       {
//         headers: {
//           token:
//             'Bearer ' + JSON.parse(localStorage.getItem('user')).accessToken,
//         },
//       }
//     );
//     toast.success('All Payrolls Deleted Successfully.');
//     dispatch(DELETE_ALL_PAYROLL_SUCCESS());
//   } catch (error) {
//     dispatch(DELETE_PAYROLL_FAILURE(error));
//     toast.error(error.response.data.message);
//   }
// };

//add payroll
export const addPayroll = async (dispatch, payroll) => {
  dispatch(ADD_PAYROLL_START());
  try {
    const res = await axiosI.post('payroll/', payroll, {
      headers: {
        token: 'Bearer ' + JSON.parse(localStorage.getItem('user')).accessToken,
      },
    });
    toast.success('Payroll Added Successfully.');
    dispatch(ADD_PAYROLL_SUCCESS(res.data));

    //discount products quantity
  } catch (error) {
    dispatch(ADD_PAYROLL_FAILURE(error));
    toast.error(error.response.data.message);
  }
};

//update payroll
export const updatePayroll = async (dispatch, payroll) => {
  dispatch(UPDATE_PAYROLL_START());
  try {
    const res = await axiosI.put('payroll/' + payroll._id, payroll, {
      headers: {
        token: 'Bearer ' + JSON.parse(localStorage.getItem('user')).accessToken,
      },
    });
    toast.success('Payroll Updated Successfully.');
    dispatch(UPDATE_PAYROLL_SUCCESS(res.data));
  } catch (error) {
    dispatch(UPDATE_PAYROLL_FAILURE(error));
    toast.error(error.response.data.message);
  }
};
