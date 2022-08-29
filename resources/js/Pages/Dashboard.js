import React, { useEffect, useState } from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import axios from 'axios';
import WelcomePost from '@/Components/WelcomePost';

export default function Dashboard(props) {
    const [welcomePosts, setWelcomePosts] = useState([]);
    const [showWelcomePosts, setShowWelcomePosts] = useState(true);

    useEffect(() => {
        console.log(showWelcomePosts)
        axios.get('/posts')
        .then(response => setWelcomePosts(response.data.posts));
    }, [])

    function toggleShowWelcomePosts() {
        setShowWelcomePosts(!showWelcomePosts);
    }

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
        >
            <Head title="Dashboard" />

            {showWelcomePosts ? (
                welcomePosts.map(post => (
                    <WelcomePost key={post.id} post={post} toggleShowWelcomePosts={toggleShowWelcomePosts} />
                ))
                ) : (<div></div>)}
        </Authenticated>
    );
}
