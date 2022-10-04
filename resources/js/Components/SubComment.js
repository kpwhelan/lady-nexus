import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react'
import SubCommentInputEdit from './SubCommentInputEdit';

function SubComment({ subComment, currentUser, toggleSetModalOpen, posts, updatePosts, updatePostsForMyPosts }) {
    const [isSubCommentLikedByUser, setIsSubCommentLikedByUser] = useState(false);
    const [subCommentLikeCount, setSubCommentLikeCount] = useState(0);
    const [displayEditBox, setDisplayEditBox] = useState(false);

    useEffect(() => {
        if (subComment.sub_comment_likes.find(like => like.user_id == currentUser.id)) {
            setIsSubCommentLikedByUser(true)
        }

        setSubCommentLikeCount(subComment.sub_comment_likes.length)
    }, [])

    const toggleLikeSubComment = () => {
        axios.post('/comments/toggle-sub-comment-like', {
            is_sub_comment_liked_by_user: isSubCommentLikedByUser,
            sub_comment_id: subComment.id
        })
        .then(() => {
            const newLikeCount = isSubCommentLikedByUser ? likeCount - 1 : likeCount + 1;
            setIsSubCommentLikedByUser(isSubCommentLikedByUser ? false : true)
            setSubCommentLikeCount(newLikeCount)
        });
    }

    const toggleSetDisplayEditBox = () => {
        if (displayEditBox) {
            setDisplayEditBox(false);
        } else if (!displayEditBox) {
            setDisplayEditBox(true);
        }
    }

    const calcualateTimeStamp = (itemTime) => {
        let hoursSince = Math.abs(new Date() - new Date(itemTime)) / 36e5;

        if (hoursSince < 1) {
            return Math.floor(hoursSince.toFixed(2) * 60) == 1 ? + Math.floor(hoursSince.toFixed(2) * 60) + ' minute ago' : Math.floor(hoursSince.toFixed(2) * 60) + ' minutes ago';
        } else if (hoursSince < 24) {
            return Math.floor(hoursSince) == 1 ? + Math.floor(hoursSince) + ' hour ago' : Math.floor(hoursSince) + ' hours ago';
        } else if (hoursSince >= 24) {
            return (Math.floor(hoursSince / 24)) == 1 ? Math.floor(hoursSince / 24) + ' day ago' : Math.floor(hoursSince / 24) + ' days ago'
        }
    }

  return (
    <div key={`sub_comment_${subComment.id}`} className="bg-white rounded-lg px-2 py-1 max-w-fit my-2">
        <p className='text-sm'>{subComment.user.username}</p>
        <p className='text-sm'>{calcualateTimeStamp(subComment.created_at)}</p>
        <div className='flex'>
            <p className="text-gray-700 text-lg ml-3">{subComment.sub_comment}</p>
            <span onClick={toggleLikeSubComment} className='cursor-pointer ml-4'>
                {isSubCommentLikedByUser ? (
                        <FontAwesomeIcon icon={faHeartSolid} />
                    )
                    :
                    (
                        <FontAwesomeIcon icon={faHeart} />
                    )
                }
                {subCommentLikeCount > 0 ? <sub>{subCommentLikeCount}</sub> : null}
            </span>
        </div>
        {currentUser.id === subComment.user_id &&
        <div>
            <button id={subComment.id} onClick={toggleSetDisplayEditBox} className='text-sm mr-1'>Edit</button>
            <button id={subComment.id} data-type="sub_comment" onClick={toggleSetModalOpen} className='text-sm ml-1'>Delete</button>
        </div>
        }

        {displayEditBox &&
            <SubCommentInputEdit posts={posts} updatePosts={updatePosts} updatePostsForMyPosts={updatePostsForMyPosts} subCommentId={subComment.id} existingSubComment={subComment.sub_comment} toggleSetDisplayEditBox={toggleSetDisplayEditBox} />
        }
    </div>
  )
}

export default SubComment
