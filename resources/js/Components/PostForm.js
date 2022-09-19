import React, { useEffect, useRef, useState } from 'react'
import { useForm } from '@inertiajs/inertia-react';
import Input from './Input';
import Button from './Button';
import Label from './Label';

function PostForm({ categories, className }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        post_body: '',
        category_id: ''
    });

    const [isCategorySelected, setIsCategorySelected] = useState(false);
    const [categoryId, setCategoryId] = useState(null);
    const [ error, setError ] = useState('');
    const [ displayError, setDisplayError ] = useState(false);

    const onHandleChange = (event) => {
        setData(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value);
    };

    useEffect(() => {
        selectCategory(categoryId)
    }, [categoryId, isCategorySelected])

    const selectCategory = (categoryId) => {
        if (categoryId) {
            const category_element = document.querySelector(`#category_${categoryId}`);

            if (isCategorySelected) {
                data.category_id = categoryId;

                category_element.classList.add('bg-sage');
                category_element.classList.add('text-white')
                category_element.classList.remove('bg-gray-200');

                const remainingCategories = document.querySelectorAll('.categories');
                remainingCategories.forEach(element => {
                    if (element.attributes.data.value != categoryId) {
                        element.style.display = 'none';
                    }
                })
            } else if (!isCategorySelected) {
                data.category = '';
                category_element.classList.remove('bg-sage');
                category_element.classList.remove('text-white')
                category_element.classList.add('bg-gray-200');
                const remainingCategories = document.querySelectorAll('.categories');

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

        post(route('create-post'), {
            onError: error => {
                if (error.message) {
                    setError(error.message);
                    setDisplayError(true);
                } else if (error.category_id) {
                    setError('You have to select a category!')
                    setDisplayError(true);
                }

                setTimeout(() => {
                    setDisplayError(false)
                }, 5000);
            }
        });
    };

  return (
        <form className={className} onSubmit={submit}>
            <Label forInput="post_body" value="Post Something Awesome" className={"text-lg"}/>
            <Input
                type="textarea"
                name="post_body"
                value={data.comment_body}
                className="w-full"
                autoComplete="post_body"
                isFocused={false}
                handleChange={onHandleChange}
                placeholder="What's on your mind...?"
                required
             />

            <div className='flex flex-wrap mt-1'>
                {categories.map(category => (
                    <span key={category.id} data={category.id} id={`category_${category.id}`} onClick={() => {toggleIsCategorySelected(); setCategoryId(category.id)}} className="categories inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 cursor-pointer transition ease-in-out delay-110 hover:-translate-y-1 hover:scale-110 hover:bg-sage hover:text-white duration-300">{category.name}</span>
                ))}
            </div>
             <Button className="mt-1" processing={processing}>
                Post
            </Button>

            {displayError &&
                <p className='bg-red-500/75 text-white mt-2 p-2 w-fit'>{error}</p>
            }
        </form>
  )
}

export default PostForm
