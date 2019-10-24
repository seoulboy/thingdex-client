import {
  FETCH_ROOMS_BEGIN,
  FETCH_ROOMS_SUCCESS,
  FETCH_ROOMS_FAILURE,
  FETCH_ROOM_BEGIN,
  FETCH_ROOM_SUCCESS,
  FETCH_ROOM_FAILURE,
  DELETE_ROOM_SUCCESS,
  ADD_ROOM_SUCCESS,
} from '../actions/roomActions';

const initalState = {
  loading: false,
  rooms: [],
  error: null,
  room: {},
};

const roomReducer = (state = initalState, action) => {
  switch (action.type) {
    case FETCH_ROOMS_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_ROOMS_SUCCESS:
      return {
        ...state,
        loading: false,
        rooms: action.payload.rooms,
      };
    case FETCH_ROOMS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    case FETCH_ROOM_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_ROOM_SUCCESS:
      return {
        ...state,
        loading: false,
        room: action.payload.room,
      };
    case FETCH_ROOM_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    case ADD_ROOM_SUCCESS:
      state.rooms = state.rooms.concat(action.payload.room);
      return {
        ...state,
      };
    case DELETE_ROOM_SUCCESS:
      state.rooms = state.rooms.filter(
        room => room._id !== action.payload.roomId
      );
      return {
        ...state,
      };
    default:
      return state;
  }
};

export default roomReducer;
