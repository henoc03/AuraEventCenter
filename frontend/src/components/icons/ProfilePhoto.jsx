import React, { useEffect, useState } from 'react';
import DefaultProfilePhoto from '../../assets/images/default-profile-photo.png'

const DEFAULT_ROUTE = 'http://localhost:3000'

function ProfilePhoto({width = 70, height = 70}) {
  const [currentUser, setCurrentUser] = useState([]);

  useEffect(() => {
    fetch(`${DEFAULT_ROUTE}/api/current_user`)
      .then(res => res.json())
      .then(data => setCurrentUser(data))
      .catch(error => console.error('Error fetching user data:', error));
  }, []);

  const profilePhoto = currentUser?.profile_photo || DefaultProfilePhoto;

  return (

    <div className='imageContainer'>
      <img src={profilePhoto} alt="Imagen de perfil" width={width} height={height}/>
    </div>
  )
}

export default ProfilePhoto;