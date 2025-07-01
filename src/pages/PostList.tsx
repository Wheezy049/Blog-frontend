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

  // Fetch posts from the backend API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/blog");
        const data = response.data;
        console.log("Fetched posts:", data);
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
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 list-type-none mt-10">
        {posts.map((post) => (
          <li key={post.id}>
            <Link
              to={`/posts/${post.id}`}
              className="bg-gray-100 px-4 pt-4 pb-2 rounded-lg shadow-md mb-4 hover:bg-gray-200 transition-transform duration-200 block h-full transform hover:scale-105"
            >
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="text-sm mt-2">{post.content}</p>
              <div className="mt-8 flex justify-between items-center">
                <p>
                  <strong>Author:</strong> {post.author}
                </p>
                <p>
                  <strong>Created At:</strong>{" "}
                  {new Date(post.created_at).toLocaleDateString()}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PostList;
