import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import LocationList from '../LocationList';
import { Link } from 'react-router-dom';
import './Room.scss';
import { Icon } from 'antd';
import { domain } from '../../constants';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

const Room = props => {
  console.log('Room', props.count)
  const { userId, roomId } = useParams();
  const [predictLoading, setPredictLoading] = useState(false);
  const [previewSrc, setPreviewSrc] = useState('//:0');
  const [renderedInputs, setRenderedInputs] = useState([]);
  const [showLocationSubmitBtn, setShowLocationSubmitBtn] = useState(false);
  const [showCanvasContainer, setShowCanvasContainer] = useState(false);

  const loadingIcon = (
    <div className='loading-room-icon'>
      Loading Room... <Icon type='loading' />
    </div>
  );

  const predictLoadingIcon = (
    <div className='loading-predict-icon'>
      Predicting... <Icon type='loading' />
    </div>
  );

  useEffect(() => {
    props.fetchRoom(userId, roomId);
    props.fetchLocations(userId, roomId);
  }, []);

  const deleteInput = event => {
    event.target.parentElement.remove();
  };

  const renderInputs = detectedItems => {
    if (detectedItems.length) {
      return detectedItems.map(detectedItem => {
        if (detectedItem.score && detectedItem.class) {
          return (
            <label key={detectedItem.score}>
              Detected: {detectedItem.class} with a score of{' '}
              {detectedItem.score.toFixed(2)}
              <br />
              <input
                id='item-name-input'
                type='text'
                name='item'
                defaultValue={detectedItem.class}
                placeholder='enter item'
                required
              />
              <button onClick={e => deleteInput(e)}>Delete</button>
              <br />
            </label>
          );
        }
      });
    } else {
      return [
        <label key={Math.random()}>
          <input
            id='item-name-input'
            type='text'
            name='item'
            placeholder='enter item'
            required
          />
          <button onClick={e => deleteInput(e)}>Delete</button>
          <br />
        </label>,
      ];
    }
  };

  const predictImg = async () => {
    console.log('predict image called');
    const capturedImage = document.getElementById('location-preview');
    let modelPromise = cocoSsd.load('mobilenet_v2');
    const model = await modelPromise;
    const result = await model.detect(capturedImage);

    console.log('prediction result', result);

    const c = document.createElement('canvas');

    c.width = capturedImage.width;
    c.height = capturedImage.height;

    const context = c.getContext('2d');
    context.drawImage(capturedImage, 0, 0);
    context.font = '10px Arial';

    console.log('number of detections: ', result.length);

    for (let i = 0; i < result.length; i++) {
      context.beginPath();
      context.rect(...result[i].bbox);
      context.lineWidth = 1;
      context.strokeStyle = 'green';
      context.fillStyle = 'green';
      context.stroke();
      context.fillText(
        result[i].score.toFixed(2) + ' ' + result[i].class,
        result[i].bbox[0],
        result[i].bbox[1] > 10 ? result[i].bbox[1] - 5 : 10
      );
    }

    const canvasContainer = document.querySelector('.canvas-container');
    if (canvasContainer.hasChildNodes()) {
      canvasContainer.removeChild(canvasContainer.childNodes[0]);
    }
    canvasContainer.appendChild(c);
    if (result) {
      setRenderedInputs(renderInputs(result));
    } else {
      setRenderedInputs(renderInputs([]));
    }
  };

  const handleSubmit = event => {
    event.preventDefault();

    const locationForm = document.querySelector('.location-form');
    const formData = new FormData(locationForm);

    props.addLocation(formData, userId, roomId);
    setPreviewSrc('//:0');
    alert('new location has been added');
  };

  const calculateAspectRatioFit = (
    srcWidth,
    srcHeight,
    maxWidth,
    maxHeight
  ) => {
    var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

    return { width: srcWidth * ratio, height: srcHeight * ratio };
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

        const { width: newWidth, height: newHeight } = calculateAspectRatioFit(
          width,
          height,
          MAX_WIDTH,
          MAX_HEIGHT
        );

        canvas.width = newWidth;
        canvas.height = newHeight;

        context = canvas.getContext('2d');
        context.drawImage(image, 0, 0, newWidth, newHeight);
        var dataUrl = canvas.toDataURL('image/png');
        setPreviewSrc(dataUrl);
      };
      image.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const addInputItem = () => {
    console.log(renderedInputs);
    setRenderedInputs(
      renderedInputs.concat(
        <label key={Math.random()}>
          <input
            id='item-name-input'
            type='text'
            name='item'
            placeholder='enter item'
            required
          />
          <button onClick={e => deleteInput(e)}>Delete</button>
          <br />
        </label>
      )
    );
  };

  const handleLogoutClick = async () => {
    await window.open(`${domain}/auth/logout`, '_self');
  };
  return (
    <div className='outermost-container'>
      <div className='room-container'>
        {props.isLoadingRoom ? (
          loadingIcon
        ) : (
          <>
            <div className='room-header'>
              <Link to='/'>
                <Icon className='home-button' type='home' />
              </Link>
              <h2>Currently viewing: {props.room.name}</h2>
              <Icon
                className='sign-out-button'
                onClick={() => handleLogoutClick()}
                type='logout'
              />
            </div>
            <img
              className='room-image'
              src={props.room.imageUrl}
              alt='room-img'
            />
          </>
        )}
        <form
          className='location-form'
          onSubmit={event => {
            handleSubmit(event);
            setShowLocationSubmitBtn(false);
            setShowCanvasContainer(false);
          }}
          encType='multipart/form-data'
        >
          <label
            className='image-upload-label'
            htmlFor='location-image-upload-input'
          >
            {!predictLoading &&
              !showLocationSubmitBtn &&
              !props.isLoadingRoom && (
                <p className='add-new-location-text'>Add New Location +</p>
              )}
            {predictLoading && predictLoadingIcon}
            {showCanvasContainer && <div className='canvas-container'></div>}
            <img
              id='location-preview'
              src={previewSrc}
              alt='location-preview-img'
            />
          </label>
          {showLocationSubmitBtn && (
            <label className='location-name-label'>
              Location Name:
              <input
                id='location-name-input'
                type='text'
                name='location'
                placeholder='enter location'
                required
              />
            </label>
          )}

          {showLocationSubmitBtn && (
            <div className='field'>{renderedInputs}</div>
          )}

          {showLocationSubmitBtn && (
            <button onClick={addInputItem}>Add Item</button>
          )}
          {showLocationSubmitBtn && (
            <button type='submit'>Add This Location</button>
          )}

          <input
            id='location-image-upload-input'
            name='image'
            type='file'
            accept='image/*'
            capture='camera'
            onChange={async e => { 
              handleImageResizing(e);
              console.log('handleimage resizing done');
              await setPredictLoading(true);
              console.log('setpredictloading done')
              await setShowCanvasContainer(true);
              console.log('setshow canvas container done')
              await predictImg();
              await setShowLocationSubmitBtn(true);
              await setPredictLoading(false);
            }}
            required
          />
        </form>
        <LocationList
          locations={props.locationListStates.locations}
          isLoadingLocations={props.locationListStates.loading}
          errorFetchLocations={props.locationListStates.error}
          deleteLocation={props.deleteLocation}
        />
      </div>
    </div>
  );
};

export default Room;
