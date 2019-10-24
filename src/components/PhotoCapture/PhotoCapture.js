import React, { useState, useEffect } from 'react';
import './PhotoCapture.scss';
import Photo from '../Photo';
import Camera from '../Camera';
import RoomForm from '../RoomForm';
import LocationForm from '../LocationForm';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

const PhotoCapture = props => {
  const [captured, setCaptured] = useState(false);
  const [base64, setBase64] = useState('');
  const [localStream, setLocalStream] = useState(null);
  const [detectedItems, setDetectedItems] = useState(null);

  const [constraints] = useState({
    audio: false,
    video: { facingMode: 'user' },
  });

  const addItem = () => {
    setDetectedItems(detectedItems.concat({}));
  };

  const deleteItem = item => {
    if (window.confirm(`Are you sure you want to remove this item?`)) {
      setDetectedItems(
        detectedItems.filter(detectedItem => detectedItem !== item)
      );
    }
  };

  const predictImg = async photo => {
    let modelPromise = cocoSsd.load('mobilenet_v2');

    const model = await modelPromise;
    // console.log('model loaded');
    // console.time('predict1');

    const result = await model.detect(photo);
    // console.timeEnd('predict1');

    console.log('prediction result', result);

    const c = document.createElement('canvas');
    c.width = '320';
    c.height = '240';
    const context = c.getContext('2d');
    context.drawImage(photo, 0, 0);
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
    setDetectedItems(result);
  };

  const takePicture = async () => {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    const video = document.getElementById('video');
    const photo = document.getElementById('photo');
    const { width, height } = constraints.video;

    await setCaptured(true);
    canvas.width = width;
    canvas.height = height;
    context.drawImage(video, 0, 0, width, height);

    const data = canvas.toDataURL('image/png');

    console.log(data);
    photo.setAttribute('src', data);
    console.log(photo);
    if (props.isItems) {
      predictImg(photo);
    }
    setBase64(data);
  };

  const videoOff = () => {
    const video = document.getElementById('video');
    video.pause();
    video.srcObject = null;
    localStream.getTracks().forEach(track => track.stop());
    props.setShowCamera(false);
  };

  const handleStartClick = event => {
    event.preventDefault();
    takePicture();
  };

  const handleSaveClick = () => {
    const photo = document.getElementById('photo');
    console.log(photo.src);
  };

  useEffect(() => {
    const clearPhoto = () => {
      const canvas = document.getElementById('canvas');
      const photo = document.getElementById('photo');
      const context = canvas.getContext('2d');
      const { width, height } = constraints.video;
      context.fillStyle = '#FFF';
      context.fillRect(0, 0, width, height);

      const data = canvas.toDataURL('image/png');
      photo.setAttribute('src', data);
    };

    var video = document.querySelector('video');

    function successCallback(stream) {
      video.srcObject = stream;
      video.play();
      setLocalStream(stream);
    }

    function errorCallback(error) {
      console.log('navigator.getUserMedia error: ', error);
    }

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(successCallback)
      .catch(errorCallback);
  }, [captured, constraints]);

  return (
    <div>
      <Camera
        handleStartClick={handleStartClick}
        setCaptured={setCaptured}
        captured={captured}
      />

      <canvas id='canvas' hidden />

      <Photo
        handleSaveClick={handleSaveClick}
        captured={captured}
        setCaptured={setCaptured}
        setBase64={setBase64}
        setDetectedItems={setDetectedItems}
        isItems={props.isItems}
      />

      {captured && !props.isItems && (
        <RoomForm
          base64={base64}
          setCaptured={setCaptured}
          userId={props.user._id}
        />
      )}

      {detectedItems && (
        <LocationForm
          base64={base64}
          setCaptured={setCaptured}
          userId={props.user._id}
          detectedItems={detectedItems}
          roomName={props.roomName}
          deleteItem={deleteItem}
          addItem={addItem}
        />
      )}
      <button onClick={videoOff}>Turn Off Camera</button>
    </div>
  );
};

export default PhotoCapture;
