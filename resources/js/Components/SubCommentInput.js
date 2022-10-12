import { useForm } from '@inertiajs/inertia-react';
import React, { useState } from 'react'
import Button from './Button';
import Input from './Input';

function SubCommentInput({ posts, post_id, comment_id, updatePosts, updatePostsForMyPosts,  }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        sub_comment_body: '',
        comment_id: comment_id
    });
    const [ serverError, setServerError ] = useState('');
    const [ displayServerError, setDisplayServerError ] = useState(false);

    const onHandleChange = (event) => {
        setData(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value);
    };

    const submit = (e) => {
        e.preventDefault();

        axios.post(route('post-sub-comment'), {
            sub_comment_body: data.sub_comment_body,
            comment_id: data.comment_id
        })
        .then(response => {
            if (response.status == 200) {
                let postIndex = posts.findIndex(post => post.id == post_id);
                let commentIndex = posts[postIndex].comments.findIndex(comment => comment.id == data.comment_id);
                // let subCommentIndex = posts[postIndex].comments[commentIndex].sub_comments.find(sub_comment => sub_comment.id == response.data.sub_comment.id);

                posts[postIndex].comments[commentIndex].sub_comments = [...posts[postIndex].comments[commentIndex].sub_comments, response.data.sub_comment];
                posts[postIndex].comments[commentIndex].sub_comments.sort((a,b) => a.id - b.id)
                // posts[postIndex].comments.sort((a,b) => a.id - b.id)

                if (updatePosts) {updatePosts(posts)}
                if (updatePostsForMyPosts) {updatePostsForMyPosts(posts)}
                reset()
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
    <div className='mt-6'>
        <form onSubmit={submit}>
            <Input
                type="textarea"
                name="sub_comment_body"
                value={data.sub_comment_body}
                className="w-full md:w-2/3 rounded-lg h-10"
                autoComplete="sub_comment_body"
                isFocused={false}
                handleChange={onHandleChange}
                placeholder="Reply..."
                required
            />

            <Button className="my-1" processing={processing}>
                Submit
            </Button>

            {displayServerError &&
                <p className='bg-red-500/75 text-white mt-2 w-fit rounded-lg p-2'>{serverError}</p>
            }
        </form>
    </div>
  )
}

export default SubCommentInput
