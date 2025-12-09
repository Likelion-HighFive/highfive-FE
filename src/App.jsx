import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

import Login from "./pages/auth/Login.jsx";
import HomePage from './pages/home/HomePage';
import BackgroundPage from './pages/background/BackgroundPage';
import LikesPage from './pages/likes/LikesPage';
import MyPage from './pages/user/MyPage';
import Signup from './pages/auth/Signup.jsx';
import NavigationStart from "./pages/theme/NavigationStart.jsx";
import MyCarbonFootprint from './pages/footprint/MyCarbonFootprint';
import ChangeNamePage from './pages/user/ChangeNamePage';
import CreatePathPage from './pages/paths/CreatePathPage';
import Complete from './pages/theme/Complete.jsx';
import Detail from './pages/theme/Detail.jsx';


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/background" element={<BackgroundPage />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/likes" element={<LikesPage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/navigation" element={<NavigationStart />} />
      <Route path="/footprint" element={<MyCarbonFootprint />} />
      <Route path="/change-name" element={<ChangeNamePage />} />
      <Route path="/create-path" element={<CreatePathPage />} />
      <Route path="/complete" element={<Complete />} />
      <Route path="/detail" element={<Detail />} />
    </Routes>
  );
}
