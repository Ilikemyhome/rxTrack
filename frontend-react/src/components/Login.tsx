import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/auth.css";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const [rememberMe, setRememberMe] = useState(false);

  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

 
  const navigate = useNavigate();

  // Load saved email/token on page load
  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

 
  // Validation
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      setEmailError("Email is required.");
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Password is required.");
    } else {
      setPasswordError("");
    }
  }, [email, password]);

  // Login request to Django
  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const token = data.token;
        const patientId = data.patient_id;

        if(!token) {
          setPasswordError("Invalid server response");

          return;
        }

        // Save token based on Remember Me
        if (rememberMe) {
          localStorage.setItem("authToken", token);
          localStorage.setItem("savedEmail", email);
          if (patientId) localStorage.setItem("patientId", patientId);
        } else {
          sessionStorage.setItem("authToken", token);
          localStorage.removeItem("savedEmail");
          if (patientId) sessionStorage.setItem("patientId", patientId);
        }


        console.log("Logged in!");
        navigate("/dashboard");
      } else {
        setPasswordError("Invalid email or password");
        setShake(true);
        setTimeout(() => setShake(false), 300);
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Log in to continue</p>

        <form
          className={`auth-form ${shake ? "shake" : ""}`}
          onSubmit={(e) => {
            e.preventDefault();
            if (loading) return; // Prevent multiple submissions

            setEmailTouched(true);
            setPasswordTouched(true);

            if (!email || !password || emailError || passwordError) {
              setShake(true);
              setTimeout(() => setShake(false), 300);
              return;
            }

           
            handleLogin();
          }}
        >
          {/* EMAIL FIELD */}
          <div className="input-group">

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError("");

              }}
              
              onBlur={() => setEmailTouched(true)}
              className={emailError && emailTouched ? "error" : ""}
            />
            {emailError && emailTouched && (
              <p className="error-text">{emailError}</p>
            )}
          </div>

          {/* PASSWORD FIELD */}
          <div className="input-group">
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError("");
                }}
                onBlur={() => setPasswordTouched(true)}
                className={passwordError && passwordTouched ? "error" : ""}
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {passwordError && passwordTouched && (
              <p className="error-text">{passwordError}</p>
            )}
          </div>

          {/* REMEMBER ME */}
          <div className="remember-me">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <label htmlFor="remember">Remember me</label>
          </div>

          {/* LOGIN BUTTON */}
          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? <span className="spinner"></span> : null}
            {loading ? "Loading..." : "Log in"}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
