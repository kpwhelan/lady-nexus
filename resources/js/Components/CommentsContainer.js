import React from 'react'
import Comment from './Comment'
import CommentInput from './CommentInput'

function CommentsContainer({ posts, comments, updatePosts, updatePostsForMyPosts, post_id, currentUser, toggleSetModalOpen, deleteCommentError, commentIdToDelete }) {
    const calcualateTimeStamp = (itemTime) => {
        let hoursSince = Math.abs(new Date() - new Date(itemTime)) / 36e5;

        if (hoursSince < 1) {
            return Math.floor(hoursSince) + ' minutes ago'
        } else if ((hoursSince) < 24) {
            return (Math.floor(hoursSince)) + ' hours ago'
        } else if ((hoursSince) >= 24) {
            return (Math.floor(hoursSince / 24)) == 1 ? Math.floor(hoursSince / 24) + ' day ago' : Math.floor(hoursSince / 24) + ' days ago'
        }
    }
  return (
    <div className='mx-10'>
        <CommentInput posts={posts} post_id={post_id} updatePosts={updatePosts} updatePostsForMyPosts={updatePostsForMyPosts} />

        {comments.reverse().map(comment => (

            <div key={comment.id} className='bg-sage/10 m-3 p-3 rounded-lg'>
                <p className="text-gray-700 text-sm">{
                    calcualateTimeStamp(comment.created_at)
                }</p>
                <Comment posts={posts} post_id={post_id} currentUser={currentUser} comment={comment} updatePosts={updatePosts} updatePostsForMyPosts={updatePostsForMyPosts} toggleSetModalOpen={toggleSetModalOpen} deleteCommentError={deleteCommentError} commentIdToDelete={commentIdToDelete} />
            </div>
        ))}
    </div>
  )
}

export default CommentsContainer
