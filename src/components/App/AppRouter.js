import React from 'react';
import HomePage from '../HomePage';
import Room from '../Room';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchUser, logoutUser } from '../../actions/userActions';
import {
  fetchRooms,
  fetchRoom,
  deleteRoom,
  setCurrentRoom,
  addRoom,
} from '../../actions/roomActions';
import {
  fetchLocations,
  addLocation,
  deleteLocation,
} from '../../actions/locationActions';

const AppRouter = props => {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path='/'>
            <HomePage
              
              checkLogin={props.fetchUser}
              logout={props.logoutUser}
              
              user={props.userStates.user}
              loadingUser={props.userStates.loading}
              errorFetchUser={props.userStates.error}
              authenticated={props.userStates.authenticated}
              
              rooms={props.roomStates.rooms}
              loadingRooms={props.roomStates.loading}
              errorFetchRooms={props.roomStates.error}
              

              addRoom={props.addRoom}
              deleteRoom={props.deleteRoom}
              fetchRooms={props.fetchRooms}
            />
          </Route>
          <Route path='/user/:userId/room/:roomId'>
            <Room
              user={props.userStates.user}
              room={props.roomStates.room}
              isLoadingRoom={props.roomStates.loading}
              errorFetchRoom={props.roomStates.error}

              fetchRoom={props.fetchRoom}

              addLocation={props.addLocation}
              deleteLocation={props.deleteLocation}
              fetchLocations={props.fetchLocations}

              locationListStates={props.locationStates}
            />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

const mapStateToProps = state => ({

  userStates: state.loginReducer,

  roomStates: state.roomReducer,

  locationStates: state.locationReducer
});

const mapDispatchToProps = {
  fetchRooms,
  fetchRoom,
  addRoom,
  deleteRoom,
  setCurrentRoom,

  logoutUser,
  fetchUser,

  fetchLocations,
  addLocation,
  deleteLocation,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppRouter);
