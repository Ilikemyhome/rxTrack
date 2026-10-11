import React from "react";

type DOBInputProps = {
  dobMonth: string;
  dobDay: string;
  dobYear: string;
  setDobMonth: (v: string) => void;
  setDobDay: (v: string) => void;
  setDobYear: (v: string) => void;
  dobError: string;
  setDobError: (v: string) => void;
  autoJump: (value: string, max: number, nextInputId: string) => void;
  dobMonthTouched: boolean;
  setDobMonthTouched: (v: boolean) => void;
  dobDayTouched: boolean;
  setDobDayTouched: (v: boolean) => void;
  dobYearTouched: boolean;
  setDobYearTouched: (v: boolean) => void;
};

export default function DOBInput({
  dobMonth,
  dobDay,
  dobYear,
  setDobMonth,
  setDobDay,
  setDobYear,
  dobError,
  setDobError,
  autoJump,
  dobMonthTouched,
  setDobMonthTouched,
  dobDayTouched,
  setDobDayTouched,
  dobYearTouched,
  setDobYearTouched
}: DOBInputProps) {

  // --- formatting helpers ---
  const formatMM = (value: string) => {
    let v = value.replace(/\D/g, "");
    if (v.length === 1 && parseInt(v) > 1) v = "0" + v;
    if (v.length > 2) v = v.slice(0, 2);
    if (parseInt(v) > 12) v = "12";
    return v;
  };

  const formatDD = (value: string) => {
    let v = value.replace(/\D/g, "");
    if (v.length === 1 && parseInt(v) > 3) v = "0" + v;
    if (v.length > 2) v = v.slice(0, 2);
    if (parseInt(v) > 31) v = "31";
    return v;
  };

  const formatYYYY = (value: string) => {
    let v = value.replace(/\D/g, "");
    if (v.length > 4) v = v.slice(0, 4);
    const currentYear = new Date().getFullYear();
    if (v.length === 4 && parseInt(v) > currentYear) v = currentYear.toString();
    return v;
  };

  // --- validation ---
  const validateDOB = () => {
    const mm = parseInt(dobMonth);
    const dd = parseInt(dobDay);
    const yyyy = parseInt(dobYear);

    if (dobMonth.length !== 2 || dobDay.length !== 2 || dobYear.length !== 4) {
      setDobError("Enter full date");
      return false;
    }

    if (yyyy < 1900) {
      setDobError("Year must be after 1900");
      return false;
    }

    const today = new Date();
    const inputDate = new Date(`${yyyy}-${dobMonth}-${dobDay}`);

    if (inputDate > today) {
      setDobError("Date cannot be in the future");
      return false;
    }

    const daysInMonth = new Date(yyyy, mm, 0).getDate();
    if (dd < 1 || dd > daysInMonth) {
      setDobError("Invalid day for this month");
      return false;
    }

    setDobError("");
    return true;
  };

  React.useEffect(() => {
    validateDOB();
  }, [dobMonth, dobDay, dobYear]);

  return (
    <>
      <label className="input-label">Date of Birth</label>

      <div className="dob-group">
        <input
          id="dob-month"
          className={dobError && dobMonthTouched ? "error" : ""}
          type="tel"
          inputMode="numeric"
          placeholder="MM"
          maxLength={2}
          value={dobMonth}
          onChange={(e) => {
            const v = formatMM(e.target.value);
            setDobMonth(v);
            if (v.length === 2) autoJump(v, 2, "dob-day");
          }}
          onBlur={() => setDobMonthTouched(true)}
        />

        <input
          id="dob-day"
          className={dobError && dobDayTouched ? "error" : ""}
          type="tel"
          inputMode="numeric"
          placeholder="DD"
          maxLength={2}
          value={dobDay}
          onChange={(e) => {
            const v = formatDD(e.target.value);
            setDobDay(v);
            if (v.length === 2) autoJump(v, 2, "dob-year");
          }}
          onBlur={() => setDobDayTouched(true)}
        />

        <input
          id="dob-year"
          className={dobError && dobYearTouched ? "error" : ""}
          type="tel"
          inputMode="numeric"
          placeholder="YYYY"
          maxLength={4}
          value={dobYear}
          onChange={(e) => {
            const v = formatYYYY(e.target.value);
            setDobYear(v);
          }}
          onBlur={() => setDobYearTouched(true)}
        />
      </div>

      {dobError &&
        (dobMonthTouched || dobDayTouched || dobYearTouched) && (
          <p className="error-text">{dobError}</p>
        )}
    </>
  );
}
