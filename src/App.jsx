import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

import Login from "./pages/auth/Login.jsx";
import HomePage from './pages/home/HomePage';
import BackgroundPage from './pages/background/BackgroundPage';
<<<<<<< HEAD
import MyPage from './pages/user/MyPage';
=======
import Signup from './pages/auth/Signup.jsx';
>>>>>>> 662f9c16b8da61f86ed444905d82bd29494a5406

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/background" element={<BackgroundPage />} />
<<<<<<< HEAD
      <Route path="/mypage" element={<MyPage />} />
=======
      <Route path="/signup" element={<Signup />} />
>>>>>>> 662f9c16b8da61f86ed444905d82bd29494a5406
    </Routes>
  );
}
