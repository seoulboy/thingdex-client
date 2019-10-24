import React, { useEffect, useState } from 'react';
import { searchItem } from '../../api';
import './SearchResultList.scss';

const SearchResultList = props => {
  const renderedResultList = props.searchResults.map(result => {
    const { found, roomName } = result;
    const itemList = found.items.map(item => {
      return <li>{item}</li>;
    });
    return (
      <div className='result-location-container'>
        <p className='room-location-text'>'{roomName}'안 '{found.name}'</p>
        <img
          className='result-location-image'
          src={found.imageUrl}
          alt={found.name}
        />
        <ul>{itemList}</ul>
      </div>
    );
  });

  return <div className='result-list-container'>{renderedResultList}</div>;
};

export default SearchResultList;
