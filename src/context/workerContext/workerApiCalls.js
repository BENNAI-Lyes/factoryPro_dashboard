import { toast } from "react-toastify";
import { axiosI } from "../../config";
import {
  ADD_WORKER_FAILURE,
  ADD_WORKER_START,
  ADD_WORKER_SUCCESS,
  DELETE_WORKER_FAILURE,
  DELETE_WORKER_START,
  DELETE_WORKER_SUCCESS,
  GET_WORKERS_FAILURE,
  GET_WORKERS_START,
  GET_WORKERS_SUCCESS,
} from "./workerContextActions";

//get workers
export const getWorkers = async (dispatch) => {
  dispatch(GET_WORKERS_START());
  try {
    const res = await axiosI.get("worker", {
      headers: {
        token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
      },
    });
    dispatch(GET_WORKERS_SUCCESS(res.data));
  } catch (error) {
    toast.error(error.response.data.message);
    dispatch(GET_WORKERS_FAILURE(error));
  }
};

//delete worker
export const deleteWorker = async (dispatch, id) => {
  dispatch(DELETE_WORKER_START());
  try {
    await axiosI.delete("worker/" + id, {
      headers: {
        token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
      },
    });
    toast.success("Worker Deleted successfully.");
    dispatch(DELETE_WORKER_SUCCESS(id));
  } catch (error) {
    toast.error(error.response.data.message);
    dispatch(DELETE_WORKER_FAILURE(error));
  }
};

//add worker
export const addWorker = async (dispatch, worker) => {
  dispatch(ADD_WORKER_START());
  try {
    const res = await axiosI.post("worker", worker, {
      headers: {
        token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
      },
    });
    dispatch(ADD_WORKER_SUCCESS(res.data));
    toast.success("Worker Added successfully.");
  } catch (error) {
    toast.error(error.response.data.message);
    dispatch(ADD_WORKER_FAILURE(error));
  }
};

//update worker
export const updateWorker = async (dispatch, worker) => {
  dispatch(ADD_WORKER_START());
  try {
    const res = await axiosI.put("worker/" + worker._id, worker, {
      headers: {
        token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
      },
    });
    dispatch(ADD_WORKER_SUCCESS(res.data));
    toast.success("Worker Updated successfully.");
  } catch (error) {
    toast.error(error.response.data.message);
    dispatch(ADD_WORKER_FAILURE(error));
  }
};
