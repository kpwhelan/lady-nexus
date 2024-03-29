import { useForm } from '@inertiajs/inertia-react';
import React, { useEffect, useState } from 'react'
import Input from './Input'
import Button from './Button';

function CommentInputEdit({ posts, updatePosts, updatePostsForMyPosts, existingComment, commentId, toggleSetDisplayEditBox }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        comment_body: '',
        comment_id: commentId
    });

    const [ error, setError ] = useState(null);

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

        axios.post(route('post-update-comment'), {
            comment_body: data.comment_body,
            comment_id: data.comment_id
        })
        .then(response => {
            if (response.status == 200) {
                let postIndex = posts.findIndex(post => post.id == response.data.comment.post_id);
                let commentIndex = posts[postIndex].comments.findIndex(comment => comment.id == commentId);

                posts[postIndex].comments[commentIndex].comment = response.data.comment.comment;

                if (updatePosts) {updatePosts(posts)}
                if (updatePostsForMyPosts) {updatePostsForMyPosts(posts)}
                toggleSetDisplayEditBox(false)
            }
        })
        .catch(error => {
            if (error.sub_comment_body) {
                setError(error.sub_comment_body)
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
                className="w-full"
                autoComplete="comment_body"
                isFocused={false}
                handleChange={onHandleChange}
                placeholder="Comment..."
                required
                id={`commend_edit_${commentId}`}
            />

            <Button className="mt-1" processing={processing}>
                Submit
            </Button>

            {error &&
                <p className='bg-red-500/75 text-white mt-2 w-fit p-2 rounded-lg'>{error}</p>
            }
        </form>
    </div>
  )
}

export default CommentInputEdit
