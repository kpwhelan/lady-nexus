import Modal from '@/Components/Modal'
import Post from '@/Components/Post'
import PostForm from '@/Components/PostForm'
import SelectBox from '@/Components/SelectBox'
import Authenticated from '@/Layouts/Authenticated'
import { Head } from '@inertiajs/inertia-react'
import React, { useState, useEffect } from 'react'

function MyLikes(props) {
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [limit, setLimit] = useState(20);
    const [categoryFilters, setCategoryFilters] = useState([]);
    const [isFilterSet, setIsFilterSet] = useState(false);
    const [preFilterPosts, setPreFilterPosts] = useState([]);

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
        const currentPostsLength = posts.length
        axios.get('/posts/fetch-more-liked-posts', {params: {
            current_posts_length: currentPostsLength,
            limit: limit
        }})
        .then(response => {
            let newLimit = limit + 20;
            setLimit(newLimit)
            setPosts(posts => [...posts, ...response.data.posts]);
        });
    }

    useEffect(() => {
        if (posts.length === 0) {
            setPosts(props.posts)
        }
        setUser(props.auth.user)

        setCategoryFilters(props.categories.map(category => (
            {value: category.name, label: category.name}
        )))
    },[]);

    const handleScroll = (e) => {
        if (posts.length >= 20 && (e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight)) {
            fetchMoreLikedPosts();
        }
    }

    const filter = (filters, posts) => {
        if (filters.length > 0) {
            let newPosts = posts.filter(post => {
               return filters.includes(post.category.name)
            })

            updatePosts(newPosts);
            setIsFilterSet(true);
        } else if (filters.length == 0) {
            updatePosts(preFilterPosts);
            setIsFilterSet(false);
        }
    }

    const beginFilter = values => {
        const filters = values.map(value => value.value);

        if (!isFilterSet) {
            setPreFilterPosts(posts);

            filter(filters, posts)
        } else if (isFilterSet) {
            filter(filters, preFilterPosts)
        }
    }

  return (
    <Authenticated
        auth={props.auth}
        errors={props.errors}
    >
        <Head title="My Posts" />

        {posts.length > 0 ? (
                <div className='sm:flex-col md:flex md:flex-row justify-around'>
                    <div className='flex-initial md:w-2/3 max-h-screen overflow-scroll' onScroll={handleScroll}>
                        <div className='ml-6 mt-2 w-3/6'>
                            <SelectBox beginFilter={beginFilter} categoryFilters={categoryFilters} />
                        </div>
                        {posts.map(post => (
                            <Post key={post.id} post={post} myPosts={posts} currentUser={props.auth.user} updatePostsForMyPosts={updatePosts} categories={props.categories} />
                        ))}
                    </div>

                    <div className='hidden md:block flex-initial md:w-1/3 mr-2 mt-5'>
                        <PostForm className="mt-4" categories={props.categories} />
                    </div>

                    {modalOpen && <Modal toggleModal={toggleSetModalOpen} deletePost={deletePost} whatWeAreDelting='post' />}
                </div>
            )
            :
            (
                <div className='flex justify-around'>
                    <div className='flex-initial w-2/3 max-h-screen overflow-scroll'>
                            <p className='text-xl font-semibold ml-10 mt-10'>You haven't liked anything yet...</p>
                    </div>
                    <div className='flex-initial w-1/3 mr-2 mt-5'>
                        <PostForm className="mt-4" categories={props.categories} />
                    </div>
                </div>
            )


        }
    </Authenticated>
  )
}

export default MyLikes
