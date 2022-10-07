import React, { useEffect, useState } from 'react'
import Comment from './Comment'
import CommentInput from './CommentInput'

function CommentsContainer({
    posts,
    comments,
    updatePosts,
    updatePostsForMyPosts,
    post_id, currentUser,
    toggleSetModalOpen,
    deleteCommentError,
    deleteSubCommentError,
    commentIdToDelete,
    subCommentIdToDelete
}) {
    //you did this because every time the modal for deletion came up it was reversing the comments
    const [theComments, setTheComments] = useState([]);

    useEffect(() => {
        setTheComments(comments.sort((a,b) => b.id - a.id));
    }, [posts])

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
    <div className='mx-10'>
        <CommentInput posts={posts} post_id={post_id} updatePosts={updatePosts} updatePostsForMyPosts={updatePostsForMyPosts} />

        {theComments.map(comment => (

            <div key={comment.id} className='bg-sage/10 m-3 p-2 rounded-lg'>
                <p className="text-gray-700 text-sm">{
                    calcualateTimeStamp(comment.created_at)
                }</p>
                <Comment
                    posts={posts}
                    post_id={post_id}
                    currentUser={currentUser}
                    comment={comment}
                    updatePosts={updatePosts}
                    updatePostsForMyPosts={updatePostsForMyPosts}
                    toggleSetModalOpen={toggleSetModalOpen}
                    deleteCommentError={deleteCommentError}
                    deleteSubCommentError={deleteSubCommentError}
                    subCommentIdToDelete={subCommentIdToDelete}
                    commentIdToDelete={commentIdToDelete}
                />
            </div>
        ))}
    </div>
  )
}

export default CommentsContainer
