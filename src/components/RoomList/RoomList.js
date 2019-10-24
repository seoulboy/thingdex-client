import React from 'react';
import './RoomList.scss';
import { Icon } from 'antd';
import moment from 'moment';
import { Link } from 'react-router-dom';

const RoomList = ({
  rooms,
  loadingRooms,
  errorFetchRooms,
  userId,
  deleteRoom,
}) => {
  const loading = (
    <span>
      Loading Rooms... <Icon type='loading' />
    </span>
  );

  const handleDeleteRoom = async (roomId, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      await deleteRoom(userId, roomId);
      alert(`deleted room ${name}`);
    } else {
      alert(`did not delete ${name}`);
    }
  };

  const renderedRooms = rooms.map(room => {
    const dateCreated = moment(room.created).format('YYYY-MM-DD');
    return (
      <div className='room-container' key={room.imageId}>
        <Icon
          className='delete-button'
          type='close'
          onClick={() => handleDeleteRoom(room._id, room.name)}
        />
        <Link to={`/user/${userId}/room/${room._id}`}>
          <img className='room-image'
            src={room.imageUrl}
            alt={room.name}
          />
        </Link>
        <p className='room-name'>{room.name}</p>
        <p className='room-date-created'>{dateCreated}</p>
      </div>
    );
  });
  return (
      <div className='rooms-container'>
        {loadingRooms ? loading : renderedRooms}
      </div>
  );
};

export default RoomList;
