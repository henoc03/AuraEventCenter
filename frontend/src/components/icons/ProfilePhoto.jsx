//import React, { useEffect, useState } from 'react';
import DefaultProfilePhoto from '/default-image.jpg'

//const DEFAULT_ROUTE = 'http://localhost:3000'

function ProfilePhoto({width = 70, height = 70}) {
//   const [currentUser, setCurrentUser] = useState([]);

//   useEffect(() => {
//     fetch(`${DEFAULT_ROUTE}/api/current_user`)
//       .then(res => res.json())
//       .then(data => setCurrentUser(data))
//       .catch(error => console.error('Error fetching user data:', error));
//   }, []);

  // const profilePhoto = currentUser?.profile_photo || DefaultProfilePhoto;

  return (
    <div className='image' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: `${50}px` }}>
      <img 
        src={DefaultProfilePhoto} 
        alt="Imagen de perfil" 
        style={{ 
          width: '100%', 
          maxWidth: `${width}px`, 
          height: 'auto', 
          maxHeight: `${height}px`, 
          objectFit: 'cover',
          borderRadius: `${50}px`
        }} 
      />
    </div>
  );
}

export default ProfilePhoto;