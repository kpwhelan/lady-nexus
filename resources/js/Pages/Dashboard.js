import React, { useEffect, useState } from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import axios from 'axios';
import Post from '@/Components/Post';
import PostForm from '@/Components/PostForm';

export default function Dashboard(props) {
    const [posts, setPosts] = useState([]);

    const fetchPosts = () => {
        axios.get('/posts')
        .then(response => setPosts(response.data.posts));
    }

    useEffect(() => {
        fetchPosts();
    }, [])

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
        >
            <Head title="Dashboard" />
            <div className='flex justify-around'>
                <div className='flex-initial w-2/3 max-h-screen overflow-scroll'>
                    {posts.map(post => (
                        <Post key={post.id} post={post} currentUser={props.auth.user} setPosts={fetchPosts} />
                    ))}
                </div>

                <div className='flex-initial w-1/3 mr-2 mt-5'>
                    <PostForm categories={props.categories} />
                </div>
            </div>

        </Authenticated>
    );
}
