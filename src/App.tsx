import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PostList from './pages/PostList';
import PostDetail from './pages/PostDetail';
import EditPost from './pages/EditPost';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<PostList />} />
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route path="/edit/:id" element={<EditPost />} />
      </Routes>
    </div>
  );
}

export default App;
