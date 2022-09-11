import React, { useEffect, useState } from 'react'
import axios from 'axios'

function Comment({ comment }) {
    const [user, setUser] = useState([]);

    useEffect(() => {
        axios.get(`/comments/user/${comment.user_id}`)
        .then(response => setUser(response.data.user))
    }, []);

  return (
    <div className="px-6 py-4">
        <p>{user.first_name} {user.last_name}</p>
        <p className="text-gray-700 text-base">{comment.comment}</p>
    </div>
  )
}

export default Comment
