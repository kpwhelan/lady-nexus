import Post from '@/Components/Post'
import PostForm from '@/Components/PostForm';
import Authenticated from '@/Layouts/Authenticated'
import { Head } from '@inertiajs/inertia-react'
import React, { useEffect, useState } from 'react'

function MyPosts(props) {
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState([]);
    const [categories, setCategories] = useState([]);

    const fetchPosts = () => {
        axios.get('/posts/fetch-my-posts')
        .then(response => setPosts(response.data.posts));
    }

    useEffect(() => {
        fetchPosts();
        setUser(props.auth.user)
        setCategories(props.categories)
    },[]);

  return (
    <Authenticated
        auth={props.auth}
        errors={props.errors}
    >
        <Head title="My Posts" />

        {posts ? (
                <div className='flex justify-around'>
                    <div className='flex-initial w-2/3 max-h-screen overflow-scroll'>
                        {posts.map(post => (
                            <Post key={post.id} post={post} currentUser={props.auth.user} fetchPosts={fetchPosts} categories={props.categories} />
                        ))}
                    </div>

                    <div className='flex-initial w-1/3 mr-2 mt-5'>
                        <p className='bg-white rounded-xl p-2 max-w-fit mb-1'>{user.first_name} {user.last_name}</p>
                        <p className='bg-white rounded-xl p-2 max-w-fit mb-1'>Joined: {new Date(user.created_at).toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}</p>
                        <p className='bg-white rounded-xl p-2 max-w-fit mb-1'>{posts.length} posts</p>
                        <p className='bg-white rounded-xl p-2 max-w-fit mb-1'>{props.comment_count} comments</p>

                        <PostForm className="mt-4" categories={categories} />
                    </div>
                </div>
            )
            :
            (
                <div>
                    <p className='text-lg mx-auto'>You haven't posted anything yet...</p>
                    <PostForm categories={categories} />
                </div>
            )


        }
    </Authenticated>
  )
}

export default MyPosts
