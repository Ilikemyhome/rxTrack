import React from "react";
import BackButton from "./BackButton";

type Step2Props = {
  phone: string;
  email: string;
  setPhone: (v: string) => void;
  setEmail: (v: string) => void;
  setStep: (v: number) => void;
  phoneTouched: boolean;
  setPhoneTouched: (v: boolean) => void;
  phoneError: string;
  setPhoneError: (v: string) => void;
  emailTouched: boolean;
  setEmailTouched: (v: boolean) => void;
  emailError: string;
  setEmailError: (v: string) => void;
  contactMethod: string;
  setContactMethod: (v: string) => void;
};

export default function Step2({
  phone,
  email,
  setPhone,
  setEmail,
  setStep,
  phoneTouched,
  setPhoneTouched,
  phoneError,
  setPhoneError,
  emailTouched,
  setEmailTouched,
  emailError,
  setEmailError,
  contactMethod,
  setContactMethod
}: Step2Props) {

  // --- PHONE FORMATTER ---
  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    const len = digits.length;

    if (len < 4) return digits;
    if (len < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  // --- PHONE VALIDATION ---
  const validatePhone = () => {
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10) {
      setPhoneError("Enter a valid phone number");
      return false;
    }
    setPhoneError("");
    return true;
  };

  React.useEffect(() => {
    validatePhone();
  }, [phone]);

  // --- EMAIL VALIDATION ---
  const validateEmail = () => {
    const v = email.trim();

    if (!v.includes("@") || !v.includes(".")) {
      setEmailError("Enter a valid email address");
      return false;
    }

    if (v.endsWith(".")) {
      setEmailError("Email cannot end with a dot");
      return false;
    }

    if (v.includes("..")) {
      setEmailError("Email cannot contain double dots");
      return false;
    }

    if (v.length < 5) {
      setEmailError("Email is too short");
      return false;
    }

    setEmailError("");
    return true;
  };

  React.useEffect(() => {
    validateEmail();
  }, [email]);

  return (
    <div className="auth-content">

      

      <h1 className="auth-title">How can we reach you?</h1>
      <p className="auth-subtitle">We'll send updates to your phone or email.</p>

      <form
      
        className="auth-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (!phoneError && !emailError) setStep(3);
        }}
      >
        
        {/* PHONE INPUT */}
        <div className="input-group">
          <input
            type="tel"
            inputMode="numeric"
            placeholder="Phone number"
            value={phone}
            className={phoneError && phoneTouched ? "error" : ""}
            onChange={(e) => {
              const formatted = formatPhone(e.target.value);
              setPhone(formatted);
            }}
            onBlur={() => setPhoneTouched(true)}
            required
          />
          {phoneError && phoneTouched && (
            <p className="error-text">{phoneError}</p>
          )}
        </div>

        {/* EMAIL INPUT */}
        <div className="input-group">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            className={emailError && emailTouched ? "error" : ""}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setEmailTouched(true)}
            required
          />
          {emailError && emailTouched && (
            <p className="error-text">{emailError}</p>
          )}
        </div>

        {/* PREFERRED CONTACT METHOD */}
        <div className="input-group">
          <label className="input-label">Preferred contact method</label>
          
        <select
          className="auth-select"
          value={!!phoneError || !!emailError ? "" : contactMethod}
          onChange={(e) => setContactMethod(e.target.value)}
          disabled={!!phoneError || !!emailError}
          required
        >
          <option value="">Select an option</option>
          {!phoneError && !emailError && (
            <>
              <option value="phone">{phone}</option>
              <option value="email">{email}</option>
            </>
          )}
        </select>


        </div>

        <button className="auth-button" disabled={!!phoneError || !!emailError || !contactMethod}>
          Next
        </button>

        <div className="auth-switch">
          Already have an account? <a href="/">Sign in</a>
        </div>     
          <BackButton onClick={() => setStep(1)} />
      </form>

    </div>
  );
}
