import React, { useState } from "react";
import "./Signup.css";

import Logo from "../../assets/logo.png";
import MailIcon from "../../assets/email.png";
import PasswordIcon from "../../assets/password.png";
import ShowIcon from "../../assets/show.png";
import HideIcon from "../../assets/hide.png";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordCheck, setShowPasswordCheck] = useState(false);

  const hasName = name.trim().length > 0;
  const hasEmail = email.trim().length > 0;
  const hasPassword = password.trim().length > 0;
  const hasPasswordCheck = passwordCheck.trim().length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    // 여기서 API 연결해서 회원가입 처리하기
    console.log({
      name,
      email,
      password,
      passwordCheck,
    });
  };

  return (
    <div className="signup-screen">
      <main className="signup-body">
        {/* 로고 */}
        <img src={Logo} alt="ALÉA 로고" className="signup-logo" />

        <form className="signup-form" onSubmit={handleSubmit}>
          {/* 이름 */}
          <div className="signup-field-group">
            <label className="signup-field-label">이름</label>
            <div
              className={`signup-field-input-wrap ${
                hasName ? "filled" : ""
              }`}
            >
              <img src={MailIcon} alt="name" className="signup-field-icon" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름을 입력해 주세요"
                className="signup-field-input"
                required
              />
            </div>
          </div>

          {/* 이메일 */}
          <div className="signup-field-group">
            <label className="signup-field-label">이메일</label>
            <div
              className={`signup-field-input-wrap ${
                hasEmail ? "filled" : ""
              }`}
            >
              <img src={MailIcon} alt="email" className="signup-field-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일을 입력해 주세요"
                className="signup-field-input"
                required
              />
            </div>
          </div>

          {/* 비밀번호 */}
          <div className="signup-field-group">
            <label className="signup-field-label">비밀번호</label>
            <div
              className={`signup-field-input-wrap ${
                hasPassword ? "filled" : ""
              }`}
            >
              <img
                src={PasswordIcon}
                alt="password"
                className="signup-field-icon"
              />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력해 주세요"
                className="signup-field-input"
                required
              />
              <button
                type="button"
                className="signup-field-right-btn"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                <img
                  src={showPassword ? ShowIcon : HideIcon}
                  alt="toggle password"
                  className="signup-field-right-icon"
                />
              </button>
            </div>
          </div>

          {/* 비밀번호 확인 */}
          <div className="signup-field-group">
            <label className="signup-field-label">비밀번호 확인</label>
            <div
              className={`signup-field-input-wrap ${
                hasPasswordCheck ? "filled" : ""
              }`}
            >
              <img
                src={PasswordIcon}
                alt="password-check"
                className="signup-field-icon"
              />
              <input
                type={showPasswordCheck ? "text" : "password"}
                value={passwordCheck}
                onChange={(e) => setPasswordCheck(e.target.value)}
                placeholder="비밀번호를 입력해 주세요"
                className="signup-field-input"
                required
              />
              <button
                type="button"
                className="signup-field-right-btn"
                onClick={() => setShowPasswordCheck((prev) => !prev)}
              >
                <img
                  src={showPasswordCheck ? ShowIcon : HideIcon}
                  alt="toggle password check"
                  className="signup-field-right-icon"
                />
              </button>
            </div>
          </div>

          {/* 안내 문구 */}
          <p className="signup-hint">영문, 숫자 포함 8자리 이상</p>

          {/* 회원가입 버튼 */}
          <button type="submit" className="signup-button">
            회원가입
          </button>
        </form>

        <div className="signup-footer">
          <div className="signup-home-indicator" />
        </div>
      </main>
    </div>
  );
}
