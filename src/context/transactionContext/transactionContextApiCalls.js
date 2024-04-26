import { toast } from "react-toastify";
import { axiosI } from "../../config";
import {
  ADD_TRANSACTION_FAILURE,
  ADD_TRANSACTION_START,
  ADD_TRANSACTION_SUCCESS,
  DELETE_TRANSACTION_FAILURE,
  DELETE_TRANSACTION_START,
  DELETE_TRANSACTION_SUCCESS,
  GET_TRANSACTIONS_FAILURE,
  GET_TRANSACTIONS_START,
  GET_TRANSACTIONS_SUCCESS,
} from "./transactionContextActions";

//get transactions
export const getTransactions = async (dispatch, id) => {
  dispatch(GET_TRANSACTIONS_START());
  try {
    const res = await axiosI.get("transaction/" + id, {
      headers: {
        token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
      },
    });
    dispatch(GET_TRANSACTIONS_SUCCESS(res.data));
  } catch (error) {
    toast.error(error.response.data.message);
    dispatch(GET_TRANSACTIONS_FAILURE(error));
  }
};

//delete transaction
export const deleteTransaction = async (dispatch, id) => {
  dispatch(DELETE_TRANSACTION_START());
  try {
    await axiosI.delete("transaction/" + id, {
      headers: {
        token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
      },
    });
    toast.success("Transaction Deleted successfully.");
    dispatch(DELETE_TRANSACTION_SUCCESS(id));
  } catch (error) {
    toast.error(error.response.data.message);
    dispatch(DELETE_TRANSACTION_FAILURE(error));
  }
};

//add transaction
export const addTransaction = async (dispatch, transaction) => {
  dispatch(ADD_TRANSACTION_START());
  try {
    const res = await axiosI.post("transaction", transaction, {
      headers: {
        token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
      },
    });
    dispatch(ADD_TRANSACTION_SUCCESS(res.data));
    toast.success("Transaction Added successfully.");
  } catch (error) {
    toast.error(error.response.data.message);
    dispatch(ADD_TRANSACTION_FAILURE(error));
  }
};

//update transaction
export const updateTransaction = async (dispatch, transaction) => {
  dispatch(ADD_TRANSACTION_START());
  try {
    const res = await axiosI.put(
      "transaction/" + transaction._id,
      transaction,
      {
        headers: {
          token:
            "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
        },
      }
    );
    dispatch(ADD_TRANSACTION_SUCCESS(res.data));
    toast.success("Transaction Updated successfully.");
  } catch (error) {
    toast.error(error.response.data.message);
    dispatch(ADD_TRANSACTION_FAILURE(error));
  }
};
