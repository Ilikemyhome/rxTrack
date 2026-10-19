import React, { useState } from "react";
import Step1 from "../components/signup/Step1";
import Step2 from "../components/signup/Step2";
import Step3 from "../components/signup/Step3";

import { useNavigate } from "react-router-dom";

import "../styles/auth.css";

export default function Signup() {

  const navigate = useNavigate();
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [dobMonth, setDobMonth] = useState("");
  const [dobDay, setDobDay] = useState("");
  const [dobYear, setDobYear] = useState("");

  const [dobMonthTouched, setDobMonthTouched] = useState(false);
  const [dobDayTouched, setDobDayTouched] = useState(false);
  const [dobYearTouched, setDobYearTouched] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [emailError, setEmailError] = useState("");

  const [contactMethod, setContactMethod] = useState("phone");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [dobError, setDobError] = useState("");

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const [step, setStep] = useState(1);

  const autoJump = (value: string, max: number, nextId: string) => {
    if (value.length === max) document.getElementById(nextId)?.focus();
  };

  const handleSignup = async () => {
    const dob = `${dobYear}-${dobMonth}-${dobDay}`;

    const payload = {
      first_name: firstName,
      last_name: lastName,
      dob,
      phone,
      email,
      password,
      confirm_password: confirmPassword,
    };

    const res = await fetch("http://localhost:8000/signup/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, password }),
    });


    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("authToken", data.token);

      if (data.has_patient) {
        navigate(`/dashboard/${data.patient.id}`);
      } else {
        alert("Signup successful! Please complete your profile.");
      }
    } else {
      setError(data.error || "Signup failed");
    }
  };

  return (
    <div className="auth-container">
      {step === 1 && (
        <Step1
          firstName={firstName}
          lastName={lastName}
          dobMonth={dobMonth}
          dobDay={dobDay}
          dobYear={dobYear}
          setFirstName={setFirstName}
          setLastName={setLastName}
          setDobMonth={setDobMonth}
          setDobDay={setDobDay}
          setDobYear={setDobYear}
          setStep={setStep}
          autoJump={autoJump}
          dobError={dobError}
          setDobError={setDobError}
          dobMonthTouched={dobMonthTouched}
          setDobMonthTouched={setDobMonthTouched}
          dobDayTouched={dobDayTouched}
          setDobDayTouched={setDobDayTouched}
          dobYearTouched={dobYearTouched}
          setDobYearTouched={setDobYearTouched}
        />
      )}

      {step === 2 && (
        <Step2
          phone={phone}
          email={email}
          setPhone={setPhone}
          setEmail={setEmail}
          setStep={setStep}
          phoneTouched={phoneTouched}
          setPhoneTouched={setPhoneTouched}
          phoneError={phoneError}
          setPhoneError={setPhoneError}
          emailTouched={emailTouched}
          setEmailTouched={setEmailTouched}
          emailError={emailError}
          setEmailError={setEmailError}
          contactMethod={contactMethod}
          setContactMethod={setContactMethod}
        />
      )}

      {step === 3 && (
        <Step3
          password={password}
          confirmPassword={confirmPassword}
          setPassword={setPassword}
          setConfirmPassword={setConfirmPassword}
          error={error}
          setError={setError}
          firstName={firstName}
          lastName={lastName}
          dobMonth={dobMonth}
          dobDay={dobDay}
          dobYear={dobYear}
          phone={phone}
          email={email}
          setStep={setStep}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          showConfirmPassword={showConfirmPassword}
          setShowConfirmPassword={setShowConfirmPassword}
          handleSignup={handleSignup}
        />
      )}
    </div>
  );
}
