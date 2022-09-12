import React, { useEffect, useState } from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import axios from 'axios';
import Post from '@/Components/Post';

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

            {posts.map(post => (
                <Post key={post.id} post={post} setPosts={fetchPosts} />
            ))}

        </Authenticated>
    );
}
