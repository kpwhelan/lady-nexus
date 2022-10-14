import React, { useEffect, useState } from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import axios from 'axios';
import Post from '@/Components/Post';
import PostForm from '@/Components/PostForm';
import SelectBox from '@/Components/SelectBox';

export default function Dashboard(props) {
    const [posts, setPosts] = useState([]);
    const [offset, setOffset] = useState(20);
    const [categoryFilters, setCategoryFilters] = useState([]);
    const [isFilterSet, setIsFilterSet] = useState(false);
    const [preFilterPosts, setPreFilterPosts] = useState([]);

    const updatePosts = newPosts => {
        setPosts([...newPosts])
    }

    const fetchMorePosts = () => {
        axios.get(route('more-dashboard-posts'), {params: {
            offset: offset
        }})
        .then(response => {
            let newOffset = offset + 20;
            setOffset(newOffset)
            setPosts(posts => [...posts, ...response.data.posts]);
        });
    }

    const handleScroll = (e) => {
        if (posts.length >= 20 && e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight) {
            fetchMorePosts();
        }
    }

    useEffect(() => {
        if (posts.length === 0) {
            setPosts(props.posts)
        }

        setCategoryFilters(props.categories.map(category => (
            {value: category.name, label: category.name}
        )))
    }, [])

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
            <Head title="Nexus" />

            {posts ? (
                <div className='sm:flex-col md:flex h-screen md:flex-row justify-around'>
                    <div className='flex-initial md:w-2/3 h-screen overflow-scroll' onScroll={handleScroll}>
                        <div className='ml-6 mt-2 mb-2 w-3/6'>
                            <SelectBox beginFilter={beginFilter} categoryFilters={categoryFilters} />
                        </div>

                        {posts.map(post => (
                            <Post key={`post_${post.id}`} dashboardPosts={posts} post={post} updatePosts={updatePosts} currentUser={props.auth.user} categories={props.categories} />
                        ))}
                    </div>

                    <div className='hidden md:block flex-initial md:w-1/3 mr-2 mt-5'>
                        <PostForm categories={props.categories} />
                    </div>
                </div>
            )
            :
            (
                <div className='flex justify-around'>
                    <div className='flex-initial w-2/3 max-h-screen overflow-scroll'>
                            <p className='text-xl font-semibold ml-10 mt-10'>No one has posted yet, you can be the first one!</p>
                    </div>
                    <div className='flex-initial w-1/3 mr-2 mt-5'>
                        <PostForm className="mt-4" categories={props.categories} />
                    </div>
                </div>
            )

            }

        </Authenticated>
    );
}
