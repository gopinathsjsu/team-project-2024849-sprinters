[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/Fu_pncF5)

# 🍽️ ReserveTable — Restaurant Reservation Platform

ReserveTable is a full-stack web application for discovering, reserving, reviewing, and managing restaurants. It supports user reservations and admin approvals, with a clean dashboard to monitor analytics.

---

## 🌟 Features

### 👥 Users
- Sign up / Log in
- Browse and search restaurants
- Make, view, modify, and cancel reservations
- Submit and read reviews

### 🛠️ Admins
- Admin login interface
- `/admin/dashboard` with analytics:
  - Total reservations (last 30 days)
  - Average party size
  - Top booked restaurants
  - Daily breakdown
- `/admin/restaurants` management:
  - View details of each restaurant in a modal
  - Approve / delete new submissions

### 📊 Analytics
- Reservation trends (30-day history)
- Top-performing restaurants
- Average reservation metrics

---

## 🏗️ Architecture

### Frontend
- React (with Redux & React Router)
- CSS modules for styling

### Backend
- Flask (Python)
- SQLAlchemy ORM
- Flask-Login
- PostgreSQL as the database

---

## 📦 Folder Structure
backend/ # Flask app
└── models/
└── api/
└── seeds/
└── init.py
---
front-end/ # React app
└── src/
└── components/
└── store/
└── App.js
---

## 🗂️ Design Decisions

- **MVC Pattern**: Flask acts as controller, SQLAlchemy as model, React as view
- **Factory Pattern**: `create_app()` is used for environment flexibility
- **Decorator Pattern**: Used extensively via Flask route decorators
- **Observer & State Patterns**: Used via Redux and React hooks
- **Command Pattern**: Used for CLI seeding (`flask seed all`)

---

## 📐 Diagrams

### 🧱 Deployment Diagram
- **Deployment Diagram**: [View Here](./architecture/DeploymentDiagram.png)

### 🧩 Component Diagram
- **Component Diagram**: [View Here](./architecture/ComponentDiagram.png)  

### 🔧 Backend
```bash
cd backend
pip install -r requirements.txt
flask db upgrade
flask seed all
flask run
```
### 💻 Frontend

``` bash
cd front-end
npm install
npm start
```

### 👥 Team
- [Ananya Praveen Shetty](https://github.com/ananya101001)
- [Apoorva Shastry](https://github.com/ApoorvaShastry10)
- [Junie Mariam Varghese](https://github.com/juniemariam)
- [Rinku Tekchandani](https://github.com/rinkutek)


