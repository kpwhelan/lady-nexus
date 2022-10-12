import React, { useEffect, useState } from 'react';
import Post from './Post';
import ProfilePicture from './ProfilePicture';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function UserProfile({ user, toggleSetDisplayUserProfile, currentUser }) {
    const [limit, setLimit] = useState(20);
    const [posts, setPosts] = useState([]);

    const getPosts = () => {
        axios.get(route('get-user-profile-posts'), {params: {
            limit: limit,
            user_id: user.id
        }})
        .then(response => {
            let newLimit = limit + 20;
            setLimit(newLimit)
            setPosts(posts => [...posts, ...response.data.posts]);
        });
    }

    useEffect(() => {
        getPosts()
    }, [])

    const handleScroll = (e) => {
        if (posts.length >= 20 && e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight) {
            getPosts();
        }
    }

  return (
    <div className="fixed top-20 bottom-2 right-2 left-2 md:inset-3 bg-sage/70 backdrop-blur-sm">
        <div className='overflow-scroll md:flex fixed inset-2 md:inset-4 md:top-16 md:bottom-16 md:left-48 md:right-48 bg-white/80 md:p-5'>
        <div onClick={toggleSetDisplayUserProfile} className="cursor-pointer">
            <FontAwesomeIcon icon={faX} />
        </div>
            <div className='bg-white md:h-full p-2 md:ml-auto'>
                <h1 className='text-xl underline'>Account Details</h1>
                <ProfilePicture profilePictureUrl={user.temp_profile_picture_url} className={"w-46 h-36 my-2"} defaultSize="2x" />
                <p className='bg-white rounded-xl p-2 max-w-fit mb-1'>{user.username}</p>
                <p className='bg-white rounded-xl p-2 max-w-fit mb-1'>Joined: {new Date(user.created_at).toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}</p>
            </div>
            <div className="md:mr-auto overflow-scroll bg-white md:h-full md:p-2 w-5/5 md:w-3/5 md:max-w-3/5" onScroll={handleScroll}>
                {posts ? (
                    posts.map(post => (
                        <Post key={`profile_post_${post.id}`} post={post} currentUser={currentUser} />
                    ))
                )
                :
                (
                    <div class="flex justify-center items-center">
                        <div class="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>
                )
                }
            </div>
        </div>
    </div>
  )
}

export default UserProfile
