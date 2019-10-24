import React from 'react';

const Camera = props => {
  return (
    <div className={props.captured ? 'hide' : 'show'}>
      <video id='video' autoPlay></video>
      <br />
      <button
        id='startButton'
        onClick={event => {
          props.handleStartClick(event);
          props.setCaptured(true);
        }}
      >
        Take Photo
      </button>
    </div>
  );
};

export default Camera;
