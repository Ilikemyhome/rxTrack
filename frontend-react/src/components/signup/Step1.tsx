import React from "react";
import DOBInput from "./DOBInput";

type Step1Props = {
  firstName: string;
  lastName: string;
  dobMonth: string;
  dobDay: string;
  dobYear: string;
  setFirstName: (v: string) => void;
  setLastName: (v: string) => void;
  setDobMonth: (v: string) => void;
  setDobDay: (v: string) => void;
  setDobYear: (v: string) => void;
  setStep: (v: number) => void;
  autoJump: (value: string, max: number, nextInputId: string) => void;
  dobError: string;
  setDobError: (v: string) => void;
  dobMonthTouched: boolean;
  setDobMonthTouched: (v: boolean) => void;
  dobDayTouched: boolean;
  setDobDayTouched: (v: boolean) => void;
  dobYearTouched: boolean;
  setDobYearTouched: (v: boolean) => void;
};

export default function Step1(props: Step1Props) {
  const {
    firstName,
    lastName,
    setFirstName,
    setLastName,
    setStep
  } = props;

  return (
    <div className="auth-content">
      <h1 className="auth-title">Tell us about you</h1>
      <p className="auth-subtitle">We'll personalize your experience.</p>

      <form
        className="auth-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (!props.dobError) setStep(2);
        }}
      >
        <div className="input-group">
            <label className="input-label">First name</label>
          <input
            type="text"
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label className="input-label">Last name</label>
          <input
            type="text"
            placeholder="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

        <DOBInput {...props} />

        <button className="auth-button" disabled={!!props.dobError}>
          Next
        </button>
        <div className="auth-switch">
            Already have an account? <a href="/">Sign in</a>
        </div>

      </form>
    </div>
  );
}
