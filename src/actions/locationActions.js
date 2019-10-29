import { domain } from '../constants';

export const FETCH_LOCATIONS_BEGIN = 'FETCH_LOCATIONS_BEGIN';
export const FETCH_LOCATIONS_SUCCESS = 'FETCH_LOCATIONS_SUCCESS';
export const FETCH_LOCATIONS_FAILURE = 'FETCH_LOCATIONS_FAILURE';

export const ADD_LOCATION_SUCCESS = 'ADD_LOCATION_SUCCESS';
export const DELETE_LOCATION_SUCCESS = 'DELETE_LOCATION';

const handleErrors = response => {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response.json();
};

export const fetchLocationsBegin = () => ({
  type: FETCH_LOCATIONS_BEGIN,
});
export const fetchLocationsSuccess = locations => ({
  type: FETCH_LOCATIONS_SUCCESS,
  payload: { locations },
});
export const fetchLocationsFailure = error => ({
  type: FETCH_LOCATIONS_FAILURE,
  payload: { error },
});

export const addLocationSuccess = location => ({
  type: ADD_LOCATION_SUCCESS,
  payload: { location },
});

export const deleteLocationSuccess = locationId => ({
  type: DELETE_LOCATION_SUCCESS,
  payload: { locationId },
});

export const fetchLocations = (userId, roomId) => {
  return dispatch => {
    dispatch(fetchLocationsBegin());
    return fetch(`${domain}/api/users/${userId}/rooms/${roomId}/locations`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': true,
      },
    })
      .then(handleErrors)
      .then(locations => {
        dispatch(fetchLocationsSuccess(locations));
        return locations;
      })
      .catch(error => dispatch(fetchLocationsFailure(error)));
  }
}

export const addLocation = (formData, userId, roomId) => {
  return dispatch => {
    return fetch(
      `${domain}/api/users/${userId}/rooms/${roomId}/locations/`,
      {
        method: 'POST',
        body: formData,
        credentials: 'include',
      }
    ).then(handleErrors)
     .then(location => {
       console.log(location);
       dispatch(addLocationSuccess(location))
     });
  };
};

export const deleteLocation = (userId, roomId, locationId) => {
  return dispatch => {
    return fetch(
      `${domain}/api/users/${userId}/rooms/${roomId}/locations/${locationId}`,
      {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Credentials': true,
        },
      }
    )
      .then(handleErrors)
      .then(res => {
        dispatch(deleteLocationSuccess(locationId));
        alert('Successfully deleted location')
        console.log(res);
        return res;
      })
      .catch(error => console.log(error));
  };
};
