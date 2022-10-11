import DeleteAccountModal from '@/Components/DeleteAccountModal'
import PasswordResetForm from '@/Components/PasswordResetForm'
import ProfilePictureUploadForm from '@/Components/ProfilePictureUploadForm'
import Authenticated from '@/Layouts/Authenticated'
import { Head } from '@inertiajs/inertia-react'
import React, { useState } from 'react'
import ProfilePicture from '@/Components/ProfilePicture'

function MyAccount(props) {
    const [displayPasswordReset, setDisplayPasswordReset] = useState(false);
    const [displayModal, setDisplayModal] = useState(false);
    const [displayUpload, setDisplayUpload] = useState(false);
    const [error, setError] = useState(null);

    const toggleSetDisplayPasswordReset = () => {
        displayPasswordReset ? setDisplayPasswordReset(false) : setDisplayPasswordReset(true);
        setDisplayModal(false);
        setDisplayUpload(false);
    }

    const toggleSetDisplayModal = () => {
        displayModal ? setDisplayModal(false) : setDisplayModal(true);
        setDisplayPasswordReset(false);
        toggleSetDisplayUpload(false);
    }

    const toggleSetDisplayUpload = () => {
        displayUpload ? setDisplayUpload(false) : setDisplayUpload(true);
        setDisplayPasswordReset(false);
        setDisplayModal(false);
    }

    const deleteAccount = () => {
        axios.post(route('delete'), {
            user_id: props.auth.user.id
        }).then(response => {
            if (response.status == 200) {
                window.location.href=route('register')
            }
        }).catch(error => {
            if (error.response) {
                setError(e.response.data.message)
            }

            setTimeout(() => {
                setError(false)
            }, 5000);
        })
    }

  return (
    <Authenticated
        auth={props.auth}
        errors={props.errors}
    >
        <Head title="My Account" />

        <div className='ml-8 mt-2'>
            <div className="flex-col md:flex md:flex-row justify-around">
                <div className='mr-2 mt-5 mb-4'>
                <h1 className='text-xl underline'>Account Details</h1>
                    <ProfilePicture profilePictureUrl={props.auth.user.profile_picture_url} className={"w-46 h-36 my-2"} defaultSize="2x" />
                    <p className='bg-white rounded-xl p-2 max-w-fit mb-1'>{props.auth.user.first_name} {props.auth.user.last_name}</p>
                    <p className='bg-white rounded-xl p-2 max-w-fit mb-1'>Joined: {new Date(props.auth.user.created_at).toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}</p>
                    <p className='bg-white rounded-xl p-2 w-fit mb-1'>Email: {props.auth.user.email}</p>
                    <p className='bg-white rounded-xl p-2 max-w-fit mb-1'>Username: {props.auth.user.username}</p>
                    <p className='bg-white rounded-xl p-2 max-w-fit mb-1'>{props.post_count} {props.post_count == 1 ? 'post' : 'posts'}</p>
                    <p className='bg-white rounded-xl p-2 max-w-fit mb-1'>{props.comment_count > 0 ? props.comment_count : 0} {props.comment_count == 1 ? 'comment' : 'comments'}</p>
                    <p className='bg-white rounded-xl p-2 max-w-fit mb-1'>{props.sub_comment_count > 0 ? props.sub_comment_count : 0} {props.sub_comment_count == 1 ? 'comment reply' : 'comment replies'}</p>
                    <p className='bg-white rounded-xl p-2 max-w-fit mb-1'>{props.post_like_count > 0 ? props.post_like_count : 0} {props.post_like_count == 1 ? 'liked post' : 'liked posts'}</p>
                    <p className='bg-white rounded-xl p-2 max-w-fit mb-1'>{props.comment_like_count > 0 ? props.comment_like_count : 0} {props.comment_like_count == 1 ? 'liked comment' : 'liked comments'}</p>
                    <p className='bg-white rounded-xl p-2 max-w-fit mb-1'>{props.sub_comment_like_count > 0 ? props.sub_comment_like_count : 0} {props.sub_comment_like_count == 1 ? 'liked comment reply' : 'liked comment replies'}</p>
                </div>

                <div className=''>
                    <button onClick={toggleSetDisplayPasswordReset} className="inline-flex items-center mr-1 px-4 py-2 bg-sage border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest active:bg-gray-900 transition ease-in-out duration-150">Change Password</button>
                    <button onClick={toggleSetDisplayModal} className="inline-flex items-center ml-1 px-4 py-2 bg-red-500/75 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest active:bg-gray-900 transition ease-in-out duration-150">Delete Account</button>
                    <button onClick={toggleSetDisplayUpload} className="inline-flex items-center ml-1 mt-2 px-4 py-2 bg-sage border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest active:bg-gray-900 transition ease-in-out duration-150">Upload Profile Picture</button>

                    {displayPasswordReset &&
                        <PasswordResetForm userId={props.auth.user.id} />
                    }

                    {error &&
                        <p className='bg-red-500/75 text-white mt-2 w-fit p-2 rounded-lg'>{error}</p>
                    }

                    {displayUpload &&
                        <ProfilePictureUploadForm toggleUploadForm={toggleSetDisplayUpload} />
                    }
                </div>
            </div>
        </div>

        {displayModal &&
            <DeleteAccountModal deleteAccount={deleteAccount} toggleModal={toggleSetDisplayModal} />
        }

    </Authenticated>
  )
}

export default MyAccount
