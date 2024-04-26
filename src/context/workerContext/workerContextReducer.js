const WorkersReducer = (state, action) => {
  switch (action.type) {
    //get workers
    case "GET_WORKERS_START":
      return {
        isFetching: true,
        workers: [],
        error: false,
      };
    case "GET_WORKERS_SUCCESS":
      return {
        isFetching: false,
        workers: action.payload,
        error: false,
      };
    case "GET_WORKERS_FAILURE":
      return {
        isFetching: false,
        workers: [],
        error: action.payload,
      };

    //delete workers
    case "DELETE_WORKER_START":
      return {
        ...state,
        isFetching: true,
        error: false,
      };
    case "DELETE_WORKER_SUCCESS":
      return {
        isFetching: false,
        error: false,
        workers: state.workers.filter(
          (worker) => worker._id !== action.payload
        ),
      };
    case "DELETE_WORKER_FAILURE":
      return {
        ...state,
        isFetching: false,
        error: action.payload,
      };

    //add worker
    case "ADD_WORKER_START":
      return {
        ...state,
        isFetching: true,
        error: false,
      };
    case "ADD_WORKER_SUCCESS":
      return {
        isFetching: false,
        error: false,
        workers: [...state.workers, action.payload],
      };
    case "ADD_WORKER_FAILURE":
      return {
        ...state,
        isFetching: false,
        error: action.payload,
      };

    //update worker
    case "UPDATE_WORKER_START":
      return {
        ...state,
        isFetching: true,
        error: false,
      };
    case "UPDATE_WORKER_SUCCESS":
      return {
        isFetching: false,
        error: false,
        workers: state.workers.map(
          (worker) => worker._id === action.payload._id && action.payload
        ),
      };
    case "UPDATE_WORKER_FAILURE":
      return {
        ...state,
        isFetching: false,
        error: action.payload,
      };

    default:
      return { ...state };
  }
};

export default WorkersReducer;
