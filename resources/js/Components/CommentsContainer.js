import React from 'react'
import Comment from './Comment'
import CommentInput from './CommentInput'

function CommentsContainer({ comments }) {
  return (
    <div>
        <CommentInput />

        {comments.map(comment => (
            <Comment key={comment.id} comment={comment} />
        ))}
    </div>
  )
}

export default CommentsContainer
