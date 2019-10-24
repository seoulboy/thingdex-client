import React from 'react';
import { useParams } from 'react-router-dom';
import './LocationForm.scss';
import { domain } from '../../constants';


const LocationForm = props => {
  const { userId, roomId } = useParams();

  const handleSubmit = event => {
    event.preventDefault();
    const locationForm = document.querySelector('.location-form');
    fetch(props.base64)
      .then(res => res.blob())
      .then(blob => {
        var formData = new FormData(locationForm);
        formData.append('image', blob);
        fetch(
          `http://${domain}:4000/api/users/${userId}/rooms/${roomId}/locations/`,
          {
            method: 'POST',
            body: formData,
          }
        );
      });
  };

  console.log(props.detectedItems);

  const renderedInputs = props.detectedItems.map(detectedItem => {
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
            required
          />
          <button onClick={() => props.deleteItem(detectedItem)}>Delete</button>
          <br />
        </label>
      );
    } else {
      return (
        <label key={Math.random()}>
          <input id='item-name-input' type='text' name='item' required />
          <button onClick={() => props.deleteItem(detectedItem)}>Delete</button>
          <br />
        </label>
      );
    }
  });
  
  console.log(renderedInputs);
  return (
    <form
      className='location-form'
      onSubmit={event => {
        handleSubmit(event);
        props.setCaptured(false);
      }}
      encType='multipart/form-data'
    >
      <input
        type='text'
        name='location'
        placeholder='enter location'
        required
      />

      <div className='field'>{renderedInputs}</div>

      <button onClick={() => props.addItem()}>Add Item</button>
      <input type='submit' className='btn' value='Save' />
    </form>
  );
};

export default LocationForm;
