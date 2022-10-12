import { useForm } from '@inertiajs/inertia-react';
import React, { useState } from 'react'
import Input from './Input'
import Button from './Button';
import axios from 'axios';

function CommentInput({ posts, updatePosts, updatePostsForMyPosts, post_id }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        comment_body: '',
        post_id: post_id
    });

    const [ error, setError ] = useState(null);

    const onHandleChange = (event) => {
        setData(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value);
    };

    const submit = (e) => {
        e.preventDefault();

        axios.post(route('post-comment'), {
            comment_body: data.comment_body,
            post_id: data.post_id
        })
        .then(response => {
            if (response.status == 200) {
                let postIndex = posts.findIndex(post => post.id == post_id);

                posts[postIndex].comments = [...posts[postIndex].comments, response.data.comment];
                posts[postIndex].comments.sort((a, b) => a.id - b.id)

                if (updatePosts) {updatePosts(posts)}
                if (updatePostsForMyPosts) {updatePostsForMyPosts(posts)}
                reset()
            }
        })
        .catch(error => {
            if (error.comment_body) {
                setError(error.comment_body)
            } else if (error.response) {
                setError(error.response.data.message);
            }

            setTimeout(() => {
                setError(null)
            }, 7000);
        })
    };

  return (
    <div className='mx-6'>
        <form onSubmit={submit}>
            <Input
                type="textarea"
                name="comment_body"
                value={data.comment_body}
                className="w-2/3 rounded-lg"
                autoComplete="comment_body"
                isFocused={false}
                handleChange={onHandleChange}
                placeholder="Comment..."
                required
            />

            <Button className="my-1" processing={processing}>
                Submit
            </Button>

            {error &&
                <p className='bg-red-500/75 text-white mt-2 w-fit rounded-lg p-2'>{error}</p>
            }
        </form>
    </div>
  )
}

export default CommentInput
