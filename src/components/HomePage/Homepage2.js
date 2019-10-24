import React, { useState, useEffect, useRef } from 'react';
import LoginModal from '../LoginModal';
import PhotoCapture from '../PhotoCapture';
import RoomList from '../RoomList';
import './HomePage.scss';
import { domain } from '../../constants/index';

const HomePage = props => {
  const [showModal, setShowModal] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [isItems, setIsItems] = useState(false);

  const loadRooms = () => {
    props.fetchRooms(props.user._id);
  };

  const inputElement = useRef(null);

  useEffect(() => {
    props.checkLogin();
  }, []);

  useEffect(() => {
    if (props.user._id) {
      loadRooms();
    }
  }, [props.user._id, props.rooms.length, showCamera]);

  const searchItem = async searchString => {
    if (searchString.length) {
      // TODO: query string...
      const data = await fetch(
        `http://${domain}{:4000/search_item/${props.user._id}/${searchString}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': true,
          },
        }
      );

      const res = await data.json();

      console.log(res);

      // console.log(found);
    }
  };

  const toggleModal = () => {
    if (showModal) {
      setShowModal(false);
    } else {
      setShowModal(true);
    }
  };

  const toggleRegisterForm = () => {
    if (showRegisterForm) {
      setShowRegisterForm(false);
    } else {
      setShowRegisterForm(true);
    }
  };

  const handleLogoutClick = async () => {
    await window.open(`http://${domain}:4000/auth/logout`, '_self');
    props.logoutUser();
  };

  return (
    <div className='outermost-container'>
      {props.authenticated ? (
        <div className='home-text'>
          <h2>Welcome, {props.user.name}</h2>
          <h3 onClick={handleLogoutClick}>Sign out </h3>
          <input
            type='text'
            placeholder='search for an item!'
            onChange={() => {
              searchItem(inputElement.current.value);
            }}
            ref={inputElement}
          />
          <div>
            {!showCamera && (
              <button onClick={() => setShowCamera(true)}>Click here</button>
            )}
            {showCamera && (
              <PhotoCapture user={props.user} setShowCamera={setShowCamera} isItems={isItems} />
            )}
            <RoomList
              rooms={props.rooms}
              loadingRooms={props.loadingRooms}
              errorFetchRooms={props.errorFetchRooms}
              userId={props.user._id}
              deleteRoom={props.deleteRoom}
              setCurrentRoom={props.setCurrentRoom}
            />
          </div>
        </div>
      ) : (
        <>
          <div className='home-text'>
            <h2>Welcome to Thingdex</h2>
            <h3 onClick={toggleModal}>Sign In</h3>
            <LoginModal
              showModal={showModal}
              handleClose={toggleModal}
              showRegisterForm={showRegisterForm}
              toggleRegisterForm={toggleRegisterForm}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;
