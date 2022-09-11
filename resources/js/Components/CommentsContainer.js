import React from 'react'
import Comment from './Comment'

function CommentsContainer({ comments }) {
  return (
    <div>
        {comments.map(comment => (
            <Comment key={comment.id} comment={comment} />
        ))}
    </div>
  )
}

export default CommentsContainer
