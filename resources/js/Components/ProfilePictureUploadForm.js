import { useForm } from '@inertiajs/inertia-react';
import axios from 'axios';
import React, { useState } from 'react'
import Button from './Button';
import Input from './Input';

function ProfilePictureUploadForm({ toggleUploadForm }) {
    const { data, setData, post, progress, reset } = useForm({
        profile_picture: null,
      })

      const [error, setError] = useState(null);

    const onHandleChange = (event) => {
        setData('profile_picture', event.target.files[0]);
    };

    function submit(e) {
        e.preventDefault()

       post(route('upload-profile-picture'), {
        onSuccess: () => {
            reset();
            toggleUploadForm();
        },
        onError: error => {
            if (error.message) {
                setError(error.message)
            } else if (error.mimes) {
                setError(error.mimes);
            } else if (error.profile_picture) {
                setError(error.profile_picture)
            } else {
                setError(error)
            }

            setTimeout(() => {
                setError(null)
            }, 7000);
        }
       })
    }

  return (
    <>
    <div className='my-2 flex'>
        <form onSubmit={submit}>
            <Input
                type="file"
                name="profile_picture"
                className="w-full"
                autoComplete="profile_picture"
                isFocused={false}
                handleChange={onHandleChange}
                placeholder=""
                required
            />

            {progress && (
                <>
                    <div className="w-full bg-gray-200 rounded-full">
                        <div className="bg-sage text-sm font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{width: progress.percentage + '%'}}> {progress.percentage}%</div>
                    </div>
                </>
            )}

            <Button className="mt-1">
                Upload
            </Button>
        </form>
    </div>
    {error &&
        <p className='bg-red-500/75 text-white mt-2 w-fit p-2 rounded-lg'>{error}</p>
    }
    </>
  )
}

export default ProfilePictureUploadForm
