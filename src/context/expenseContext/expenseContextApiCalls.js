import { toast } from "react-toastify";
import { axiosI } from "../../config";
import {
  ADD_EXPENSE_FAILURE,
  ADD_EXPENSE_START,
  ADD_EXPENSE_SUCCESS,
  DELETE_EXPENSE_FAILURE,
  DELETE_EXPENSE_START,
  DELETE_EXPENSE_SUCCESS,
  GET_EXPENSES_FAILURE,
  GET_EXPENSES_START,
  GET_EXPENSES_SUCCESS,
  GET_EXPENSE_STATS_FAILURE,
  GET_EXPENSE_STATS_START,
  GET_EXPENSE_STATS_SUCCESS,
} from "./expenseContextActions";

//get expenses
export const getExpenses = async (dispatch) => {
  dispatch(GET_EXPENSES_START());
  try {
    const res = await axiosI.get("expense", {
      headers: {
        token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
      },
    });
    dispatch(GET_EXPENSES_SUCCESS(res.data));
  } catch (error) {
    dispatch(GET_EXPENSES_FAILURE(error));
    toast.error(error.response.data.message);
  }
};

//delete expense
export const deleteExpense = async (dispatch, id) => {
  dispatch(DELETE_EXPENSE_START());
  try {
    await axiosI.delete("expense/" + id, {
      headers: {
        token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
      },
    });
    toast.success("Expense Deleted Successfully.");
    dispatch(DELETE_EXPENSE_SUCCESS(id));
  } catch (error) {
    dispatch(DELETE_EXPENSE_FAILURE(error));
    toast.error(error.response.data.message);
  }
};

//add expense
export const addExpense = async (dispatch, expense) => {
  dispatch(ADD_EXPENSE_START());
  try {
    const res = await axiosI.post("expense/", expense, {
      headers: {
        token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
      },
    });
    toast.success("Expense Added Successfully.");
    dispatch(ADD_EXPENSE_SUCCESS(res.data));

    //discount products quantity
  } catch (error) {
    dispatch(ADD_EXPENSE_FAILURE(error));
    toast.error(error.response.data.message);
  }
};

//update expense
// export const updateBill = async (dispatch, expense) => {
//   dispatch(UPDATE_BILL_START());
//   try {
//     const res = await axiosI.put(
//      "expense/" + expense._id,
//       expense,
//       {
//         headers: {
//           token:
//             "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
//         },
//       }
//     );
//     toast.success("Expense Updated Successfully.");
//     dispatch(UPDATE_BILL_SUCCESS(res.data));
//   } catch (error) {
//     dispatch(UPDATE_BILL_FAILURE(error));
//     toast.error(error.response.data.message);
//   }
// };

//get expenses stats
export const getExpensesStats = async (dispatch) => {
  dispatch(GET_EXPENSE_STATS_START());
  try {
    const res = await axiosI.get("expense/stats", {
      headers: {
        token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
      },
    });

    dispatch(GET_EXPENSE_STATS_SUCCESS(res.data));
  } catch (error) {
    dispatch(GET_EXPENSE_STATS_FAILURE(error));
    toast.error(error.response.data.message);
  }
};
