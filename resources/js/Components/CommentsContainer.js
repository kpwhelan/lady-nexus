import React from 'react'
import Comment from './Comment'
import CommentInput from './CommentInput'

function CommentsContainer({ comments, setPosts, post_id }) {
  return (
    <div>
        <CommentInput post_id={post_id} setPosts={setPosts}/>

        {comments.map(comment => (
            <Comment key={comment.id} comment={comment} />
        ))}
    </div>
  )
}

export default CommentsContainer
