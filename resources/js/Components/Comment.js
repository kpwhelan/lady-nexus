import React, { useEffect, useState } from 'react'
import axios from 'axios'
import CommentInputEdit from './CommentInputEdit';

function Comment({ posts, comment, currentUser, updatePosts, updatePostsForMyPosts, toggleSetModalOpen, commentIdToDelete, deleteCommentError }) {
    const [user, setUser] = useState([]);
    const [displayEditBox, setDisplayEditBox] = useState(false);
    const [error, setError] = useState('');
    const [displayError, setDisplayError] = useState(false);

    useEffect(() => {
        if (deleteCommentError && comment.id == commentIdToDelete) {
            setError(deleteCommentError)
            setDisplayError(true)
        }
    }, [deleteCommentError])

    const toggleSetDisplayEditBox = () => {
        if (displayEditBox) {
            setDisplayEditBox(false);
        } else if (!displayEditBox) {
            setDisplayEditBox(true);
        }
    }

    useEffect(() => {
        axios.get(`/comments/user/${comment.user_id}`)
        .then(response => setUser(response.data.user))
    }, []);

  return (
    <>
    <div className="px-6 py-4">
        <p>{user.username}</p>
        <p className="text-gray-700 text-base">{comment.comment}</p>

        {currentUser.id === comment.user_id &&
        <div>
            <button id={comment.id} onClick={toggleSetDisplayEditBox} className='text-sm mr-1'>Edit</button>
            <button id={comment.id} data-type="comment" onClick={toggleSetModalOpen} className='text-sm ml-1'>Delete</button>
            {displayError &&
                <p className='bg-red-500/75 text-white mt-2 p-2 w-fit rounded-lg'>{error}</p>
            }
        </div>
        }
        {displayEditBox && <CommentInputEdit posts={posts} existingComment={comment.comment} updatePosts={updatePosts} updatePostsForMyPosts={updatePostsForMyPosts} commentId={comment.id} toggleSetDisplayEditBox={toggleSetDisplayEditBox} />}
    </div>
    </>
  )
}

export default Comment
