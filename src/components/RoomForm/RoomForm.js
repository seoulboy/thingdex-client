import React from 'react';
import './RoomForm.scss';

const RoomForm = props => {
  const handleSubmit = event => {
    event.preventDefault();
    const roomForm = document.querySelector('.room-form');
    fetch(props.base64)
      .then(res => res.blob())
      .then(blob => {
        var formData = new FormData(roomForm);
        formData.append('image', blob);
        fetch(`http://localhost:4000/api/users/${props.userId}/rooms`, {
          method: 'POST',
          body: formData,
        });
      });
  };

  return (
    <form
      className='room-form'
      onSubmit={event => {
        handleSubmit(event);
        props.setCaptured(false);
      }}
      encType='multipart/form-data'
    >
      <div className='field'>
        <label>
          Room Name:
          <input id='room-name-input' type='text' name='name' required />
        </label>
      </div>
      <input type='submit' className='btn' value='Save' />
    </form>
  );
};

export default RoomForm;
