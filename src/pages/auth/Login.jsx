import React, { useState } from "react";
import "./Login.css";

import Logo from "../../assets/logo.png";
import MailIcon from "../../assets/email.png";
import PasswordIcon from "../../assets/password.png";
import ShowIcon from "../../assets/show.png";
import HideIcon from "../../assets/hide.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberId, setRememberId] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const hasEmail = email.trim().length > 0;
  const hasPassword = password.trim().length > 0;


  const handleSubmit = (e) => {
    e.preventDefault();
    // 여기서 API 연결해서 로그인 처리하기
    console.log({ email, password, rememberId });
  };

  return (
    <div className="login-screen">

      <main className="login-body">
        <img src={Logo} alt="ALÉA 로고" className="login-logo" />

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="field-group">
            <label className="field-label">이메일</label>
            <div className={`field-input-wrap ${hasEmail ? "field-filled" : ""}`}>
            <img src={MailIcon} alt="email" className="field-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일을 입력해 주세요"
                className="field-input"
                required
              />
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">비밀번호</label>
            <div className={`field-input-wrap ${hasPassword ? "field-filled" : ""}`}>
            <img src={PasswordIcon} alt="lock" className="field-icon" />

              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력해 주세요"
                className="field-input"
                required
              />

                <button
                type="button"
                className="field-right-btn"
                onClick={() => setShowPassword((prev) => !prev)}
                >
                <img
                    src={showPassword ? ShowIcon : HideIcon}
                    alt="toggle password"
                    className="field-right-icon"
                />
                </button>

            </div>
          </div>

          <button
            type="button"
            className="remember-row"
            onClick={() => setRememberId((prev) => !prev)}
          >
            <span
              className={
                "remember-checkbox" + (rememberId ? " checked" : "")
              }
            >
              {rememberId && <span className="remember-checkmark">✓</span>}
            </span>
            <span className="remember-label">아이디 저장</span>
          </button>


          <button type="submit" className="login-button">
            로그인
          </button>
        </form>


        <div className="login-footer">
          <button type="button" className="signup-link">
            계정이 없으신가요?
          </button>

          <div className="home-indicator" />
        </div>
      </main>
    </div>
  );
}
