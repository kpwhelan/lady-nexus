import { useForm } from '@inertiajs/inertia-react';
import React, { useEffect, useState } from 'react'
import Input from './Input'
import Button from './Button';

function SubCommentInputEdit({ posts, updatePosts, updatePostsForMyPosts, existingSubComment, subCommentId, toggleSetDisplayEditBox }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        sub_comment_body: '',
        sub_comment_id: subCommentId
    });

    const [ serverError, setServerError ] = useState('');
    const [ displayServerError, setDisplayServerError ] = useState(false);

    const onHandleChange = (event) => {
        setData(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value);
    };

    useEffect(() => {
        if (existingSubComment) {
            const subCommentEditBox = document.querySelector(`#sub_comment_edit_${subCommentId}`);
            subCommentEditBox.textContent = existingSubComment
        }
    }, [])

    const submit = (e) => {
        e.preventDefault();

        axios.post(route('post-update-sub-comment'), {
            sub_comment_body: data.sub_comment_body,
            sub_comment_id: data.sub_comment_id
        })
        .then(response => {
            if (response.status == 200) {
                const postIndex = posts.findIndex(post => post.id == response.data.post_id);
                const commentIndex = posts[postIndex].comments.findIndex(comment => comment.id == response.data.comment_id);
                const subCommentIndex = posts[postIndex].comments[commentIndex].sub_comments.findIndex(sub_comment => sub_comment.id == response.data.sub_comment.id);

                posts[postIndex].comments[commentIndex].sub_comments[subCommentIndex].sub_comment = response.data.sub_comment.sub_comment;

                posts[postIndex].comments[commentIndex].sub_comments.sort((a,b) => a.id - b.id);
                posts[postIndex].comments.sort((a,b) => a.id - b.id);

                if (updatePosts) {updatePosts(posts)}
                if (updatePostsForMyPosts) {updatePostsForMyPosts(posts)}
                toggleSetDisplayEditBox()
            }
        })
        .catch(error => {
            if (error.response) {
                setServerError(error.response.data.message);
                setDisplayServerError(true);

                setTimeout(() => {
                    setDisplayServerError(false)
                }, 5000);
            }
        })
    };

  return (
    <div className='mx-6'>
        <form onSubmit={submit}>
            <Input
                type="textarea"
                name="sub_comment_body"
                value={data.sub_comment_body}
                className="w-full"
                autoComplete="sub_comment_body"
                isFocused={false}
                handleChange={onHandleChange}
                placeholder="Reply"
                required
                id={`sub_comment_edit_${subCommentId}`}
            />

            <Button className="mt-1" processing={processing}>
                Submit
            </Button>

            {displayServerError &&
                <p className='bg-red-500/75 text-white mt-2 p-2 w-fit rounded-lg'>{serverError}</p>
            }
        </form>
    </div>
  )
}

export default SubCommentInputEdit
