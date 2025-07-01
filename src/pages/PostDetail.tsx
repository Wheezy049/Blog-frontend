import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

interface Post {
    id: number;
    title: string;
    content: string;
}

function PostDetail() {

    const [post, setPost] = useState<Post | null>(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/blog/${id}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setPost(data);
            } catch (error) {
                console.error('Error fetching post:', error);
            }
        };
        fetchPost();
    })

  return (
    <div>
        PostDetail
        {post && (
            <div>
                <span>{post.id}</span>
                <h2>{post.title}</h2>
                <p>{post.content}</p>
            </div>
        )}
    </div>
  )
}

export default PostDetail