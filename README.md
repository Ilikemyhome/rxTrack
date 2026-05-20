## rxTrack — Pharmacy Prescription & Insurance Intelligence System
A full‑stack pharmacy application built with Django REST Framework (backend) and React (frontend).
The system provides prescription management, refill logic, insurance reject explanations, and a modern API‑driven architecture.

## Features
Backend (Django + DRF)
REST API for prescriptions

Automatic next‑fill date calculation

Insurance reject explanation endpoint

CORS‑enabled for frontend communication

Seed script for demo data

Clean, modular project structure

Frontend (React)
Fetches prescription data from Django

Displays live API results

Ready for UI expansion (chat, dashboard, etc.)

Runs on local network for multi‑device testing

## Tech Stack
Backend
Python 3

Django

Django REST Framework

PostgreSQL (or SQLite during development)

Frontend
React (Create‑React‑App)

JavaScript / JSX

Fetch API

## Project Structure

rxTrack/
│
|- backend/
│   |-- core/
│   │   |--models.py
│   │   |--serializers.py
│   │   |-- views.py
│   │   |__ urls.py
│   |-- rxTrack/
│   |__ manage.py
│
|--frontend-react/
│   |-- src/
│   |-- public/
│   |__ package.json
│
|__ frontend/   ← original HTML prototype


## Backend Setup
1. Create virtual environment

python -m venv venv
source venv/bin/activate   # Mac/Linux
venv\Scripts\activate      # Windows

2. Install dependencies

pip install -r requirements.txt
3. Run migrations

python manage.py makemigrations
python manage.py migrate

4. Seed demo data (optional)

python seed.py

5. Start backend server

python manage.py runserver 0.0.0.0:8000

## Frontend Setup
1. Navigate to React app

cd frontend-react
2. Install dependencies

npm install
3. Start development server

npm start
React runs at:

http://10.0.0.63:3000

## API Endpoints
GET /api/prescriptions/
Returns all prescriptions.

GET /api/prescriptions/<id>/explanation/
Returns insurance reject explanation for a specific prescription.

## Testing the Connection
React fetch example:

jsx
useEffect(() => {
  fetch("http://10.0.0.63:8000/api/prescriptions/")
    .then(res => res.json())
    .then(data => console.log("DJANGO SAYS:", data));
}, []);

## License
This project is proprietary.
Unauthorized copying, modification, or distribution is prohibited.

### Author
Ingrid Arenas Rosas  
Application Development — North Seattle College
Backend & Pharmacy Workflow Engineering