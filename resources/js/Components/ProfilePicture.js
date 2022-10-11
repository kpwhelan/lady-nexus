import React from 'react'
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function ProfilePicture({ profilePictureUrl, className, defaultSize }) {
  return (
    <>
    {profilePictureUrl ? (
        <div>
            <img className={`object-cover aspect-square rounded-full ${className}`} src={profilePictureUrl}></img>
        </div>
    )
    :
    (
        <div className='my-2 mr-2 border-2 border-solid border-slate-900 w-fit h-fit py-1 px-2 rounded-full'><FontAwesomeIcon size={defaultSize} icon={faUser} /></div>
    )
    }
    </>
  )
}

export default ProfilePicture
