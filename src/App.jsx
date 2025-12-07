import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

import Login from "./pages/auth/Login.jsx";
import HomePage from './pages/home/HomePage';
import BackgroundPage from './pages/background/BackgroundPage';
import MyPage from './pages/user/MyPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/background" element={<BackgroundPage />} />
      <Route path="/mypage" element={<MyPage />} />
    </Routes>
  );
}
