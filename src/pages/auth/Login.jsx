import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

import Logo from "../../assets/logo.png";
import MailIcon from "../../assets/email.png";
import PasswordIcon from "../../assets/password.png";
import ShowIcon from "../../assets/show.png";
import HideIcon from "../../assets/hide.png";

import { login } from "../../api/auth";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberId, setRememberId] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const hasEmail = email.trim().length > 0;
  const hasPassword = password.trim().length > 0;

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberId(true);
    }
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await login({ email, password });


      if (!res.isSuccess) {
        throw new Error(res.message || "로그인에 실패했습니다.");
      }

      const accessToken = res.data?.access_token;
      const tokenType = res.data?.token_type;

      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
      }
      if (tokenType) {
        localStorage.setItem("tokenType", tokenType);
      }

      if (rememberId) {
        localStorage.setItem("rememberEmail", email);
      } else {
        localStorage.removeItem("rememberEmail");
      }

      navigate("/home");
    } catch (error) {
      console.error("로그인 오류:", error);
      setErrorMsg(error.message || "로그인 중 문제가 발생했습니다.");
    } finally {
      setLoading(false);
    }
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
          {errorMsg && (
            <p className="login-error-message">{errorMsg}</p>
          )}


<button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>


        <div className="login-footer">
  <button
    type="button"
    className="signup-link"
    onClick={() => navigate("/signup")}
  >
    계정이 없으신가요?
  </button>
</div>
      </main>
    </div>
  );
}
