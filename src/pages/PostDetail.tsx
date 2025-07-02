import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  created_at: string;
  updated_at: string;
}

function PostDetail() {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/blog/${id}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setPost(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching post:", error);
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    setLoading(true);
    try {
      await axios.delete(`http://localhost:8000/api/blog/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLoading(false);
      toast.success("Post deleted successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error deleting post:", error);
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-10">
      <h1 className="text-4xl font-bold mb-6">Post Details</h1>
      <div className="bg-gray-50 rounded-lg shadow-md p-6">
        <div className="mb-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold">{post?.title}</h1>
          <p className="text-xl font-semibold text-gray-500">
            Author: {post?.author}
          </p>
        </div>
        <p className="text-gray-700 text-base mb-4">{post?.content}</p>
        <div className="mt-6 flex justify-between items-center">
          <p className="text-sm text-gray-500 font-medium">
            Created at:{" "}
            {post?.created_at
              ? new Date(post.created_at).toLocaleDateString()
              : "N/A"}
          </p>
          <p className="text-sm text-gray-500 font-medium">
            Last Updated at:{" "}
            {post?.updated_at
              ? new Date(post.updated_at).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
      </div>
      <div className="mt-3 flex justify-end">
        {token && (
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:shadow-outline flex gap-2 items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading && (
              <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            )}
            {loading ? "Deleting..." : "Delete Post"}
          </button>
        )}
      </div>
    </div>
  );
}

export default PostDetail;
