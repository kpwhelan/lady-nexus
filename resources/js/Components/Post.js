import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import CommentsContainer from './CommentsContainer'
import Modal from './Modal';
import PostFormEdit from './PostFormEdit';

function Post({ post, setPosts, currentUser, fetchPosts, categories }) {
    const [showComments, setShowComments] = useState(false);
    const [displayEditBox, setDisplayEditBox] = useState(false);
    const [displayError, setDisplayError] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [whatWeAreDeleting, setWhatAreWeDeleting] = useState(null);
    const [commentIdToDelete, setCommentIdToDelete] = useState(null);
    const [deleteCommentError, setDeleteCommentError] = useState(null);
    const [isPostLikeByUser, setIsPostLikedByUser] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    useEffect(() => {
        if (post.post_likes.find(like => like.user_id == currentUser.id)) {
            setIsPostLikedByUser(true)
        }

        setLikeCount(post.post_likes.length)
    }, [])

    const toggleSetModalOpen = (event) => {
        if (modalOpen) {
            setWhatAreWeDeleting(null)
            setModalOpen(false)

            if (event.target && event.target.dataset.type == 'comment') {
                setCommentIdToDelete(null)
            }
        } else if (!modalOpen) {
            setWhatAreWeDeleting(event.target.dataset.type)
            setModalOpen(true)
            setCommentIdToDelete(event.target.id)
        }
    }

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
            if (response.data.code == 404) {
                setError(response.message);
                setDisplayError(true);
                toggleSetModalOpen(false);

                setTimeout(() => {
                    setDisplayError(false)
                }, 5000);
            } else {
                if (fetchPosts) {
                    fetchPosts()
                } else if (setPosts) {
                    setPosts()
                }
            }
        })
    }

    const deleteComment = () => {
        axios.delete(`/comments/delete/${commentIdToDelete}`)
        .then(response => {
            if (response.data.code == 404) {
                setDeleteCommentError(response.data.message);
                toggleSetModalOpen(false)

                setTimeout(() => {
                    setDisplayError(false)
                }, 5000);
            } else {
                if (fetchPosts) {
                    fetchPosts()
                } else if (setPosts) {
                    setPosts()
                }
                toggleSetModalOpen(false)
            }
        })
    }

    const toggleLikePost = () => {
        axios.post('/posts/toggle-like', {
            is_post_liked_by_user: isPostLikeByUser,
            post_id: post.id
        })
        .then(() => {
            const newLikeCount = isPostLikeByUser ? likeCount - 1 : likeCount + 1;
            setIsPostLikedByUser(isPostLikeByUser ? false : true)
            setLikeCount(newLikeCount)
        });
    }

    return (
        <>
        <div className="max-h-96 w-100 bg-white rounded overflow-scroll shadow-lg m-5 transition ease-in-out delay-110 hover:-translate-y-2 hover:scale-102">
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">
                    <p>{post.user.username}</p>
                    <p className='text-sm font-normal'>{new Date(post.created_at).toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}</p>
                </div>

                <p className="text-gray-700 text-base">
                    {post.post}
                </p>

                {currentUser.id === post.user_id &&
                    <div className='mt-2'>
                        <button id={post.id} onClick={toggleSetDisplayEditBox} className='text-sm mr-1'>Edit</button>
                        <button id={post.id} data-type="post" onClick={toggleSetModalOpen} className='text-sm ml-1'>Delete</button>
                    </div>
                }

                {displayEditBox && <PostFormEdit postData={post} categories={categories} previousCategoryId={post.category.id} toggleSetDisplayEditBox={toggleSetDisplayEditBox} setPosts={setPosts} fetchPosts={fetchPosts}/>}

                {displayError &&
                    <p className='bg-red-500/75 text-white mt-2 w-fit rounded-lg'>{serverError}</p>
                }
            </div>
            <div className="px-6 pt-4 pb-2">
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 cursor-default">#{post.category.name}</span>
                <span onClick={toggleSetShowComment} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 cursor-pointer transition ease-in-out delay-110 hover:-translate-y-1 hover:scale-110 hover:bg-sage hover:text-white duration-300">{post.comments.length} {post.comments.length == 1 ? 'comment' : 'comments'}</span>
                <span onClick={toggleLikePost} className='cursor-pointer'>
                    {isPostLikeByUser ? (
                            <FontAwesomeIcon icon={faHeartSolid} />
                        )
                        :
                        (
                            <FontAwesomeIcon icon={faHeart} />
                        )
                    }
                    {likeCount > 0 ? <sub>{likeCount}</sub> : null}
                </span>
            </div>

            {showComments ? (
                <>
                    <CommentsContainer comments={post.comments} setPosts={setPosts} post_id={post.id} currentUser={currentUser} toggleSetModalOpen={toggleSetModalOpen} deleteCommentError={deleteCommentError} commentIdToDelete={commentIdToDelete}/>
                    <button className='bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 ml-6 mb-2 cursor-pointer transition ease-in-out delay-110 hover:-translate-y-1 hover:scale-110 hover:bg-sage hover:text-white duration-300"' onClick={toggleSetShowComment}>Hide Comments</button>
                </>
            ) : (<div></div>)}
        </div>

        {modalOpen &&
            (whatWeAreDeleting == 'post' ? (
                <Modal toggleModal={toggleSetModalOpen} deletePost={deletePost} whatWeAreDeleting={whatWeAreDeleting} />
            )
            :
            (
                <Modal toggleModal={toggleSetModalOpen} deleteComment={deleteComment} whatWeAreDeleting={whatWeAreDeleting} />
            )
            )

        }
        </>
    )
}

export default Post
