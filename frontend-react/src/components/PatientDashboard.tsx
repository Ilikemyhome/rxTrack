import React from 'react';
import homeIcon from '../images/home.png';
import presIcon from '../images/capsules.png';
import settingsIcon from '../images/settings.png';
import bellIcon from '../images/ringing.png';
import chat from '../images/chat-ai.png';
import DashboardSkeleton from '../DashboardSkeleton';
import { useNavigate } from 'react-router-dom';

interface OTMAlert {
  id: number;
  alert_type: string;
  is_resolved: boolean;
}

interface Prescription {
  id: number;
  drug_name: string;
  dosage: string;
  sig: string;
  status: string;
  rx_number: string;
  insurance_status: string | null;
  days_remaining: number | null;
  next_refill_date: string | null;
  theme_color: string;
  action_type: string | null;
  patient_message: string | null;
}

interface Patient {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  phone_number: string;
}


function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = React.useState('home');
  const [patient, setPatient] = React.useState<Patient | null>(null);
  const [prescriptions, setPrescriptions] = React.useState<Prescription[]>([]);
  const [alerts, setAlerts] = React.useState<OTMAlert[]>([]);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [messages, setMessages] = React.useState([
  {
    sender: "ai",
    text: "Hi, I'm Remy. I can help explain prescription statuses, insurance requirements, refill timing, and common pharmacy questions."
  }
]);

  React.useEffect(() => {

    
    const fetchDashboard = async () => {
      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");

      if (!token) {
        console.log("No token found");
        navigate("/");
        return;
      }

      try {
        const patientId =
          localStorage.getItem("patientId") ||
          sessionStorage.getItem("patientId");

        const response = await fetch(
          `http://localhost:8000/api/patients/${patientId}/dashboard/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        if (!response.ok) {
          console.error("Dashboard failed:", response.status);
          setLoading(false);
          return;
        }

        const data = await response.json();
        console.log(data);
        if (data.has_patient === false) {
          setPatient(null);
          setPrescriptions([]);
          setAlerts([]);
          setLoading(false);
          return;
        }

        setPatient(data);
        setPrescriptions(data.prescriptions || []);
        setAlerts(data.patient_alerts || []);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate]);

  const handleLogout = () =>{
      localStorage.removeItem("authToken");
      localStorage.removeItem("patientId");
      
      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("patientId");

      navigate("/");
  };
  if (loading) {
    return <DashboardSkeleton />;
  }

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage = message

    setMessages(prev => [
      ...prev,
      {
        sender: "user",
        text: userMessage
      }
    ]);

    setMessage("");
    try {

    const response = await fetch(
      "http://localhost:8000/api/chat/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: userMessage
        })
      }
    );

    const data = await response.json();

    setMessages(prev => [
      ...prev,
      {
        sender: "ai",
        text: data.message
      }
    ]);

  } catch (error) {
    console.error(error);
  }
  };

  return (
    <>
      <nav className="desktop-nav">
        <div className="nav-left">
          <h2 className="desktop-greeting">
            {getGreeting()}, {patient?.first_name}
          </h2>
        </div>

        <div className="nav-right">
          <button className={`nav-link ${activeTab === 'home'  ? 'active' : ''}`} onClick={() => setActiveTab('home')}>Home</button>
          <button className={`nav-link ${activeTab === 'prescriptions' ? 'active' : ''}`} onClick={() => setActiveTab('prescriptions')}>Prescriptions</button>
          <button className={`nav-link ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>Notifications</button>
          <button className={`nav-link ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}>Chat</button>
          <button className="nav-link" onClick={() => setShowSettings(true)}>Settings</button>
        </div>
      </nav>

      <div className="dashboard">     
       {activeTab === 'home' && (
          <>
            <div className="header">
              <h2>{getGreeting()}, {patient?.first_name}</h2>
            </div>

            <section className="section">
              <h3>Your Prescriptions</h3>

              <div className="prescription-list">
                {prescriptions.map((rx) => (
                  <PrescriptionCard
                    key={rx.id}
                    prescription={rx}
                  />
                ))}
              </div>
            </section>

            <section className="section">
              <h3>Upcoming Alerts</h3>

              {alerts.length === 0 ? (
                <p className="empty-text">
                  No active alerts.
                </p>
              ) : (
                <div className="alerts">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="alert-card"
                    >
                      {alert.alert_type}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

          {activeTab === 'prescriptions' && (
            <section className="section">
            <div className="header">
              <h2>All Prescriptions</h2>
            </div>

              <div className="prescription-list">
                {prescriptions.map((rx) => (
                  <PrescriptionCard
                    key={rx.id}
                    prescription={rx}
                  />
                ))}
              </div>
            </section>
          )}

          {activeTab === 'notifications' && (
            <section className="section">
            <div className="header">
              <h2>Alerts</h2>
            </div>

              {alerts.length === 0 ? (
                <p className="empty-text">
                  No active alerts.
                </p>
              ) : (
                <div className="alerts">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="alert-card"
                    >
                      {alert.alert_type}
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeTab === 'chat' && (
            <section className="section">
              <div className="header">

              </div>
              
              <div className="chat-container">
                <div className="chat-messages">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={
                        msg.sender === "ai"
                          ? "ai-message"
                          : "user-message"
                      }
                    >
                      {msg.text}
                    </div>
                  ))}
                  <div className="suggested-prompts">
                  <button
                    className="suggestion-chip"
                    onClick={() => setMessage("What is prior authorization?")}
                  >
                    What is prior authorization?
                  </button>

                  <button
                    className="suggestion-chip"
                    onClick={() => setMessage("Why is my prescription delayed?")}
                  >
                    Why is my prescription delayed?
                  </button>

                  <button
                    className="suggestion-chip"
                    onClick={() => setMessage("When can I refill my medication?")}
                  >
                    When can I refill my medication?
                  </button>

                  <button
                    className="suggestion-chip"
                    onClick={() => setMessage("What does pending mean?")}
                  >
                    What does pending mean?
                  </button>
                </div>
                  
                </div>
                <div className="chat-input-container">
                  <input type="text" placeholder="Ask a question..." value={message} onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}/>
                  <button className="primary-button" onClick={handleSend}>Send</button>
                  
                  
                  
                </div>
              </div>
            </section>
          )}

        
      </div>

       {/* BOTTOM NAV */}
        <nav className="bottom-nav">
          <button className={`nav-icon ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
            <img src={homeIcon} alt="Home" />
          </button>
          <button className={`nav-icon ${activeTab === 'prescriptions' ? 'active' : ''}`} onClick={() => setActiveTab('prescriptions')}>
            <img src={presIcon} alt="prescriptions" />
          </button>
          <button className={`nav-icon ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>
            <img src={bellIcon} alt="notifications" />
          </button>
          <button className={`nav-icon ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}>
            <img src={chat} alt="aichat" />
          </button>
          <button className="nav-icon" onClick={() => setShowSettings(true)}>
            <img src={settingsIcon} alt="settings" />
          </button>
        </nav>
      {showSettings && (
        <div className="settings-overlay">
          <div className="settings-modal">

            <h3>Settings</h3>

            <button
              className="secondary-button"
              onClick={handleLogout}
            >
              Logout
            </button>

            <button
              className="primary-button"
              onClick={() => setShowSettings(false)}
            >
              Close
            </button>

          </div>
        </div>
      )}

    </>
  );
};

const PrescriptionCard: React.FC<{ prescription: Prescription }> = ({ prescription }) => {
  const colorClass = `pill-pill--${prescription.theme_color || "blue"}`;
  const [showDetails, setShowDetails] = React.useState(false);
  const [aiExplanation, setAiExplanation] = React.useState("");
  const [loadingExplanation, setLoadingExplanation] = React.useState(false);
  const [ showExplanation, setShowExplanation] = React.useState(false);

  const handleExplanation = async () => {
  try {
    setLoadingExplanation(true);

    const response = await fetch(
      "http://localhost:8000/api/ai/explain/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          drug_name: prescription.drug_name,
          status: prescription.status,
          insurance_status: prescription.insurance_status,
          patient_message: prescription.patient_message,
        }),
      }
    );

    const data = await response.json();

    setAiExplanation(data.message);
    setShowExplanation(true);

  } catch (error) {
    console.error(error);
  } finally {
    setLoadingExplanation(false);
  }
};

  return (
    <div className="prescription-card">
      <div className="prescription-card-header">
        <div>
          <h3>{prescription.drug_name}</h3>
          <p className="rx-number">Rx#: {prescription.rx_number}</p>
        </div>
        <span className={`status-pill status-pill--${prescription.status.toLowerCase()}`}>
          {prescription.status}
        </span>
      </div>

      <p className="dosage">{prescription.dosage}</p>
      <p className="sig">{prescription.sig}</p>

      {prescription.insurance_status && (
        <div className="insurance-banner">
          <span className={colorClass}>{prescription.insurance_status}</span>
        </div>
      )}

      <div className="prescription-footer">
        {prescription.days_remaining !== null && (
          <p className="meta-text">
            Days Remaining: <strong>{prescription.days_remaining}</strong>
          </p>
        )}

        {prescription.next_refill_date && (
          <p className="meta-text">Next Refill: {prescription.next_refill_date}</p>
        )}

        {prescription.action_type === "CHAT_EXPLANATION" && (
          <button className="primary-button" onClick={handleExplanation}>
            {loadingExplanation ? "Thinking..." : "Why can't I refill yet?"}
          </button>
        )}

        {prescription.action_type === "PICK_UP_REMINDER" && (
          <button className="secondary-button">Send Pick Up Reminder</button>
        )}

        {prescription.action_type === "CONTACT_PHARMACY" && (
          <button className="secondary-button">Contact Pharmacy</button>
        )}
      </div>

      {prescription.patient_message && (
        <div className="rts-details">
          <button className="details-toggle" onClick={() => setShowDetails(!showDetails)}>
            {showDetails ? "Hide Message" : "Why?"}
          </button>
          {showDetails && (
            <div className="meta-text">
              <p>{prescription.patient_message}</p>
            </div>
          )}
        </div>
      )}

      {showExplanation && (
        <div className="settings-overlay">
          <div className="settings-modal">

            <h3>AI Explanation</h3>

            <p>{aiExplanation}</p>

            <button
              className="primary-button"
              onClick={() => setShowExplanation(false)}
            >
              Close
            </button>

          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
