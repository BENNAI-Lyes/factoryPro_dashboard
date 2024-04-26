// get workers
export const GET_WORKERS_START = () => ({
  type: "GET_WORKERS_START",
});

export const GET_WORKERS_SUCCESS = (workers) => ({
  type: "GET_WORKERS_SUCCESS",
  payload: workers,
});

export const GET_WORKERS_FAILURE = (error) => ({
  type: "GET_WORKERS_FAILURE",
  payload: error,
});

// delete worker
export const DELETE_WORKER_START = () => ({
  type: "DELETE_WORKER_START",
});

export const DELETE_WORKER_SUCCESS = (id) => ({
  type: "DELETE_WORKER_SUCCESS",
  payload: id,
});

export const DELETE_WORKER_FAILURE = (error) => ({
  type: "DELETE_WORKER_FAILURE",
  payload: error,
});

// add worker
export const ADD_WORKER_START = () => ({
  type: "ADD_WORKER_START",
});

export const ADD_WORKER_SUCCESS = (worker) => ({
  type: "ADD_WORKER_SUCCESS",
  payload: worker,
});

export const ADD_WORKER_FAILURE = (error) => ({
  type: "ADD_WORKER_FAILURE",
  payload: error,
});

// update worker
export const UPDATE_WORKER_START = () => ({
  type: "UPDATE_WORKER_START",
});

export const UPDATE_WORKER_SUCCESS = (worker) => ({
  type: "UPDATE_WORKER_SUCCESS",
  payload: worker,
});

export const UPDATE_WORKER_FAILURE = (error) => ({
  type: "UPDATE_WORKER_FAILURE",
  payload: error,
});
