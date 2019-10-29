import React, { useState, useEffect, useRef } from 'react';
import { domain } from '../../constants/index';
import SearchResultList from '../SearchResultList';
import LoginModal from '../LoginModal';
import RoomList from '../RoomList';
import { searchItem } from '../../api';
import './HomePage.scss';
import { Icon } from 'antd';
import { Link } from 'react-router-dom';

const HomePage = props => {
  const [showModal, setShowModal] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showSearchResultList, setShowSearchResultList] = useState(false);
  const [showRoomSubmitBtn, setShowRoomSubmitBtn] = useState(false);
  const [previewSrc, setPreviewSrc] = useState('//:0');
  const [searchResultData, setSearchResultData] = useState([]);

  const searchInput = useRef(null);

  useEffect(() => {
    props.checkLogin();
  }, []);

  useEffect(() => {
    if (props.user._id) {
      props.fetchRooms(props.user._id);
    }
  }, [props.user._id, props.rooms.length]);

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
    await window.open(`${domain}/auth/logout`, '_self');
    props.logout();
  };

  const handleSubmit = event => {
    event.preventDefault();
    const roomForm = document.querySelector('.room-form');
    const formData = new FormData(roomForm);
    props.addRoom(formData, props.user._id);
    setPreviewSrc('//:0');
  };

  const handleImageResizing = event => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = event => {
      const image = document.createElement('img');
      image.onload = () => {
        const canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        context.drawImage(image, 0, 0);

        const MAX_WIDTH = 320;
        const MAX_HEIGHT = 240;
        var width = image.width;
        var height = image.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        context = canvas.getContext('2d');
        context.drawImage(image, 0, 0, width, height);
        var dataUrl = canvas.toDataURL('image/png');
        setPreviewSrc(dataUrl);
      };
      image.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSearchItem = () => {
    const searchString = searchInput.current.value;

    const searchResultPromise = searchItem(searchString, props.user._id);

    Promise.resolve(searchResultPromise).then(res => {
      console.log(res);
      setSearchResultData(res);
    });
  };

  return (
    <div className='outermost-container'>
      {props.authenticated ? (
        <div className='home-text'>
          <div className='header-menu'>
            <Link to='/'>
              <Icon
                className='home-button'
                onClick={() => setShowSearchResultList(false)}
                type='home'
              />
            </Link>
            <h1 id='header'>thingdex</h1>
            <Icon
              className='sign-out-button'
              onClick={() => handleLogoutClick()}
              type='logout'
            />
          </div>
          <h3 className='welcome-text'>Welcome, {props.user.name}</h3>
          <input
            type='text'
            placeholder='search for an item!'
            ref={searchInput}
            onKeyUp={e => {
              if (e.keyCode === 13) {
                handleSearchItem();
                setShowSearchResultList(true);
              }
            }}
          />
          <button
            onClick={() => {
              handleSearchItem();
              setShowSearchResultList(true);
            }}
          >
            Search
          </button>
          {showSearchResultList && (
            <SearchResultList searchResults={searchResultData} />
          )}
          {!showSearchResultList && (
            <>
              <div className='room-form-container'>
                <form
                  className='room-form'
                  onSubmit={event => {
                    handleSubmit(event);
                    setShowRoomSubmitBtn(false);
                  }}
                  encType='multipart/form-data'
                >
                  {showRoomSubmitBtn && (
                    <label>
                      Room Name:
                      <input
                        id='room-name-input'
                        type='text'
                        name='name'
                        placeholder='enter room name'
                        required
                      />
                    </label>
                  )}

                  <label className='image-upload-label' htmlFor='image-upload'>
                    <Icon
                      className='open-camera'
                      type='camera'
                      theme='filled'
                    />
                    {showRoomSubmitBtn && (
                      <img id='preview' src={previewSrc} alt='' />
                    )}
                  </label>

                  {showRoomSubmitBtn && (
                    <button type='submit'>Add To My Room</button>
                  )}

                  <input
                    id='image-upload'
                    name='image'
                    type='file'
                    accept='image/*'
                    capture='camera'
                    onChange={e => {
                      handleImageResizing(e);
                      setShowRoomSubmitBtn(true);
                    }}
                    required
                  />
                </form>
              </div>
              <div>
                <RoomList
                  rooms={props.rooms}
                  loadingRooms={props.loadingRooms}
                  errorFetchRooms={props.errorFetchRooms}
                  userId={props.user._id}
                  deleteRoom={props.deleteRoom}
                />
              </div>
            </>
          )}
        </div>
      ) : (
        <>
          <div className='signin-container'>
            <div className='signin-row'>
              <h2>Welcome to Thingdex</h2>
              <h3 onClick={toggleModal}>Sign In</h3>
            </div>
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
