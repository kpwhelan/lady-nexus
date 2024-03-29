import { useForm } from '@inertiajs/inertia-react';
import React, { useEffect, useState } from 'react'
import Input from './Input';
import Button from './Button';

function PostFormEdit({ className, postData, categories, previousCategoryId, toggleSetDisplayEditBox, updatePostsForDashboard, updatePostsForMyPosts, dashboardPosts, myPosts }) {
    //variable 'post' here refers to the post body of the form, not the user's post
    const { data, setData, post, processing, errors, reset } = useForm({
        post_body: postData.post,
        post_id: postData.id,
        category_id: previousCategoryId
    });

    const [error, setError] = useState(null);
    const [isCategorySelected, setIsCategorySelected] = useState(false);
    const [categoryId, setCategoryId] = useState(null);

    const onHandleChange = (event) => {
        setData(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value);
    };

    useEffect(() => {
        const postEditBox = document.querySelector(`#post_edit_${postData.id}`);
        postEditBox.textContent = postData.post
        setCategoryId(previousCategoryId)
        setIsCategorySelected(true)
    }, [])

    useEffect(() => {
        selectCategory(categoryId)
    }, [categoryId, isCategorySelected])

    const selectCategory = (categoryId) => {
        if (categoryId) {
            const category_element = document.querySelector(`#category_${categoryId}`);
            const remainingCategories = document.querySelectorAll('.categories-post-form-edit');

            if (isCategorySelected) {
                data.category_id = categoryId;

                category_element.classList.add('bg-sage');
                category_element.classList.add('text-white')
                category_element.classList.remove('bg-gray-200');

                remainingCategories.forEach(element => {
                    if (element.attributes.data.value != categoryId) {
                        element.style.display = 'none';
                    }
                })
            } else if (!isCategorySelected) {
                data.category_id = '';
                category_element.classList.remove('bg-sage');
                category_element.classList.remove('text-white')
                category_element.classList.add('bg-gray-200');

                remainingCategories.forEach(element => {
                    if (element.attributes.data.value != categoryId) {
                        element.style.display = 'inline';
                    }
                })
            }
        }
    }

    const toggleIsCategorySelected = () => {
        if (isCategorySelected) {
            setIsCategorySelected(false)
        } else if (!isCategorySelected) {
           setIsCategorySelected(true)
        }
    }

    const submit = (e) => {
        e.preventDefault();

        axios.post(route('post-update-post'), {
            post_body: data.post_body,
            post_id: data.post_id,
            category_id: data.category_id
        })
        .then(response => {
            if (response.status == 200) {
                if (dashboardPosts) {
                    let postIndex = dashboardPosts.findIndex(post => post.id == response.data.post.id);

                    dashboardPosts[postIndex] = response.data.post;
                } else if (myPosts) {
                    let postIndex = myPosts.findIndex(post => post.id == response.data.post.id);

                    myPosts[postIndex] = response.data.post;
                }


                toggleSetDisplayEditBox(false)

                if (updatePostsForDashboard) {updatePostsForDashboard(dashboardPosts)}
                if (updatePostsForMyPosts) {updatePostsForMyPosts(myPosts)}
            }
        })
        .catch(error => {
            if (error.post_body) {
                setError(error.post_body)
            } else if (error.category_id) {
                setError(error.category_id)
            } else if (error.response) {
                setError(error.response.data.message);
            }

            setTimeout(() => {
                setError(null)
            }, 7000);
        })
    };

  return (
    <form className={className} onSubmit={submit}>
            <Input
                type="textarea"
                name="post_body"
                value={data.comment_body}
                className="w-full"
                autoComplete="post_body"
                isFocused={false}
                handleChange={onHandleChange}
                required
                id={`post_edit_${postData.id}`}
             />

            <div className='flex flex-wrap mt-1'>
                {categories.map(category => (
                    <span key={category.id} data={category.id} id={`category_${category.id}`} onClick={() => {toggleIsCategorySelected(); setCategoryId(category.id)}} className="categories-post-form-edit inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 cursor-pointer transition ease-in-out delay-110 hover:-translate-y-1 hover:scale-110 hover:bg-sage hover:text-white duration-300">{category.name}</span>
                ))}
            </div>
             <Button className="mt-1 mr-1" processing={processing}>
                Submit
            </Button>

            {error &&
                <p className='bg-red-500/75 text-white mt-2 p-2 w-fit rounded-lg'>{error}</p>
            }
        </form>
  )
}

export default PostFormEdit
