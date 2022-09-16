import { useForm } from '@inertiajs/inertia-react';
import React, { useEffect, useState, useRef } from 'react'
import Input from './Input'
import Button from './Button';

function CommentInput({ setPosts, post_id }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        comment_body: '',
        post_id: post_id
    });
    const [ serverError, setServerError ] = useState('');
    const [ displayServerError, setDisplayServerError ] = useState(false);

    const onHandleChange = (event) => {
        setData(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value);
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('post-comment'), {
            onSuccess: () => {
                setPosts();
                data.comment_body = '';
            },
            onError: error => {
                setServerError(error.message);
                setDisplayServerError(true);

                setTimeout(() => {
                    setDisplayServerError(false)
                }, 5000);
            }
        });
    };

  return (
    <div className='mx-6'>
        <form onSubmit={submit}>
            <Input
                type="textarea"
                name="comment_body"
                value={data.comment_body}
                className="w-full"
                autoComplete="comment_body"
                isFocused={false}
                handleChange={onHandleChange}
                placeholder="Comment..."
                required
            />

            <Button className="my-1" processing={processing}>
                Post
            </Button>

            {displayServerError &&
                <p className='bg-red-500/75 text-white mt-2 w-fit'>{serverError}</p>
            }
        </form>
    </div>
  )
}

export default CommentInput
