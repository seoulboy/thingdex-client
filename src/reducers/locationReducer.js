import {
  FETCH_LOCATIONS_BEGIN,
  FETCH_LOCATIONS_SUCCESS,
  FETCH_LOCATIONS_FAILURE,
  ADD_LOCATION_SUCCESS,
  DELETE_LOCATION_SUCCESS,
} from '../actions/locationActions';

const initialState = {
  loading: false,
  locations: [],
  error: null,
};

const locationReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_LOCATIONS_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_LOCATIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        locations: action.payload.locations,
      };
    case FETCH_LOCATIONS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    case ADD_LOCATION_SUCCESS:
      state.locations = state.locations.concat(action.payload.location);
      console.log(state);
      return {
        ...state,
      };
    case DELETE_LOCATION_SUCCESS:
      state.locations = state.locations.filter(
        room => room._id !== action.payload.locationId
      );
      return {
        ...state,
      };
    default:
      return state;
  }
};

export default locationReducer;
