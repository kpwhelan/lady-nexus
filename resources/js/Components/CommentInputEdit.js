import { useForm } from '@inertiajs/inertia-react';
import React, { useEffect, useState, useRef } from 'react'
import Input from './Input'
import Button from './Button';

function CommentInput({ setPosts, existingComment, commentId, toggleSetDisplayEditBox }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        comment_body: '',
        comment_id: commentId
    });

    const [ serverError, setServerError ] = useState('');
    const [ displayServerError, setDisplayServerError ] = useState(false);

    const onHandleChange = (event) => {
        setData(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value);
    };

    useEffect(() => {
        if (existingComment) {
            const commentEditBox = document.querySelector(`#commend_edit_${commentId}`);
            commentEditBox.textContent = existingComment
        }
    }, [])

    const submit = (e) => {
        e.preventDefault();

        post(route('post-update-comment'), {
            onSuccess: () => {
                setPosts();
                toggleSetDisplayEditBox(false);
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
                id={`commend_edit_${commentId}`}
            />

            <Button className="mt-1" processing={processing}>
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
