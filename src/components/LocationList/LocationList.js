import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Icon } from 'antd';
import moment from 'moment';
import './LocationList.scss';
import { domain } from '../../constants';

const LocationList = props => {
  const loadingIcon = (
    <div>
      Loading Locations... <Icon type='loading' />
    </div>
  );

  // TODO: load images and items from server
  const { userId, roomId } = useParams();

  const handleDeleteLocation = location => {
    if (window.confirm(`Are you sure you want to delete ${location.name}?`)) {
      props.deleteLocation(userId, roomId, location._id);
      alert(`Deleted location ${location.name}`);
    } else {
      alert(`Did not delete ${location.name}`);
    }
  };

  const renderedLocations = props.locations.map(location => {
    const dateCreated = moment(location.created).format('YYYY-MM-DD');
    const items = location.items.map((item, index) => (
      <li key={item + index}>{item}</li>
    ));
    return (
      <div className='location-container' key={location.imageId}>
        <Icon
          className='delete-button'
          type='close'
          onClick={() => handleDeleteLocation(location)}
        />
        <p className='location-name'>{location.name}</p>
        <img
          className='location-image'
          src={location.imageUrl}
          alt={location.name}
        />
        <p className='location-date-created'>{dateCreated}</p>
        <ul className='items-list'>{items}</ul>
      </div>
    );
  });

  return (
    <div className='locations-container'>
      {props.isLoadingLocations ? loadingIcon : renderedLocations}
    </div>
  );
};

export default LocationList;
