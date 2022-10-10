import React from 'react'

function ProfilePicture({ profilePictureUrl, classes }) {
  return (
    <>
    {profilePictureUrl ? (
        <div>
            <img className={`object-cover aspect-square rounded-full ${classes}`} src={profilePictureUrl}></img>
        </div>
    )
    :
    (
        <div className='my-2 border-4 border-solid border-slate-900 w-fit h-fit py-3 px-4 rounded-full'><FontAwesomeIcon size='3x' icon={faUser} /></div>
    )
    }
    </>
  )
}

export default ProfilePicture
