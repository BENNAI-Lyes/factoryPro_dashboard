import { toast } from "react-toastify";
import { axiosI } from "../../config";
import {
  ADD_RETURN_PRODUCT_FAILURE,
  ADD_RETURN_PRODUCT_START,
  ADD_RETURN_PRODUCT_SUCCESS,
  GET_RETURN_PRODUCTS_FAILURE,
  GET_RETURN_PRODUCTS_START,
  GET_RETURN_PRODUCTS_SUCCESS,
  GET_RETURN_PRODUCT_STATS_FAILURE,
  GET_RETURN_PRODUCT_STATS_START,
  GET_RETURN_PRODUCT_STATS_SUCCESS,
  DELETE_RETURN_PRODUCT_START,
  DELETE_RETURN_PRODUCT_SUCCESS,
  DELETE_RETURN_PRODUCT_FAILURE,
  UPDATE_RETURN_PRODUCT_START,
  UPDATE_RETURN_PRODUCT_SUCCESS,
  UPDATE_RETURN_PRODUCT_FAILURE,
} from "./returnProductContextActions";

//get returned products
export const getReturnProducts = async (dispatch) => {
  dispatch(GET_RETURN_PRODUCTS_START());
  try {
    const res = await axiosI.get("returnProduct", {
      headers: {
        token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
      },
    });
    dispatch(GET_RETURN_PRODUCTS_SUCCESS(res.data));
  } catch (error) {
    dispatch(GET_RETURN_PRODUCTS_FAILURE(error));
    toast.error(error.response.data.message);
  }
};

//get returned products
export const getReturnProductStats = async (dispatch) => {
  dispatch(GET_RETURN_PRODUCT_STATS_START());
  try {
    const res = await axiosI.get("returnProduct/stats", {
      headers: {
        token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
      },
    });
    dispatch(GET_RETURN_PRODUCT_STATS_SUCCESS(res.data));
  } catch (error) {
    dispatch(GET_RETURN_PRODUCT_STATS_FAILURE(error));
    toast.error(error.response.data.message);
  }
};

//delete returnedProduct
export const deleteReturnedProduct = async (dispatch, id) => {
  dispatch(DELETE_RETURN_PRODUCT_START());
  try {
    await axiosI.delete("returnProduct/" + id, {
      headers: {
        token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
      },
    });
    toast.success("Returned Product Deleted Successfully.");
    dispatch(DELETE_RETURN_PRODUCT_SUCCESS(id));
  } catch (error) {
    dispatch(DELETE_RETURN_PRODUCT_FAILURE(error));
    toast.error(error.response.data.message);
  }
};

//add returnedProduct
export const addReturnProduct = async (dispatch, returnProduct) => {
  dispatch(ADD_RETURN_PRODUCT_START());
  try {
    const res = await axiosI.post("returnProduct/", returnProduct, {
      headers: {
        token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
      },
    });
    toast.success("Returned Products Added Successfully.");
    dispatch(ADD_RETURN_PRODUCT_SUCCESS(res.data));

    //discount products quantity
  } catch (error) {
    dispatch(ADD_RETURN_PRODUCT_FAILURE(error));
    toast.error(error.response.data.message);
  }
};

// //update returnedProduct
export const updateReturnedProduct = async (dispatch, id, returnedProduct) => {
  dispatch(UPDATE_RETURN_PRODUCT_START());
  try {
    const res = await axiosI.put("returnProduct/" + id, returnedProduct, {
      headers: {
        token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
      },
    });
    toast.success("Return Products Updated Successfully.");
    dispatch(UPDATE_RETURN_PRODUCT_SUCCESS(res.data));
  } catch (error) {
    dispatch(UPDATE_RETURN_PRODUCT_FAILURE(error));
    toast.error(error.response.data.message);
  }
};
