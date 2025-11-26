import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Login from "./pages/auth/Login.jsx";

export default function App() {
  return (
    
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
      
  );
}
