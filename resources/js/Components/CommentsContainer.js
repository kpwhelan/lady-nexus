import React from 'react'
import Comment from './Comment'
import CommentInput from './CommentInput'

function CommentsContainer({ comments, setPosts, post_id }) {
  return (
    <div>
        <CommentInput post_id={post_id} setPosts={setPosts}/>

        {comments.map(comment => (
            <div className='bg-sage/25 m-3 p-3 rounded'>
                <p key={comment.created_at} className="text-gray-700 text-sm">{new Date(comment.created_at).toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}</p>
                <Comment key={comment.id} comment={comment} />
            </div>
        ))}
    </div>
  )
}

export default CommentsContainer
