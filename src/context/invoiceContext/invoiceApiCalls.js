import { toast } from "react-toastify";
import { axiosI } from "../../config";

import {
  ADD_INVOICE_FAILURE,
  ADD_INVOICE_START,
  ADD_INVOICE_SUCCESS,
  DELETE_INVOICE_FAILURE,
  DELETE_INVOICE_START,
  DELETE_INVOICE_SUCCESS,
  GET_INVOICES_FAILURE,
  GET_INVOICES_START,
  GET_INVOICES_SUCCESS,
} from "./invoiceContextActions";

//get invoices
export const getInvoices = async (dispatch) => {
  dispatch(GET_INVOICES_START());
  try {
    const res = await axiosI.get("facture", {
      headers: {
        token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
      },
    });
    dispatch(GET_INVOICES_SUCCESS(res.data));
  } catch (error) {
    toast.error(error.response.data.message);
    dispatch(GET_INVOICES_FAILURE(error));
  }
};

//delete invoice
export const deleteInvoice = async (dispatch, id) => {
  dispatch(DELETE_INVOICE_START());
  try {
    await axiosI.delete("facture/" + id, {
      headers: {
        token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
      },
    });
    toast.success("Invoice Deleted successfully.");
    dispatch(DELETE_INVOICE_SUCCESS(id));
  } catch (error) {
    toast.error(error.response.data.message);
    dispatch(DELETE_INVOICE_FAILURE(error));
  }
};

//add invoice
export const addInvoice = async (dispatch, invoice) => {
  dispatch(ADD_INVOICE_START());
  try {
    const res = await axiosI.post("facture", invoice, {
      headers: {
        token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
      },
    });
    dispatch(ADD_INVOICE_SUCCESS(res.data));
    toast.success("Invoice Added successfully.");
  } catch (error) {
    toast.error(error.response.data.message);
    dispatch(ADD_INVOICE_FAILURE(error));
  }
};

//update invoice
export const updateInvoice = async (dispatch, invoice) => {
  dispatch(ADD_INVOICE_START());
  try {
    const res = await axiosI.put("facture/" + invoice._id, invoice, {
      headers: {
        token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
      },
    });
    dispatch(ADD_INVOICE_SUCCESS(res.data));
    toast.success("Invoice Updated successfully.");
  } catch (error) {
    toast.error(error.response.data.message);
    dispatch(ADD_INVOICE_FAILURE(error));
  }
};
