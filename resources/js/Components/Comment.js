import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import CommentInputEdit from './CommentInputEdit';
import SubCommentInput from './SubCommentInput';
import SubComment from './SubComment';

function Comment({ posts, comment, currentUser, updatePosts, updatePostsForMyPosts, toggleSetModalOpen, commentIdToDelete, deleteCommentError }) {
    const [user, setUser] = useState([]);
    const [displayEditBox, setDisplayEditBox] = useState(false);
    const [error, setError] = useState('');
    const [displayError, setDisplayError] = useState(false);
    const [isCommentLikeByUser, setIsCommentLikedByUser] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [displaySubComments, setDisplaySubComments] = useState(false);

    useEffect(() => {
        if (comment.comment_likes.find(like => like.user_id == currentUser.id)) {
            setIsCommentLikedByUser(true)
        }

        setLikeCount(comment.comment_likes.length)
    }, [])

    useEffect(() => {
        if (deleteCommentError && comment.id == commentIdToDelete) {
            setError(deleteCommentError)
            setDisplayError(true)
        }
    }, [deleteCommentError])

    const toggleSetDisplaySubComments = () => {
        if (displaySubComments) {
            setDisplaySubComments(false)
        } else if (!displaySubComments) {
            setDisplaySubComments(true)
        }
    }

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

    const toggleLikeComment = () => {
        axios.post('/comments/toggle-like', {
            is_comment_liked_by_user: isCommentLikeByUser,
            comment_id: comment.id
        })
        .then(() => {
            const newLikeCount = isCommentLikeByUser ? likeCount - 1 : likeCount + 1;
            setIsCommentLikedByUser(isCommentLikeByUser ? false : true)
            setLikeCount(newLikeCount)
        });
    }

  return (
    <>
    <div className="px-6 py-4">
        <div className='bg-white rounded-lg p-2 max-w-fit'>
            <p className='text-sm'>{user.username}</p>
            <div className='flex'>
                <p className="text-gray-700 text-lg ml-2">{comment.comment}</p>
                <span onClick={toggleLikeComment} className='cursor-pointer ml-4'>
                    {isCommentLikeByUser ? (
                            <FontAwesomeIcon icon={faHeartSolid} />
                        )
                        :
                        (
                            <FontAwesomeIcon icon={faHeart} />
                        )
                    }
                    {likeCount > 0 ? <sub>{likeCount}</sub> : null}
                </span>
            </div>
        </div>

        {currentUser.id === comment.user_id &&
        <div>
            <button id={comment.id} onClick={toggleSetDisplayEditBox} className='text-xs mr-1'>Edit</button>
            <button id={comment.id} data-type="comment" onClick={toggleSetModalOpen} className='text-xs ml-1'>Delete</button>
            {displayError &&
                <p className='bg-red-500/75 text-white mt-2 p-2 w-fit rounded-lg'>{error}</p>
            }
        </div>
        }

        {displayEditBox && <CommentInputEdit posts={posts} existingComment={comment.comment} updatePosts={updatePosts} updatePostsForMyPosts={updatePostsForMyPosts} commentId={comment.id} toggleSetDisplayEditBox={toggleSetDisplayEditBox} />}

        <div className='ml-4'>
            <p onClick={toggleSetDisplaySubComments} className='text-sm cursor-pointer underline mt-4'>View replies <span>&#40;{comment.sub_comments.length}&#41;</span></p>

            {(comment.sub_comments.length > 0 && displaySubComments) &&
                <div className='ml-4 mt-2'>
                    {comment.sub_comments.reverse().map(sub_comment => (
                        <SubComment key={`sub_comment_${sub_comment.id}`} posts={posts} toggleSetModalOpen={toggleSetModalOpen} subComment={sub_comment} currentUser={currentUser} updatePosts={updatePosts} updatePostsForMyPosts={updatePostsForMyPosts} />
                    ))}
                </div>
            }
        </div>

        <SubCommentInput posts={posts} post_id={comment.post_id} comment_id={comment.id} updatePosts={updatePosts} updatePostsForMyPosts={updatePostsForMyPosts} />
    </div>
    </>
  )
}

export default Comment
