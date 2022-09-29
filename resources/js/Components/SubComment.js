import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react'

function SubComment({ subComment, currentUser }) {
    const [isSubCommentLikedByUser, setIsSubCommentLikedByUser] = useState(false);
    const [subCommentLikeCount, setSubCommentLikeCount] = useState(0);

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

  return (
    <div key={`sub_comment_${subComment.id}`} className="bg-white rounded-lg px-2 max-w-fit my-2">
        <p className='text-sm'>{subComment.user.username}</p>
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
    </div>
  )
}

export default SubComment
