import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

function PostForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [content]);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8000/api/blog/${id}`
        );
        const post = response.data;
        setTitle(post.title);
        setContent(post.content);
        setAuthor(post.author);
      } catch (error) {
        console.error("Error fetching post:", error);
        toast.error("Failed to load post. Please try again.");
        setTitle("");
        setContent("");
        setAuthor("");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      toast.warning("You must be logged in to create or edit a post.");
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim() || !author.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (submitting) return; // Prevent double submission

    setSubmitting(true);

    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        toast.error("You must be logged in to create or edit a post.");
        navigate("/login");
        return;
      }

      const postData = {
        title: title.trim(),
        content: content.trim(),
        author: author.trim(),
      };

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (id) {
        await axios.put(
          `http://localhost:8000/api/blog/${id}`,
          postData,
          config
        );
        toast.success("Post updated successfully!");
      } else {
        await axios.post("http://localhost:8000/api/blog", postData, config);
        toast.success("Post created successfully!");
      }

      navigate("/");
    } catch (error: any) {
      console.error("Error saving post:", error);

      // Handle specific error cases
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        navigate("/login");
      } else if (error.response?.status === 403) {
        toast.error("You don't have permission to perform this action.");
      } else {
        toast.error(
          error.response?.data?.message ||
            `Failed to ${id ? "update" : "create"} post. Please try again.`
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-20">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        <span className="ml-2">Loading post...</span>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-center text-2xl font-bold mt-10">
        {id ? "Edit Post" : "Create New Post"}
      </h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-6">
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="title"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={submitting}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline disabled:opacity-50"
            placeholder="Enter post title"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="author"
          >
            Author
          </label>
          <input
            type="text"
            id="author"
            value={author}
            required
            disabled={submitting}
            onChange={(e) => setAuthor(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline disabled:opacity-50"
            placeholder="Enter author name"
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="content"
          >
            Content
          </label>
          <textarea
            id="content"
            value={content}
            ref={textareaRef}
            required
            rows={1}
            cols={50}
            disabled={submitting}
            onChange={handleContentChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline disabled:opacity-50"
            placeholder="Enter post content"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex gap-2 items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed w-full"
        >
          {submitting && (
            <div className="w-4 h-4 border-2 border-gray-300 border-t-white rounded-full animate-spin"></div>
          )}
          {id
            ? submitting
              ? "Updating..."
              : "Update Post"
            : submitting
            ? "Creating..."
            : "Create Post"}
        </button>
      </form>
    </div>
  );
}

export default PostForm;
