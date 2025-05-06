import React, { useEffect, useState } from 'react';
import DefaultProfilePhoto from '../../assets/images/default-profile-photo.png';

function ProfilePhoto({ width = 70, height = 70 }) {
  const [currentUser, setCurrentUser] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch('/users/current_user', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setCurrentUser(data))
      .catch(error => console.error('Error fetching user data:', error));
  }, []);

  const profilePhoto = currentUser?.PROFILE_PHOTO || DefaultProfilePhoto;

  return (
    <div
      className="image"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: `${50}px`,
      }}
    >
      <img
        src={profilePhoto}
        alt="Imagen de perfil"
        style={{
          width: '100%',
          maxWidth: `${width}px`,
          height: 'auto',
          maxHeight: `${height}px`,
          objectFit: 'cover',
          borderRadius: `${50}px`,
        }}
      />
    </div>
  );
}

export default ProfilePhoto;
