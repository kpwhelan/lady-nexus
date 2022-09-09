import React, { useEffect, useState } from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import axios from 'axios';
import Post from '@/Components/Post';

export default function Dashboard(props) {
    const [welcomePosts, setWelcomePosts] = useState([]);

    useEffect(() => {
        console.log(showWelcomePosts)
        axios.get('/posts')
        .then(response => setWelcomePosts(response.data.posts));
    }, [])

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
        >
            <Head title="Dashboard" />

            {welcomePosts.map(post => (
                <Post key={post.id} post={post} />
            ))}

        </Authenticated>
    );
}
