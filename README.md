# CoWager — Cooperative Gig Services Platform

> A cooperative-owned digital service marketplace connecting verified skilled workers with households — ensuring fair wages, worker welfare, and consumer trust.

**Built for:** Ministry of Cooperation | National Council for Cooperative Training (NCCT)

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm

---

## ⚙️ Setup

### 1. Backend (Server)
```bash
cd server
npm install
```

Edit `.env` and set your `MONGO_URI`.

```bash
# Seed demo data (admin, worker, customer + services)
node seed.js

# Start the server
npm run dev
```
Server runs at: **http://localhost:5000**

---

### 2. Frontend (Client)
```bash
cd client
npm install
npm start
```
Client runs at: **http://localhost:3000**

---

## 🔑 Demo Credentials

| Role     | Email                    | Password    |
|----------|--------------------------|-------------|
| Admin    | admin@cowager.com        | admin123    |
| Worker   | worker@cowager.com       | worker123   |
| Customer | customer@cowager.com     | customer123 |

---

## 🏗️ Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React.js, Tailwind CSS, Recharts  |
| Backend    | Node.js, Express.js               |
| Database   | MongoDB, Mongoose                 |
| Auth       | JWT (role-based)                  |
| Maps       | Leaflet.js                        |
| Payments   | Razorpay (mock for dev)           |

---

## 👥 User Roles

- **Customer** — Browse services, book workers, pay, review
- **Worker** — Accept jobs, track earnings, manage availability  
- **Admin** — Verify workers, manage platform, view analytics

---

## 📁 Project Structure

```
CoWager/
├── server/
│   ├── models/          # User, Worker, Service, Booking, Review, Cooperative
│   ├── routes/          # auth, workers, services, bookings, reviews, admin, payments
│   ├── middleware/       # JWT auth + RBAC
│   ├── seed.js          # Demo data seeder
│   └── index.js         # Express server entry
└── client/
    ├── src/
    │   ├── pages/       # Home, Login, Register, Services, Workers, Bookings, Dashboards
    │   ├── components/  # Navbar, Footer, Cards, Badges, Spinner
    │   ├── context/     # AuthContext
    │   └── api/         # Axios instance
    └── public/
```

---

## 🎯 Problem Statement

**ID:** 26089 | Ministry of Cooperation — NCCT  
**Theme:** Agriculture, FoodTech & Rural Development
