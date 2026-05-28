import React from 'react';


interface OTMAlert {
    id: number;
    alert_type: string;
    is_resolved: boolean;

}

interface Prescription {
    id: number;
    drug_name: string;
    dosage: string;
    sig : string;
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

interface Props {
    patient: Patient;
    prescriptions: Prescription[];
    alerts: OTMAlert[];
}

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}


const PatientDashboard: React.FC<Props> = ({ patient, prescriptions, alerts }) => {
  return (
    <div className="dashboard">

      {/* Greeting */}
      
      <header className="header">
        <h2>{getGreeting()}, {patient.first_name}</h2>
      </header>

      {/* PRESCRIPTIONS SECTION */}
      <section className="section">
        <h3>Your Prescriptions</h3>

        <div className="prescription-list">
          {prescriptions.map((rx) => (
            <PrescriptionCard key={rx.id} prescription={rx} />

          ))}
        </div>
      </section>

      {/* ALERTS SECTION */}
      <section className="section">
        <section className="dashboard-section alerts-section">
          <h3>Upcoming Alerts</h3>
        </section>

        {alerts.length === 0 ? (
          <p className="empty-text">No active alerts.</p>
        ) : (
          <div className="alerts">
            {alerts.map((alert) => (
              <div key={alert.id} className="alert-card">
                {alert.alert_type}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* BOTTOM NAV */}
      <nav className="bottom-nav">
        <button>home</button>
        <button>prescriptions</button>
        <button>notifications</button>
        <button>chat</button>
      </nav>

    </div>
  );
};


const PrescriptionCard: React.FC<{ prescription: Prescription }> = ({ prescription }) => {
        const colorClass = `pill-pill--${prescription.theme_color || "blue"}`;
        const [showDetails, setShowDetails] = React.useState(false);
        return (

            <div className="prescription-card">
                <div className="prescription-card-header">
                    <div>
                        <h3>{prescription.drug_name}</h3>
                        <p className="rx-number">Rx#: {prescription.rx_number}</p>
                    </div>
                    <span className={'status-pill status-pill--${prescription.status.toLowerCase()} '}>
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
                        <p className="meta-text">
                            Next Refill: {prescription.next_refill_date}
                        </p>
                    )}

                    {prescription.action_type === "CHAT_EXPLANATION" && (
                        <button className="primary-button">Why can't I refill yet?</button>
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
            </div>  
        );
};

export default PatientDashboard;