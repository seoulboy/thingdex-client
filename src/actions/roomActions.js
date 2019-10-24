import { domain } from '../constants';

export const FETCH_ROOMS_BEGIN = 'FETCH_ROOMS_BEGIN';
export const FETCH_ROOMS_SUCCESS = 'FETCH_ROOMS_SUCCESS';
export const FETCH_ROOMS_FAILURE = 'FETCH_ROOMS_FAILURE';

export const FETCH_ROOM_BEGIN = 'FETCH_ROOM_BEGIN';
export const FETCH_ROOM_SUCCESS = 'FETCH_ROOM_SUCCESS';
export const FETCH_ROOM_FAILURE = 'FETCH_ROOM_FAILURE';

export const ADD_ROOM_SUCCESS = 'ADD_ROOM_SUCCESS';
export const DELETE_ROOM_SUCCESS = 'DELETE_ROOM';
export const SET_CURRENT_ROOM = 'SET_CURRENT_ROOM';

export const fetchRoomsBegin = () => ({
  type: FETCH_ROOMS_BEGIN,
});
export const fetchRoomsSuccess = rooms => ({
  type: FETCH_ROOMS_SUCCESS,
  payload: { rooms },
});
export const fetchRoomsFailure = error => ({
  type: FETCH_ROOMS_FAILURE,
  payload: { error },
});

export const fetchRoomBegin = () => ({
  type: FETCH_ROOM_BEGIN,
});

export const fetchRoomSuccess = room => ({
  type: FETCH_ROOM_SUCCESS,
  payload: { room },
});

export const fetchRoomFailure = error => ({
  type: FETCH_ROOM_FAILURE,
  payload: { error },
});

export const addRoomSuccess = room => ({
  type: ADD_ROOM_SUCCESS,
  payload: { room },
});

export const deleteRoomSuccess = roomId => ({
  type: DELETE_ROOM_SUCCESS,
  payload: { roomId },
});

export const setCurrentRoom = room => ({
  type: SET_CURRENT_ROOM,
  payload: { room },
});

export const addRoom = (formData, userId) => {
  return dispatch => {
    return fetch(`http://${domain}:4000/api/users/${userId}/rooms/`, {
      method: 'POST',
      body: formData,
    })
      .then(handleErrors)
      .then(room => {
        console.log(room);
        dispatch(addRoomSuccess(room));
      });
  };
};

export const deleteRoom = (userId, roomId) => {
  return dispatch => {
    return fetch(`http://${domain}:4000/api/users/${userId}/rooms/${roomId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': true,
      },
    })
      .then(handleErrors)
      .then(res => {
        dispatch(deleteRoomSuccess(roomId));
        return res;
      })
      .catch(error => console.log(error));
  };
};

export const fetchRoom = (userId, roomId) => {
  return dispatch => {
    dispatch(fetchRoomBegin());
    return fetch(`http://${domain}:4000/api/users/${userId}/rooms/${roomId}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': true,
      },
    })
      .then(handleErrors)
      .then(room => {
        dispatch(fetchRoomSuccess(room));
        return room;
      })
      .catch(error => dispatch(fetchRoomFailure(error)));
  };
};

export const fetchRooms = userId => {
  return dispatch => {
    dispatch(fetchRoomsBegin());
    return fetch(`http://${domain}:4000/api/users/${userId}/rooms/`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': true,
      },
    })
      .then(handleErrors)
      .then(rooms => {
        dispatch(fetchRoomsSuccess(rooms));
        return rooms;
      })
      .catch(error => dispatch(fetchRoomsFailure(error)));
  };
};

const handleErrors = response => {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response.json();
};
