import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Post = {
  id: number;
  title: string;
  content: string;
  author: string;
  created_at: string;
  updated_at: string;
};

function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/blog");
        const data = response.data;
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, [posts]);

  return (
    <div className="container mx-auto p-10">
      <h1 className="flex justify-center item-center m-auto text-center text-2xl font-bold">
        Welcome to the Blog
      </h1>
      <p className="text-center mt-4">
        This is a simple blog application built with React and Django.
      </p>
      <p className="text-center mt-2">Explore the posts and enjoy reading!</p>
      <Link to="/create-post">
        <button className="bg-blue-500 text-white px-4 py-2 rounded mt-6 hover:bg-blue-600 transition-colors duration-200">
          Create New Post
        </button>
      </Link>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 list-type-none mt-10">
        {posts.map((post) => (
          <li key={post.id} className="h-full">
            <div className="bg-gray-100 px-4 pt-4 pb-2 rounded-lg shadow-md mb-4 hover:bg-gray-200 transition-transform duration-200 h-full transform hover:scale-105 flex flex-col justify-between">
              <div>
                <Link to={`/posts/${post.id}`}>
                  <h2 className="text-xl font-semibold">{post.title}</h2>
                  <p className="text-sm mt-2">
                    {post.content.slice(0, 150)}...
                  </p>
                </Link>
              </div>
              <div className="mt-8 mb-2 flex justify-between items-center">
                <Link to={`/edit-post/${post.id}`}>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200">
                    Edit Post
                  </button>
                </Link>
                <Link to={`/posts/${post.id}`}>
                  <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-200">
                    View Post Details
                  </button>
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PostList;
