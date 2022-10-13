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
    subCommentIdToDelete,
    toggleSetDisplayUserProfile,
    follow,
    unfollow
}) {
    //you did this because every time the modal for deletion came up it was reversing the comments
    const [theComments, setTheComments] = useState([]);

    useEffect(() => {
        setTheComments(comments.sort((a,b) => b.id - a.id));
    }, [posts])

  return (
    <div className='mb:mx-10'>
        <CommentInput posts={posts} post_id={post_id} updatePosts={updatePosts} updatePostsForMyPosts={updatePostsForMyPosts} />

        {theComments.map(comment => (
            <div key={comment.id} className='bg-sage/10 m-3 p-2 rounded-lg'>
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
                    toggleSetDisplayUserProfile={toggleSetDisplayUserProfile}
                />
            </div>
        ))}
    </div>
  )
}

export default CommentsContainer
