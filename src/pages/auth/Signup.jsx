import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

import Logo from "../../assets/logo.png";
import MailIcon from "../../assets/email.png";
import PasswordIcon from "../../assets/password.png";
import ShowIcon from "../../assets/show.png";
import HideIcon from "../../assets/hide.png";

import { signup } from "../../api/auth";

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordCheck, setShowPasswordCheck] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const hasName = name.trim().length > 0;
  const hasEmail = email.trim().length > 0;
  const hasPassword = password.trim().length > 0;
  const hasPasswordCheck = passwordCheck.trim().length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (password !== passwordCheck) {
      setErrorMsg("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    if (password.length < 8) {
      setErrorMsg("비밀번호는 영문, 숫자 포함 8자리 이상이어야 합니다.");
      return;
    }

    setLoading(true);
    try {
      const res = await signup({
        email,
        password,
        nickname: name,
      });

      if (!res.isSuccess) {
        throw new Error(res.message || "회원가입에 실패했습니다.");
      }

      setSuccessMsg("회원가입이 완료되었습니다. 로그인해 주세요!");
      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (error) {
      console.error("회원가입 오류:", error);
      setErrorMsg(error.message || "회원가입 중 문제가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-screen">
      <main className="signup-body">
        <img src={Logo} alt="ALÉA 로고" className="signup-logo" />

        <form className="signup-form" onSubmit={handleSubmit}>
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

          <p className="signup-hint">영문, 숫자 포함 8자리 이상</p>

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
