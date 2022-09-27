import React, { useEffect, useState } from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import axios from 'axios';
import Post from '@/Components/Post';
import PostForm from '@/Components/PostForm';

export default function Dashboard(props) {
    console.log(props.posts)
    const [posts, setPosts] = useState([]);
    const [offset, setOffset] = useState(20);

    const updatePosts = newPosts => {
        setPosts([...newPosts])
    }

    const fetchMorePosts = () => {
        axios.get(`/posts`, {params: {
            offset: offset
        }})
        .then(response => {
            let newOffset = offset + 20;
            setOffset(newOffset)
            setPosts(posts => [...posts, ...response.data.posts]);
        });
    }

    const handleScroll = (e) => {
        if (e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight) {
            fetchMorePosts();
        }
    }

    useEffect(() => {
        if (posts.length === 0) {
            setPosts(props.posts)
        }
    }, [])

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
        >
            <Head title="Dashboard" />
            <div className='flex justify-around'>
                <div className='flex-initial w-2/3 max-h-screen overflow-scroll' onScroll={handleScroll}>
                    {posts.map(post => (
                        <Post key={`post_${post.id}`} dashboardPosts={posts} post={post} updatePosts={updatePosts} currentUser={props.auth.user} categories={props.categories} />
                    ))}
                </div>

                <div className='flex-initial w-1/3 mr-2 mt-5'>
                    <PostForm categories={props.categories} />
                </div>
            </div>
        </Authenticated>
    );
}
