import React from "react";
import { Route, Routes } from "react-router-dom";
import PostList from "./pages/PostList";
import PostDetail from "./pages/PostDetail";
import PostForm from "./pages/PostForm";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<PostList />} />
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route path="/edit-post/:id" element={<PostForm />} />
        <Route path="/create-post" element={<PostForm />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
