import React from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "./BackButton";
import { Eye, EyeOff } from "lucide-react";

type Step3Props = {
  password: string;
  confirmPassword: string;
  setPassword: (v: string) => void;
  setConfirmPassword: (v: string) => void;
  error: string;
  setError: (v: string) => void;
  firstName: string;
  lastName: string;
  dobMonth: string;
  dobDay: string;
  dobYear: string;
  phone: string;
  email: string;
  setStep: (v: number) => void;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (v: boolean) => void;
  handleSignup: () => void;
};

export default function Step3({
  password,
  confirmPassword,
  setPassword,
  setConfirmPassword,
  error,
  setError,
  firstName,
  lastName,
  dobMonth,
  dobDay,
  dobYear,
  phone,
  email,
  setStep,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  handleSignup
}: Step3Props) {
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/signup/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          dob: `${dobYear}-${dobMonth}-${dobDay}`,
          phone,
          email,
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Signup failed");
        return;
      }

      navigate("/dashboard");
    } catch {
      setError("Something went wrong");
    }
  };

  return (
    <div className="auth-content">
        

        <h1 className="auth-title">Secure your account</h1>
        <p className="auth-subtitle">Choose a strong password.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
            {error && <p className="error-text">{error}</p>}

          <div className="input-group">
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>


          <div className="input-group">
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>



            <button className="auth-button" type="button" onClick={handleSignup}>Create Account</button>
            <div className="auth-switch">
                Already have an account? <a href="/">Sign in</a>
            </div>
            <BackButton onClick={() => setStep(2)} />
        </form>
    </div>
  );
}
