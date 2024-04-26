const ClientsReducer = (state, action) => {
  switch (action.type) {
    //get clients
    case 'GET_CLIENTS_START':
      return {
        isFetching: true,
        clients: [],
        error: false,
      };
    case 'GET_CLIENTS_SUCCESS':
      return {
        isFetching: false,
        clients: action.payload,
        error: false,
      };
    case 'GET_CLIENTS_FAILURE':
      return {
        isFetching: false,
        clients: [],
        error: action.payload,
      };

    //get client
    case 'GET_CLIENT_START':
      return {
        isFetching: true,
        clients: [],
        error: false,
      };
    case 'GET_CLIENT_SUCCESS':
      return {
        isFetching: false,
        clients: action.payload,
        error: false,
      };
    case 'GET_CLIENT_FAILURE':
      return {
        isFetching: false,
        clients: [],
        error: action.payload,
      };

    //delete clients
    case 'DELETE_CLIENT_START':
      return {
        ...state,
        isFetching: true,
        error: false,
      };
    case 'DELETE_CLIENT_SUCCESS':
      return {
        isFetching: false,
        error: false,
        clients: state.clients.filter(
          (client) => client._id !== action.payload
        ),
      };
    case 'DELETE_CLIENT_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.payload,
      };

    //add client
    case 'ADD_CLIENT_START':
      return {
        ...state,
        isFetching: true,
        error: false,
      };
    case 'ADD_CLIENT_SUCCESS':
      return {
        isFetching: false,
        error: false,
        clients: [...state.clients, action.payload],
      };
    case 'ADD_CLIENT_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.payload,
      };

    //update client
    case 'UPDATE_CLIENT_START':
      return {
        ...state,
        isFetching: true,
        error: false,
      };
    case 'UPDATE_CLIENT_SUCCESS':
      return {
        isFetching: false,
        error: false,
        clients: state.clients.map(
          (client) => client._id === action.payload._id && action.payload
        ),
      };
    case 'UPDATE_CLIENT_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.payload,
      };

    default:
      return { ...state };
  }
};

export default ClientsReducer;
