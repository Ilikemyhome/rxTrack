import "./styles/dashboard.css";

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import PatientDashboard from "./components/PatientDashboard";
import Login from "./components/Login";
import Signup from "./components/Signup";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<PatientDashboardWrapper />} />
      </Routes>
    </Router>
  );
}

export default App;


function PatientDashboardWrapper() {
  const [data, setData] = React.useState<any>(null);

  React.useEffect(() => {
    fetch("http://10.0.0.63:8000/api/patients/5/dashboard/")
      .then((res) => res.json())
      .then((json) => setData(json));
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <PatientDashboard/>
  );
}
