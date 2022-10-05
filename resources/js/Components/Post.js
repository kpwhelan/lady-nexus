import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import CommentsContainer from './CommentsContainer'
import Modal from './Modal';
import PostFormEdit from './PostFormEdit';

function Post({ post, dashboardPosts, myPosts, updatePosts, currentUser, updatePostsForMyPosts, categories }) {
    const [showComments, setShowComments] = useState(false);
    const [displayEditBox, setDisplayEditBox] = useState(false);
    const [displayError, setDisplayError] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [whatWeAreDeleting, setWhatAreWeDeleting] = useState(null);
    const [commentIdToDelete, setCommentIdToDelete] = useState(null);
    const [subCommentIdToDelete, setSubCommentIdToDelete] = useState(null);
    const [deleteCommentError, setDeleteCommentError] = useState(null);
    const [isPostLikeByUser, setIsPostLikedByUser] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [error, setError] = useState(null);

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

        } else if (!modalOpen) {
            let type = event.target.dataset.type;
            if (type == 'post') {
                setWhatAreWeDeleting(type)
            } else if (type == 'comment') {
                setWhatAreWeDeleting(type)
                setCommentIdToDelete(event.target.id)
            } else if (type == 'sub_comment') {
                setWhatAreWeDeleting(type)
                setSubCommentIdToDelete(event.target.id)
            }
            setModalOpen(true)
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
            if (response.status == 200) {
                let posts = dashboardPosts ? dashboardPosts : myPosts;
                let postIndex = posts.findIndex(post => post.id == response.data.post_id);
                posts.splice(postIndex, 1);


                if (updatePosts) {updatePosts(posts)}
                if (updatePostsForMyPosts) {updatePostsForMyPosts(posts)}
            }
        }).catch(error => {
            if (error.response) {
                setError(error.response.data.message);
                setDisplayError(true);

                setTimeout(() => {
                    setDisplayError(false)
                }, 5000);
            }
        })

        toggleSetModalOpen();
    }

    const deleteComment = () => {
        axios.delete(`/comments/delete/${commentIdToDelete}`)
        .then(response => {
            if (response.status == 200) {
                let posts = dashboardPosts ? dashboardPosts : myPosts;
                let postIndex = posts.findIndex(post => post.id == response.data.post_id);
                let commentIndex = posts[postIndex].comments.findIndex(comment => comment.id == response.data.comment_id);
                posts[postIndex].comments.splice(commentIndex, 1);

                if (updatePosts) {updatePosts(posts)}
                if (updatePostsForMyPosts) {updatePostsForMyPosts(posts)}
            }
        }).catch(error => {
            if (error.response) {
                setError(error.response.data.message);
                setDisplayError(true);

                setTimeout(() => {
                    setDisplayError(false)
                }, 5000);
            }
        })

        toggleSetModalOpen();
    }

    const deleteSubComment = () => {
        axios.delete(`/comments/delete/sub-comment/${subCommentIdToDelete}`)
        .then(response => {
            if (response.status == 200) {
                const posts = dashboardPosts ? dashboardPosts : myPosts;
                const postIndex = posts.findIndex(post => post.id == response.data.post_id);
                const commentIndex = posts[postIndex].comments.findIndex(comment => comment.id == response.data.comment_id);
                const subCommentIndex = posts[postIndex].comments[commentIndex].sub_comments.findIndex(sub_comment => sub_comment.id == response.data.sub_comment_id);
                posts[postIndex].comments[commentIndex].sub_comments.splice(subCommentIndex, 1);

                if (updatePosts) {updatePosts(posts)}
                if (updatePostsForMyPosts) {updatePostsForMyPosts(posts)}
            }
        }).catch(error => {
            if (error.response) {
                setError(error.response.data.message);
                setDisplayError(true);

                setTimeout(() => {
                    setDisplayError(false)
                }, 5000);
            }
        })

        toggleSetModalOpen();
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
        <div className="max-h-screen w-100 bg-white rounded overflow-scroll shadow-lg m-5 transition ease-in-out delay-110 hover:-translate-y-2 hover:scale-102">
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">
                    <p>{post.user.username}</p>
                    <p className='text-sm font-normal'>{new Date(post.created_at).toLocaleDateString('en-us', { year:"numeric", month:"short", day:"numeric", hour:"numeric", minute:"numeric"})}</p>
                </div>

                <p className="text-gray-700 text-base">
                    {post.post}
                </p>

                {currentUser.id === post.user_id &&
                    <div className='mt-2'>
                        <button id={post.id} onClick={toggleSetDisplayEditBox} className='text-xs mr-1'>Edit</button>
                        <button id={post.id} data-type="post" onClick={toggleSetModalOpen} className='text-xs ml-1'>Delete</button>
                    </div>
                }

                {displayEditBox && <PostFormEdit myPosts={myPosts} dashboardPosts={dashboardPosts} postData={post} categories={categories} previousCategoryId={post.category.id} toggleSetDisplayEditBox={toggleSetDisplayEditBox} updatePostsForDashboard={updatePosts} updatePostsForMyPosts={updatePostsForMyPosts}/>}

                {displayError &&
                    <p className='bg-red-500/75 text-white mt-2 w-fit rounded-lg p-2'>{error}</p>
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
                    <CommentsContainer posts={dashboardPosts ? dashboardPosts : myPosts} comments={post.comments} updatePosts={updatePosts} updatePostsForMyPosts={updatePostsForMyPosts} post_id={post.id} currentUser={currentUser} toggleSetModalOpen={toggleSetModalOpen} deleteCommentError={deleteCommentError} commentIdToDelete={commentIdToDelete}/>
                    <button className='bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 ml-6 mb-2 cursor-pointer transition ease-in-out delay-110 hover:-translate-y-1 hover:scale-110 hover:bg-sage hover:text-white duration-300"' onClick={toggleSetShowComment}>Hide Comments</button>
                </>
            ) : (<div></div>)}
        </div>

        {modalOpen &&
            <Modal isModalOpen={modalOpen} toggleModal={toggleSetModalOpen} deletePost={deletePost} deleteComment={deleteComment} deleteSubComment={deleteSubComment} whatWeAreDeleting={whatWeAreDeleting} />
        }
        </>
    )
}

export default Post
