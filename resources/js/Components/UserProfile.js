import React, { useEffect, useState } from 'react';
import Post from './Post';
import ProfilePicture from './ProfilePicture';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from './Button';

function UserProfile({ user, toggleSetDisplayUserProfile, currentUser, categories }) {
    const [limit, setLimit] = useState(20);
    const [posts, setPosts] = useState([]);
    const [followersCount, setFollowersCount] = useState(0);
    const [isFollowedByUser, setIsFollowedByUser] = useState(false);
    const [displayFollowButton, setDisplayFollowButton] = useState(false);

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

    const getMorePosts = () => {
        const currentPostsLength = posts.length
        axios.get(route('get-more-user-profile-posts'), {params: {
            current_posts_length: currentPostsLength,
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
        if (user.followed_by) {
            setFollowersCount(user.followed_by.length);
        }

        if (user.id != currentUser.id) {
            if (user.followed_by?.find(follower => follower == currentUser.id)) {
                setIsFollowedByUser(true);
            }

            setDisplayFollowButton(true);
        }

        getPosts()
    }, [])

    const handleScroll = (e) => {
        if (posts.length >= 20 && (e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight)) {
            getMorePosts();
        }
    }

    const follow = () => {
        axios.post(route('follow'), {
            user_id_to_follow: post.user.id
        }).then(() => {
            setIsFollowedByUser(true)
        })
    }

    const unfollow = () => {
        axios.post(route('unfollow'), {
            user_id_to_unfollow: post.user.id
        }).then(() => {
            setIsFollowedByUser(false)
        })
    }

  return (
    <div className="fixed top-20 bottom-2 right-2 left-2 md:inset-3 bg-sage/70 backdrop-blur-sm">
        <div className='overflow-scroll md:flex fixed inset-2 md:inset-4 md:top-16 md:bottom-16 md:left-48 md:right-48 bg-white/80 md:p-5'>
        <div onClick={toggleSetDisplayUserProfile} className="cursor-pointer fixed top-6 right-6 md:static">
            <FontAwesomeIcon icon={faX} />
        </div>
            <div className='bg-white md:h-full p-2 md:ml-auto'>
                <h1 className='text-xl underline'>{user.username}</h1>
                <ProfilePicture profilePictureUrl={user.temp_profile_picture_url} className={"w-46 h-36 my-2"} defaultSize="2x" />
                {(isFollowedByUser && displayFollowButton) &&
                    <div className='cursor-pointer text-center' onClick={unfollow}>
                        <Button onClick={unfollow}>Unfollow</Button>
                    </div>
                }

                {(displayFollowButton && !isFollowedByUser) &&
                    <div className='cursor-pointer text-center' onClick={follow}>
                        <Button onClick={follow}>Follow</Button>
                    </div>
                }
                <p className='bg-white rounded-xl p-2 max-w-fit mb-1'>{user.first_name} {user.last_name}</p>
                <p className='bg-white rounded-xl max-w-fit mb-1 ml-1'>{followersCount} {followersCount == 1 ? 'follower' : 'followers'}</p>
                <p className='bg-white rounded-xl max-w-fit mb-1 ml-1'>{user.posts.length} {user.posts.length == 1 ? 'post' : 'posts'}</p>
                <p className='bg-white rounded-xl max-w-fit mb-1 ml-1'>Joined: {new Date(user.created_at).toLocaleDateString('en-us', {year:"numeric", month:"short", day:"numeric"})}</p>
            </div>
            <div className="md:mr-auto overflow-scroll bg-white md:h-full md:p-2 w-5/5 md:w-3/5 md:max-w-3/5" onScroll={handleScroll}>
                {posts ? (
                    posts.map(post => (
                        <Post key={`profile_post_${post.id}`} post={post} currentUser={currentUser} categories={categories} />
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
