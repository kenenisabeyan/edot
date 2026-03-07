# 🎓 EDOT - Education Digital Online Tutorials

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.4+-green)](https://www.mongodb.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![GitHub stars](https://img.shields.io/github/stars/yourusername/edot-platform?style=social)](https://github.com/yourusername/edot-platform)

**EDOT** is a modern, full‑stack educational platform inspired by Coursera. It empowers students to discover, enroll in, and learn from high‑quality courses, while instructors have dedicated tools to create and manage their content. Built with the MERN stack (MongoDB, Express.js, React – but here we use vanilla JavaScript for simplicity), it’s designed for scalability, performance, and an excellent user experience.

![EDOT Homepage Screenshot](https://via.placeholder.com/1200x600?text=EDOT+Homepage+Screenshot+Placeholder)

---

## ✨ Features

- **User Authentication** – Secure sign‑up / login with JWT, password hashing (bcrypt), and role‑based access (student / instructor).
- **Course Catalog** – Browse all courses with advanced filtering (by category, level) and search.
- **Course Details** – View detailed information, curriculum, instructor bio, and student reviews.
- **Enrollment & Progress Tracking** – Enroll in courses, mark lessons as complete, and track your learning progress.
- **Interactive Lesson Player** – Watch video lessons, take notes, and download resources – all within a custom‑built player with keyboard shortcuts.
- **Student Dashboard** – Overview of enrolled courses, progress statistics, wishlist, and profile settings.
- **Instructor Dashboard** – Create and manage courses, view analytics, and interact with students.
- **Responsive Design** – Fully optimized for mobile, tablet, and desktop devices.
- **Modern UI** – Clean, minimalist design with smooth animations and a professional color palette.
- **Contact Page** – Functional contact form with validation and Google Maps integration (Adama, Ethiopia).

---

## 🛠️ Tech Stack

| Frontend          | Backend           | Database         | Authentication | Other Tools          |
| ----------------- | ----------------- | ---------------- | -------------- | -------------------- |
| HTML5             | Node.js           | MongoDB          | JWT            | Mongoose (ODM)       |
| CSS3 (Flex/Grid)  | Express.js        |                  | bcrypt.js      | express‑validator    |
| JavaScript (ES6+) | REST API          |                  |                | cors, dotenv         |
| Font Awesome Icons|                   |                  |                | nodemon (dev)        |

---

## 🚀 Live Demo

🔗 [Coming Soon] – Deploy the app and add your live link here.

---

## 📸 Screenshots

| Homepage | Courses Page | Course Detail |
|----------|--------------|---------------|
| ![Home](https://via.placeholder.com/400x250?text=Home) | ![Courses](https://via.placeholder.com/400x250?text=Courses) | ![Detail](https://via.placeholder.com/400x250?text=Course+Detail) |

| Lesson Player | Student Dashboard | Instructor Dashboard |
|---------------|-------------------|----------------------|
| ![Lesson](https://via.placeholder.com/400x250?text=Lesson+Player) | ![Dashboard](https://via.placeholder.com/400x250?text=Dashboard) | ![Instructor](https://via.placeholder.com/400x250?text=Instructor) |

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/edot-platform.git
cd edot-platform
