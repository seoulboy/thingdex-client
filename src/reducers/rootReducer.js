import { combineReducers } from 'redux';
import loginReducer from './loginReducer';
import roomReducer from './roomReducer';
import locationReducer from './locationReducer';

export default combineReducers({
  loginReducer,
  roomReducer,
  locationReducer,
});
