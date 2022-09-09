import React, { useState } from 'react'
import CommentsContainer from './CommentsContainer';

function Post({ post }) {
    const [showComments, setShowComments] = useState(false);

    function toggleSetShowComment() {
        if (!showComments) {
            setShowComments(true)
        } else {
            setShowComments(false)
        }
    }

    return (
    <div className="w-2/3 rounded overflow-scroll shadow-lg m-5 transition ease-in-out delay-110 hover:-translate-y-2 hover:scale-102">
        <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">
                {post.user.first_name} {post.user.last_name}
            </div>
            <p className="text-gray-700 text-base">
                {post.post}
            </p>
        </div>
        <div className="px-6 pt-4 pb-2">
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 cursor-default">#{post.category.name}</span>
            <span onClick={toggleSetShowComment} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 cursor-pointer transition ease-in-out delay-110 hover:-translate-y-1 hover:scale-110 hover:bg-sage hover:text-white duration-300">{post.comments.length} comments</span>
        </div>

        {showComments ? (
            <CommentsContainer comments={post.comments} />
        ) : (<div></div>)}
    </div>
    )
}

export default Post
