import Modal from '@/Components/Modal'
import Post from '@/Components/Post'
import PostForm from '@/Components/PostForm'
import Authenticated from '@/Layouts/Authenticated'
import { Head } from '@inertiajs/inertia-react'
import React, { useState, useEffect } from 'react'

function MyLikes(props) {
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState([]);
    const [categories, setCategories] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [offset, setOffset] = useState(0);

    const updatePosts = newPosts => {
        setPosts([...newPosts])
    }

    const toggleSetModalOpen = () => {
        if (modalOpen) {
            setModalOpen(false)
        } else if (!modalOpen) {
            setModalOpen(true)
        }
    }

    const fetchMoreLikedPosts = () => {
        axios.get('/posts/fetch-more-liked-posts', {params: {
            offset: offset
        }})
        .then(response => {
            let newOffset = offset + 20;
            setOffset(newOffset)
            setPosts(posts => [...posts, ...response.data.posts]);
        });
    }

    useEffect(() => {
        if (posts.length === 0) {
            setPosts(props.posts)
        }
        setUser(props.auth.user)
        setCategories(props.categories)
    },[]);

    const handleScroll = (e) => {
        if (posts.length > 20 && e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight) {
            fetchMoreLikedPosts();
        }
    }
  return (
    <Authenticated
        auth={props.auth}
        errors={props.errors}
    >
        <Head title="My Posts" />

        {posts ? (
                <div className='flex justify-around'>
                    <div className='flex-initial w-2/3 max-h-screen overflow-scroll' onScroll={handleScroll}>
                        {posts.map(post => (
                            <Post key={post.id} post={post} myPosts={posts} currentUser={props.auth.user} updatePostsForMyPosts={updatePosts} categories={props.categories} />
                        ))}
                    </div>

                    <div className='flex-initial w-1/3 mr-2 mt-5'>
                        <p className='bg-white rounded-xl p-2 max-w-fit mb-1'>{user.first_name} {user.last_name}</p>
                        <p className='bg-white rounded-xl p-2 max-w-fit mb-1'>Joined: {new Date(user.created_at).toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}</p>
                        <p className='bg-white rounded-xl p-2 max-w-fit mb-1'>{posts.length} {posts.length == 1 ? 'post' : 'posts'}</p>
                        <p className='bg-white rounded-xl p-2 max-w-fit mb-1'>{props.comment_count > 0 ? props.comment_count : 0} {props.comment_count == 1 ? 'comment' : 'comments'}</p>

                        <PostForm className="mt-4" categories={categories} />
                    </div>

                    {modalOpen && <Modal toggleModal={toggleSetModalOpen} deletePost={deletePost} whatWeAreDelting='post' />}
                </div>
            )
            :
            (
                <div className='flex justify-around'>
                    <div className='flex-initial w-2/3 max-h-screen overflow-scroll'>
                            <p>You haven't liked anything yet...</p>
                    </div>
                    <div>
                        <p className='text-lg mx-auto'>You haven't posted anything yet...</p>
                        <PostForm categories={categories} />
                    </div>
                </div>
            )


        }
    </Authenticated>
  )
}

export default MyLikes
