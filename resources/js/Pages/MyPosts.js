import Post from '@/Components/Post'
import PostForm from '@/Components/PostForm';
import Authenticated from '@/Layouts/Authenticated'
import { Head } from '@inertiajs/inertia-react'
import React, { useEffect, useState } from 'react'

function MyPosts(props) {
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState([]);

    useEffect(() => {
        setPosts(props.posts)
        setUser(props.auth.user)
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
                            <Post key={post.id} post={post} currentUser={props.auth.user} />
                        ))}
                    </div>

                    <div className='flex-initial w-1/3 mr-2 mt-5'>
                        <p>{user.first_name} {user.last_name}</p>
                        <p>Joined: {new Date(user.created_at).toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}</p>
                        <p>{props.posts.length} posts</p>
                        <p>{props.comment_count} comments</p>
                    </div>
                </div>
            )
            :
            (
                <div>
                    <p className='text-lg mx-auto'>You haven't posted anything yet...</p>
                    <PostForm />
                </div>
            )
        }
    </Authenticated>
  )
}

export default MyPosts
