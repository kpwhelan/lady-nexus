import React, { useEffect, useState } from 'react'
import CommentsContainer from './CommentsContainer'
import PostFormEdit from './PostFormEdit';

function Post({ post, setPosts, currentUser, fetchPosts, categories }) {
    const [showComments, setShowComments] = useState(false);
    const [displayEditBox, setDisplayEditBox] = useState(false);
    const [displayError, setDisplayError] = useState(false);

    const toggleSetDisplayEditBox = () => {
        if (displayEditBox) {
            setDisplayEditBox(false);
        } else if (!displayEditBox) {
            setDisplayEditBox(true);
        }
    }

    function toggleSetShowComment() {
        if (!showComments) {
            setShowComments(true)
        } else {
            setShowComments(false)
        }
    }

    const deletePost = () => {
        axios.delete(`/posts/delete/${post.id}`)
        .then(response => {
            if (response.status == 200) {
                if (fetchPosts) {
                    fetchPosts()
                } else if (setPosts) {
                    setPosts()
                }
            } else if (response.status == 404) {
                setError(response.message);
                setDisplayError(true);

                setTimeout(() => {
                    setDisplayError(false)
                }, 5000);
            }
        })
    }

    return (
    <div className="max-h-96 w-100 bg-white rounded overflow-scroll shadow-lg m-5 transition ease-in-out delay-110 hover:-translate-y-2 hover:scale-102">
        <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">
                <p>{post.user.first_name} {post.user.last_name}</p>
                <p className='text-sm font-normal'>{new Date(post.created_at).toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}</p>
            </div>

            <p className="text-gray-700 text-base">
                {post.post}
            </p>

            {currentUser.id === post.user_id &&
                <div className='mt-2'>
                    <button id={post.id} onClick={toggleSetDisplayEditBox} className='text-sm mr-1'>Edit</button>
                    <button id={post.id} onClick={deletePost} className='text-sm ml-1'>Delete</button>
                </div>
            }

            {displayEditBox && <PostFormEdit postData={post} categories={categories} previousCategoryId={post.category.id} toggleSetDisplayEditBox={toggleSetDisplayEditBox} setPosts={setPosts}/>}

            {displayError &&
                <p className='bg-red-500/75 text-white mt-2 w-fit'>{serverError}</p>
            }
        </div>
        <div className="px-6 pt-4 pb-2">
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 cursor-default">#{post.category.name}</span>
            <span onClick={toggleSetShowComment} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 cursor-pointer transition ease-in-out delay-110 hover:-translate-y-1 hover:scale-110 hover:bg-sage hover:text-white duration-300">{post.comments.length} comments</span>
        </div>

        {showComments ? (
            <>
                <CommentsContainer comments={post.comments} setPosts={setPosts} post_id={post.id} currentUser={currentUser}/>
                <button className='bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 ml-6 mb-2 cursor-pointer transition ease-in-out delay-110 hover:-translate-y-1 hover:scale-110 hover:bg-sage hover:text-white duration-300"' onClick={toggleSetShowComment}>Hide Comments</button>
            </>
        ) : (<div></div>)}


    </div>
    )
}

export default Post
