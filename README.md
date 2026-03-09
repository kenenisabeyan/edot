# 🎓 EDOT – Education Digital Online Tutorials

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.4+-green)](https://www.mongodb.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#-contributing)
[![GitHub stars](https://img.shields.io/github/stars/kenenisabeyan/edot?style=social)](https://github.com/kenenisabeyan/edot)

EDOT (**Education Digital Online Tutorials**) is a modern full-stack educational platform inspired by large learning platforms such as Coursera.
It enables students to discover courses, enroll, and track their learning progress, while instructors can create and manage educational content.

The project is built using a **MERN-style architecture**:

* **MongoDB** – Database
* **Express.js** – Backend framework
* **Node.js** – Server runtime
* **Vanilla JavaScript + HTML/CSS** – Frontend

The platform is designed with **scalability, performance, and a clean user experience in mind.**

---

# 📸 Preview

![EDOT Homepage](https://via.placeholder.com/1200x600?text=EDOT+Homepage+Preview)

---

# ✨ Key Features

## 🔐 Authentication System

* Secure user registration and login
* Password hashing using **bcrypt**
* **JWT authentication**
* Role-based access:

  * Student
  * Instructor

## 📚 Course Management

* Browse and search courses
* Filter by category and difficulty level
* View detailed course curriculum
* Instructor profile and reviews

## 🎓 Student Experience

* Enroll in courses
* Track lesson progress
* Personal learning dashboard
* Wishlist and saved courses

## 👨‍🏫 Instructor Tools

* Create and manage courses
* Upload lessons
* Track student enrollments
* View course analytics

## 🎥 Lesson Player

* Custom video lesson player
* Downloadable resources
* Keyboard shortcuts
* Notes support (planned)

## 📱 Responsive Design

* Mobile friendly
* Tablet optimized
* Desktop optimized

## 📬 Contact System

* Form validation
* Google Maps integration
* Location: **Adama, Ethiopia**

---

# 🛠 Tech Stack

| Layer                 | Technology                                      |
| --------------------- | ----------------------------------------------- |
| **Frontend**          | HTML5, CSS3 (Flexbox & Grid), JavaScript (ES6+) |
| **Backend**           | Node.js, Express.js                             |
| **Database**          | MongoDB, Mongoose                               |
| **Authentication**    | JWT, bcrypt                                     |
| **Validation**        | express-validator                               |
| **Development Tools** | Nodemon, dotenv, cors                           |
| **Icons & Fonts**     | Font Awesome, Google Fonts                      |

---

# 📁 Project Structure

```
edot/
│
├── frontend/
│   │
│   ├── css/
│   │   ├── base.css
│   │   ├── auth.css
│   │   ├── dashboard.css
│   │   └── courses.css
│   │
│   ├── js/
│   │   ├── auth.js
│   │   ├── session.js
│   │   ├── dashboard.js
│   │   └── courses.js
│   │
│   ├── pages/
│   │   ├── login.html
│   │   ├── register.html
│   │   ├── dashboard.html
│   │   ├── courses.html
│   │   └── profile.html
│   │
│   └── index.html
│
├── backend/
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── courseController.js
│   │   └── userController.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Course.js
│   │   └── Lesson.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── courseRoutes.js
│   │   └── userRoutes.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── server.js
│   └── package.json
│
├── README.md
└── LICENSE
```

---

# 🚀 Installation & Setup

## 1️⃣ Clone Repository

```
git clone https://github.com/kenenisabeyan/edot.git
cd edot
```

---

## 2️⃣ Install Backend Dependencies

```
cd backend
npm install
```

---

## 3️⃣ Configure Environment Variables

Create `.env` inside **backend/**

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/edot
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d
```

---

## 4️⃣ Start Backend Server

```
npm run dev
```

Backend API:

```
http://localhost:5000/api
```

---

## 5️⃣ Run Frontend

Open a new terminal:

```
cd frontend
npx live-server
```

Or use **VS Code Live Server** extension.

---

# 🧪 Basic Usage

1. Register a new account
2. Browse available courses
3. Enroll in a course
4. Watch lessons and track progress
5. Instructors can create and manage courses

---

# 📚 API Overview

| Method | Endpoint                | Description      | Access     |
| ------ | ----------------------- | ---------------- | ---------- |
| POST   | /api/auth/register      | Register user    | Public     |
| POST   | /api/auth/login         | Login user       | Public     |
| GET    | /api/auth/me            | Get logged user  | Private    |
| GET    | /api/courses            | List courses     | Public     |
| GET    | /api/courses/:id        | Course details   | Public     |
| POST   | /api/courses            | Create course    | Instructor |
| POST   | /api/courses/:id/enroll | Enroll in course | Student    |
| GET    | /api/users/profile      | User profile     | Private    |
| PUT    | /api/users/profile      | Update profile   | Private    |

---

# 🤝 Contributing

Contributions are welcome.

Steps:

1. Fork the project
2. Create feature branch

```
git checkout -b feature/AmazingFeature
```

3. Commit changes

```
git commit -m "Add AmazingFeature"
```

4. Push branch

```
git push origin feature/AmazingFeature
```

5. Open Pull Request

---

# 📄 License

Distributed under the **MIT License**.

---

# 📬 Contact

**Kenenisa Beyan**

GitHub
https://github.com/kenenisabeyan

LinkedIn
https://linkedin.com/in/keno05

Email
[beyankenenisa@gmail.com](mailto:beyankenenisa@gmail.com)

Project Repository
https://github.com/kenenisabeyan/edot

---

# 🙏 Acknowledgements

* Unsplash – placeholder images
* Font Awesome – icons
* Google Fonts – typography
* Express.js community
* MongoDB community
