# 🎓 EDOT - Education Digital Online Tutorials

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.4+-green)](https://www.mongodb.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![GitHub stars](https://img.shields.io/github/stars/yourusername/edot-platform?style=social)](https://github.com/yourusername/edot-platform)

**EDOT** is a modern, full‑stack educational platform inspired by Coursera. It empowers students to discover, enroll in, and learn from high‑quality courses, while instructors have dedicated tools to create and manage their content. Built with the MERN stack (MongoDB, Express.js, vanilla JavaScript for the frontend), it’s designed for scalability, performance, and an excellent user experience.

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
2. Install Backend Dependencies
bash
cd backend
npm install
3. Configure Environment Variables
Create a .env file inside the backend folder:

env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/edot
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
If you use MongoDB Atlas, replace the URI with your connection string.

4. Start MongoDB
Local: Ensure MongoDB is running (mongod).

Atlas: Already running – just use the URI above.

5. Run the Backend Server
bash
npm run dev
The API will be available at http://localhost:5000/api.

6. Serve the Frontend
Open a new terminal and navigate to the frontend folder:

bash
cd ../frontend
# Use any static server, e.g. live-server
npx live-server
Or open index.html via VS Code Live Server.

The application will open in your browser (usually at http://127.0.0.1:5500).

🧪 Usage
Register a new account (choose “Student” or “Instructor”).

Browse courses on the “Courses” page, filter by category/level.

Enroll in a course (requires login).

Watch lessons and track your progress on the “Dashboard”.

Instructors can create courses from the instructor dashboard.

Contact us via the contact form (simulated, but ready for real email integration).

📚 API Documentation
The backend exposes a RESTful API. Below are the main endpoints:

Method	Endpoint	Description	Access
POST	/api/auth/register	Register a new user	Public
POST	/api/auth/login	Login and get JWT token	Public
GET	/api/auth/me	Get current user profile	Private
GET	/api/courses	List all courses (with filters)	Public
GET	/api/courses/:id	Get single course details	Public
POST	/api/courses	Create a new course	Instructor
POST	/api/courses/:id/enroll	Enroll in a course	Student
POST	/api/courses/:courseId/lessons/:lessonId/complete	Mark lesson complete	Student
GET	/api/users/profile	Get user profile with enrolled courses	Private
PUT	/api/users/profile	Update user profile	Private
GET	/api/users/mycourses	Get user's enrolled courses	Private
Full documentation available in the Postman collection.

🤝 Contributing
Contributions, issues, and feature requests are welcome!
Feel free to check the issues page.

Fork the project.

Create your feature branch (git checkout -b feature/AmazingFeature).

Commit your changes (git commit -m 'Add some AmazingFeature').

Push to the branch (git push origin feature/AmazingFeature).

Open a Pull Request.

📄 License
Distributed under the MIT License. See LICENSE for more information.

📬 Contact
Your Name – @your_twitter – your.email@example.com

Project Link: https://github.com/yourusername/edot-platform

🙏 Acknowledgements
Unsplash for placeholder images

Font Awesome for icons

Google Fonts for typography

Express.js and MongoDB communities

text

Just copy the entire content above into your `README.md` file and push it to GitHub. Replace placeholders (like your username, email, and screenshot URLs) with your actual information.
