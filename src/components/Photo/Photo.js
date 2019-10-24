import React from 'react';
import './Photo.scss';

const Photo = props => {
  return (
    <div>
      <img
        id='photo'
        alt='picturebyuser'
        className={props.captured ? 'show' : 'hide'}
        src=''
      />
      <br />
      <div className='canvas-container'></div>
      <br />
      <button
        id='retakeButton'
        onClick={() => {
          props.setCaptured(false);
          props.setBase64('');
          props.setDetectedItems(null);
        }}
      >
        Retake Photo
      </button>
    </div>
  );
};

export default Photo;
