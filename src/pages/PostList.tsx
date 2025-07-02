import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

type Post = {
  id: number;
  title: string;
  content: string;
  author: string;
  created_at: string;
  updated_at: string;
};

type userType = {
  username: string;
  email: string;
  id: number;
  exp: number;
};

function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<userType | null>(null);
  const navigate = useNavigate();

    const fetchUserData = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setUser(null);
      return;
    }
  try {
    const response = await fetch('http://localhost:8000/api/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const userData = await response.json();
      setUser(userData);
    } else {
      throw new Error('Failed to fetch user data');
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    setUser(null);
  }
};

  useEffect(() => {
    const token = localStorage.getItem("access_token"); 
    if (token) {
      try {
        const decodedUser = jwtDecode<userType>(token);

        // Check if token is expired
        const currentTime = Date.now() / 1000;
        if (decodedUser.exp < currentTime) {
          // Token expired, remove it
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          setUser(null);
        } else {
           fetchUserData();
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setUser(null);
      }
    }
  }, []);

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
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
    navigate("/");
  };

  const handleCreatePost = () => {
    if (!user) {
      toast.warning("You must be logged in to create a post.");
      navigate("/login");
    } else {
      navigate("/create-post");
    }
  };

  return (
    <div className="container mx-auto p-10">
      <div className="text-center mb-6">
        {user ? (
          <h1 className="text-3xl font-bold capitalize text-green-600">
            Hi, {user.username}! 👋
          </h1>
        ) : (
          <h1 className="text-2xl font-bold">Welcome to the Blog</h1>
        )}
      </div>
      <p className="text-center mt-4">
        This is a simple blog application built with React and Django.
      </p>
      <p className="text-center mt-2">Explore the posts and enjoy reading!</p>
      {user ? (
        <p className="text-green-500 text-center mt-2 font-semibold">
          You are logged in. Enjoy creating and editing posts!
        </p>
      ) : (
        <p className="text-red-500 text-center mt-2 font-semibold">
          You are not logged in. Please log in to create or edit posts.
        </p>
      )}
      <div className="flex justify-start gap-3 mt-6">
        {user ? (
          <>
            <Link to="/create-post">
              <button className="bg-blue-500 text-white px-4 py-2 rounded mt-6 hover:bg-blue-600 transition-colors duration-200">
                Create New Post
              </button>
            </Link>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded mt-6 hover:bg-blue-600 transition-colors duration-200"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleCreatePost}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-6 hover:bg-blue-600 transition-colors duration-200"
            >
              Create New Post
            </button>
            <Link to="/login">
              <button className="bg-blue-500 text-white px-4 py-2 rounded mt-6 hover:bg-blue-600 transition-colors duration-200">
                Login
              </button>
            </Link>
            <Link to="/register">
              <button className="bg-blue-500 text-white px-4 py-2 rounded mt-6 hover:bg-blue-600 transition-colors duration-200">
                Register
              </button>
            </Link>
          </>
        )}
      </div>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 list-type-none mt-6">
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
                {user && (
                  <Link to={`/edit-post/${post.id}`}>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200">
                      Edit Post
                    </button>
                  </Link>
                )}
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
