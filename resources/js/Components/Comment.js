import React, { useEffect, useState } from 'react'
import axios from 'axios'
import CommentInputEdit from './CommentInputEdit';

function Comment({ comment, currentUser, setPosts, post_id }) {
    const [user, setUser] = useState([]);
    const [displayEditBox, setDisplayEditBox] = useState(false);
    const [ error, setError ] = useState('');
    const [ displayError, setDisplayError ] = useState(false);

    const toggleSetDisplayEditBox = () => {
        if (displayEditBox) {
            setDisplayEditBox(false);
        } else if (!displayEditBox) {
            setDisplayEditBox(true);
        }
    }

    const deleteComment = () => {
        axios.delete(`/comments/delete/${comment.id}`)
        .then(response => {
            if (response.status == 200) {
                setPosts()
            } else if (response.status == 404) {
                setError(response.message);
                setDisplayError(true);

                setTimeout(() => {
                    setDisplayError(false)
                }, 5000);
            }
        })
    }

    useEffect(() => {
        axios.get(`/comments/user/${comment.user_id}`)
        .then(response => setUser(response.data.user))
    }, []);

  return (
    <div className="px-6 py-4">
        <p>{user.first_name} {user.last_name}</p>
        <p className="text-gray-700 text-base">{comment.comment}</p>

        {currentUser.id === comment.user_id &&
        <div>
            <button id={comment.id} onClick={toggleSetDisplayEditBox} className='text-sm mr-1'>Edit</button>
            <button id={comment.id} onClick={deleteComment} className='text-sm ml-1'>Delete</button>
            {displayError &&
                <p className='bg-red-500/75 text-white mt-2 w-fit'>{serverError}</p>
            }
        </div>
        }
        {displayEditBox && <CommentInputEdit existingComment={comment.comment} setPosts={setPosts} commentId={comment.id} toggleSetDisplayEditBox={toggleSetDisplayEditBox} />}
    </div>
  )
}

export default Comment
