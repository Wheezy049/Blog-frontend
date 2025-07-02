import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

function PostForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(false);
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
      if (id) {
        try {
          const response = await axios.get(
            `http://localhost:8000/api/blog/${id}`
          );
          const post = response.data;
          setTitle(post.title);
          setContent(post.content);
          setAuthor(post.author);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching post:", error);
          setLoading(false);
          setTitle("");
          setContent("");
          setAuthor("");
          return;
        }
      } else {
        setTitle("");
        setContent("");
        setAuthor("");
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !author) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);

    const postData = {
      title,
      content,
      author,
    };

    const createPost = async () => {
      try {
        if (!id) {
          await axios.post("http://localhost:8000/api/blog", postData);
          toast.success("Post created successfully!");
        } else {
          await axios.put(`http://localhost:8000/api/blog/${id}`, postData);
          toast.success("Post updated successfully!");
        }
        navigate("/");
        setLoading(false);
      } catch (error) {
        console.error("Error creating post:", error);
        setLoading(false);
      }
    };

    createPost();
  };

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
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
            onChange={(e) => setAuthor(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
            onChange={handleContentChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter post content"
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex gap-2 items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading && (
            <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          )}
          {id
            ? loading
              ? "Updating..."
              : "Update Post"
            : loading
            ? "Creating..."
            : "Create Post"}
        </button>
      </form>
    </div>
  );
}

export default PostForm;
