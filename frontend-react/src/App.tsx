import "./styles/dashboard.css";

import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  React.useEffect(() => {

    const token = 
      localStorage.getItem("authToken") ||
      sessionStorage.getItem("authToken");

    const patientId = 

      localStorage.getItem("patientId") ||
      sessionStorage.getItem("patientId");


    if (!token) {
      console.log("No token found");
      navigate("/");
      return;
    }
      if (!patientId) {
      console.log("No patient profile found");
      return;
    }
    fetch(`http://localhost:8000/api/patients/${patientId}/dashboard/`, {
      headers: {
        Authorization: `Token ${token}`,
      }
    })
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((error) => console.error("Error fetching dashboard data:", error));
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <PatientDashboard />
  );
}
