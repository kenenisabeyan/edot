# 🎓 EDOT - Educational Technology Platform

![Status](https://img.shields.io/badge/status-active-success.svg)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=flat&logo=Prisma&logoColor=white)

A comprehensive, full-stack learning management system built to connect administrators, instructors, students, and parents through interactive, role-based dashboards.

---

## 📑 Table of Contents
- [Overview](#-overview)
- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [⚙️ Prerequisites](#️-prerequisites)
- [🚀 Installation & Setup](#-installation--setup)
- [🔐 Environment Variables](#-environment-variables)
- [💻 Running Locally](#-running-locally)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 📖 Overview
EDOT is a modern EdTech ecosystem that streamlines the educational process. It features real-time analytics, course construction suites, manual and automatic student enrollments, and an advanced AI-driven insight dashboard allowing parents to monitor their child's academic behavioral trends.

---

## ✨ Key Features

### 👨‍💼 Administrator
- **Overlord Dashboard:** High-level metrics on active users, revenue drops, and platform health.
- **Role & Access Control:** Manually approve/reject instructor course submissions and override user permissions.
- **Intervention Modules:** Direct visibility into live parent-instructor support chats and pending flagged system warnings.

### 👩‍🏫 Instructor
- **Curriculum Builder:** Create deeply nested video modules and lesson plans with rich text/media.
- **Student Analytics:** Granular engagement data showing how students are interacting with published materials.
- **Direct Link:** Interact with approved/assigned students and publish notices directly to class feeds.

### 🎒 Student
- **Interactive Theater:** Seamlessly consume video components from instructor-approved courses.
- **Quiz Modules & Progression:** Gamified tracking of course completion status.
- **Customized UI:** Immersive, distraction-free environment adapted for heavy reading and video playback.

### 👪 Parent 
- **Learner Linking:** Map multiple learner accounts via secure email verification.
- **Behavioral & Academic Intel:** Real-time metrics extracting psychological indicators and attendance snapshots directly from the student's progress matrix.

---

## 🛠️ Tech Stack

**Frontend:**
- **Framework:** React.js (Vite)
- **Styling:** Vanilla CSS, TailwindCSS
- **Icons & Graphics:** Lucide-React, Recharts (Data Visualization)
- **Routing:** React Router v6

**Backend:**
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Security:** JWT Authentication, Bcrypt password hashing

---

## 📁 Project Structure

This project uses a monorepo-style structure separating the GUI from the API.

```text
EDOT/
├── backend/                  # Node.js API server
│   ├── prisma/               # Database schema & migrations
│   ├── routes/               # Express endpoints (admin, users, courses)
│   ├── middlewares/          # JWT Auth, Role verification
│   ├── uploads/              # Local storage for avatars/thumbnails
│   └── server.js             # API entrypoint
│
└── frontend/                 # React UI application
    ├── src/
    │   ├── assets/           # Static images
    │   ├── components/       # Reusable layout fragments
    │   ├── context/          # Global AuthContext API
    │   ├── pages/            # Role-specific dashboard views
    │   └── utils/            # Axios API interceptors
    ├── index.html            # Vite entrypoint
    └── package.json
