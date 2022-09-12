import { useForm } from '@inertiajs/inertia-react';
import { data } from 'autoprefixer'
import React from 'react'
import Input from './Input'
import Button from './Button';

function CommentInput({ setPosts, post_id }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        comment_body: '',
        post_id: post_id
    });

    const onHandleChange = (event) => {
        setData(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value);
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('post-comment'), {
            onSuccess: () => {
                setPosts();
                data.comment_body = '';
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

            <Button className="mt-1" processing={processing}>
                Post
            </Button>
        </form>
    </div>
  )
}

export default CommentInput
