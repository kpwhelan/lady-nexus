import React, { useState } from 'react'
import Comment from './Comment'
import CommentInput from './CommentInput'

function CommentsContainer({ comments, setPosts, post_id, currentUser, toggleSetModalOpen, deleteCommentError, commentIdToDelete }) {
  return (
    <div>
        <CommentInput post_id={post_id} setPosts={setPosts} />

        {comments.reverse().map(comment => (
            <div key={comment.id} className='bg-sage/25 m-3 p-3 rounded-lg'>
                <p className="text-gray-700 text-sm">{new Date(comment.created_at).toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}</p>
                <Comment currentUser={currentUser} comment={comment} setPosts={setPosts} post_id={post_id} toggleSetModalOpen={toggleSetModalOpen} deleteCommentError={deleteCommentError} commentIdToDelete={commentIdToDelete} />
            </div>
        ))}
    </div>
  )
}

export default CommentsContainer
