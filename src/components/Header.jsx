import React from "react";
import "./Header.css";

import Right from "../assets/right.png"; 

export default function Header() {
    return (
      <div className="status-bar">
        <span className="status-time">9:41</span>

        <img src={Right} alt="icons" className="right-icons" />
      </div>
    );
  }