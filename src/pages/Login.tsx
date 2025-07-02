import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const loginUser = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        if (!response.ok) {
          const errMsg = data.error || "An unexpected error occurred";
          toast.error(errMsg);
          setLoading(false);
          return;
        }
        localStorage.setItem("access_token", data.accessToken);
        toast.success(data.message || "Login successful!");
        navigate("/");
      } catch (error) {
        console.error("Error logging in user:", error);
        const errMsg =
          error instanceof Error && error.message
            ? error.message
            : "An unexpected error occurred";
        toast.error(errMsg);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    loginUser();
  };

  return (
    <div className="container m-auto justify-center flex items-center h-screen bg-gray-100">
      <div className="bg-white items-center flex flex-col rounded-lg shadow-md w-full max-w-md p-10">
        <h1 className="text-2xl font-bold mb-6">Login</h1>
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium mb-2"
            >
              Username:
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border border-gray-300 p-2 w-full rounded"
              required
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-2"
            >
              Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 p-2 w-full rounded"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200 w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="w-7 h-7 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mr-2"></div>
                <span>Logging in...</span>
              </>
            ) : (
              "Login"
            )}
          </button>
          <p className="text-sm text-gray-500 mt-4">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-500 hover:underline">
              Register
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
