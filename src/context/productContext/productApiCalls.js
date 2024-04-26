import { toast } from "react-toastify";
import { axiosI } from "../../config";
import {
  ADD_PRODUCT_FAILURE,
  ADD_PRODUCT_START,
  ADD_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAILURE,
  DELETE_PRODUCT_START,
  DELETE_PRODUCT_SUCCESS,
  GET_PRODUCTS_FAILURE,
  GET_PRODUCTS_START,
  GET_PRODUCTS_SUCCESS,
  GET_PRODUCT_FAILURE,
  GET_PRODUCT_START,
  GET_PRODUCT_SUCCESS,
} from "./productContextActions";

//get products
export const getProducts = async (dispatch) => {
  dispatch(GET_PRODUCTS_START());
  try {
    const res = await axiosI.get("product", {
      headers: {
        token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
      },
    });
    dispatch(GET_PRODUCTS_SUCCESS(res.data));
  } catch (error) {
    toast.error(error.response.data.message);
    dispatch(GET_PRODUCTS_FAILURE(error));
  }
};

//get one product
export const getProduct = async (dispatch, id) => {
  dispatch(GET_PRODUCT_START());
  try {
    await axiosI.get("product/find/" + id, {
      headers: {
        token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
      },
    });
    // toast.success("Product Deleted successfully.");
    dispatch(GET_PRODUCT_SUCCESS(id));
  } catch (error) {
    toast.error(error.response.data.message);
    dispatch(GET_PRODUCT_FAILURE(error));
  }
};

//delete product
export const deleteProduct = async (dispatch, id) => {
  dispatch(DELETE_PRODUCT_START());
  try {
    await axiosI.delete("product/" + id, {
      headers: {
        token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
      },
    });
    toast.success("Product Deleted successfully.");
    dispatch(DELETE_PRODUCT_SUCCESS(id));
  } catch (error) {
    toast.error(error.response.data.message);
    dispatch(DELETE_PRODUCT_FAILURE(error));
  }
};

//add product
export const addProduct = async (dispatch, product) => {
  dispatch(ADD_PRODUCT_START());
  try {
    const res = await axiosI.post("product", product, {
      headers: {
        token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
      },
    });
    dispatch(ADD_PRODUCT_SUCCESS(res.data));
    toast.success("Product Added successfully.");
  } catch (error) {
    toast.error(error.response.data.message);
    dispatch(ADD_PRODUCT_FAILURE(error));
  }
};

//update product
export const updateProduct = async (dispatch, product) => {
  dispatch(ADD_PRODUCT_START());
  try {
    const res = await axiosI.put("product/" + product._id, product, {
      headers: {
        token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
      },
    });
    dispatch(ADD_PRODUCT_SUCCESS(res.data));
    toast.success("Product Updated successfully.");
  } catch (error) {
    toast.error(error.response.data.message);
    dispatch(ADD_PRODUCT_FAILURE(error));
  }
};
