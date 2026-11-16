# rxTrack — AI-Powered Pharmacy Prescription & Insurance Intelligence System

rxTrack is a full-stack pharmacy management and patient engagement application built with Django REST Framework and React.

The platform combines prescription tracking, insurance reject explanations, patient authentication, workflow management, and an AI-powered pharmacy assistant named Remy.

Remy can provide personalized responses using a patient's actual prescription information while remaining within pharmacy-support boundaries and avoiding medical advice.

---

## Features

### Patient Portal

- Multi-step account creation
- Secure authentication and login
- Patient profile matching using:
  - First Name
  - Last Name
  - Date of Birth
  - Phone Number
- Personalized prescription dashboard
- Active prescription tracking
- Expired prescription history
- OTM alert monitoring

### Prescription Management

- Prescription status tracking
  - Ready
  - Delayed
  - In Progress
  - Expired
- Refill tracking
- Earliest refill date support
- Prescription expiration tracking
- Controlled medication support
- Insurance reject code interpretation

### Insurance Intelligence

- Prior authorization explanations
- Refill-too-soon explanations
- Quantity limit explanations
- Formulary rejection explanations
- Patient-friendly insurance messaging

### Remy AI Assistant

Remy is an AI-powered pharmacy assistant built using Google's Gemini API.

Features include:

- Personalized prescription responses
- Refill information
- Prescription status explanations
- Insurance reject explanations
- Expired prescription guidance
- Recognition of patient-specific medication data
- Brand and generic medication recognition
- Safe pharmacy-focused responses

Remy does not provide:

- Medical advice
- Treatment recommendations
- Medication recommendations
- Diagnoses

---

## Tech Stack

### Backend

- Python 3
- Django
- Django REST Framework
- PostgreSQL
- Gemini API

### Frontend

- React
- TypeScript
- Fetch API
- React Router

### AI

- Google Gemini

---

## Project Structure

```text
rxTrack/
│
├── backend/
│   ├── core/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   │
│   ├── api/
│   │   ├── views_ai.py
│   │   └── urls.py
│   │
│   ├── requirements.txt
│   ├── seed.py
│   └── manage.py
│
└── frontend-react/
   ├── src/
   ├── public/
   └── package.json


```

---

## Prerequisites

Install the following before setup:

- Python 3
- Node.js
- PostgreSQL
- pgAdmin
- Google Gemini API Key

---

## Backend Setup

### 1. Navigate to backend

```bash
cd backend
```

### 2. Create virtual environment

```bash
python -m venv venv
```

Windows:

```bash
venv\Scripts\activate
```

Mac/Linux:

```bash
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Create Environment Variables

Create a `.env` file in the project root:

```text
rxTrack/
├── .env
├── backend/
└── frontend-react/
```

Add:

```env
GEMINI_API_KEY=your_gemini_api_key_here
DB_PASSWORD=your_postgresql_password
```

Obtain an API key through Google AI Studio.

### 5. Configure PostgreSQL

Create a PostgreSQL database.

Update Django database settings with your database credentials.

Add your password to your env file

Make sure your
`backend/rxtrack_backend/settings.py`
database configuration looks similar to:


```python
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "rxtrack",
        "USER": "postgres",
        "PASSWORD": os.getenv("DB_PASSWORD"),
        "HOST": "localhost",
        "PORT": "5432",
    }
}
```

### 6. Run migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 7. Seed demo data

```bash
python seed.py
```

### 8. Start backend server

```bash
python manage.py runserver
```

---

## Frontend Setup

### 1. Navigate to frontend

```bash
cd frontend-react
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start development server

```bash
npm start
```

---

## API Endpoints

### Authentication

```http
POST /signup/
POST /login/
```

### Patient Data

```http
GET /api/dashboard/<patient_id>/
```

### Prescriptions

```http
GET /api/prescriptions/
GET /api/prescriptions/<id>/
```

### Insurance Reject Explanations

```http
GET /api/prescriptions/<rx_number>/explanation/
```

### AI Assistant

```http
POST /api/chat/
```

---

## Demo Patient Scenarios

The seed script includes:

- Ready prescriptions
- Refill-too-soon rejects
- Prior authorization scenarios
- Quantity limit rejects
- Missing diagnosis code rejects
- In-progress prescriptions
- Expired prescriptions
- OTM alerts

---

## License

This project is proprietary.

Unauthorized copying, modification, or distribution is prohibited.

---

## Author

**Ingrid Arenas Rosas**

North Seattle College

Application Development Capstone

Pharmacy Workflow Engineering & AI Integration