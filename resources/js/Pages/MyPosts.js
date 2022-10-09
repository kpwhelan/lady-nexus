import Post from '@/Components/Post'
import PostForm from '@/Components/PostForm';
import SelectBox from '@/Components/SelectBox';
import Authenticated from '@/Layouts/Authenticated'
import { Head } from '@inertiajs/inertia-react'
import React, { useEffect, useState } from 'react'

function MyPosts(props) {
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState([]);
    const [categories, setCategories] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [offset, setOffset] = useState(0);
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

    const fetchMorePosts = () => {
        axios.get('/posts/fetch-my-posts', {params: {
            offset: offset
        }})
        .then(response => {
            let newOffset = offset + 20;
            setOffset(newOffset)
            setPosts(posts => [...posts, ...response.data.posts]);
        });
    }

    useEffect(() => {
        if (posts.length === 0) {
            setPosts(props.posts)
        }
        setUser(props.auth.user)
        setCategories(props.categories)
        setCategoryFilters(props.categories.map(category => (
            {value: category.name, label: category.name}
        )))
    },[]);

    //hacky work around for posts not updating when you make a new post form myposts page
    useEffect(() => {
        if (posts.length > 0) {
            setPosts(props.posts)
        }
    }, [props.posts])

    const handleScroll = (e) => {
        if (posts.length >= 20 && e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight) {
            fetchMorePosts();
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

        {posts ? (
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
                        <PostForm className="mt-4" categories={categories} />
                    </div>

                    {modalOpen && <Modal toggleModal={toggleSetModalOpen} deletePost={deletePost} whatWeAreDelting='post' />}
                </div>
            )
            :
            (
                <div className='flex justify-around'>
                    <div className='flex-initial w-2/3 max-h-screen overflow-scroll'>
                            <p>No posts yet...</p>
                    </div>
                    <div>
                        <PostForm categories={categories} />
                    </div>
                </div>
            )


        }
    </Authenticated>
  )
}

export default MyPosts
