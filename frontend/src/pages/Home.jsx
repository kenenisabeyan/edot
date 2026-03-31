import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { motion } from 'framer-motion';
import {
  GraduationCap, Code, Calculator, FlaskConical, BookOpen,
  Play, ArrowRight
} from 'lucide-react';

export default function Home() {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await api.get('/courses?limit=3');
        setFeaturedCourses(data.courses);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="bg-gradient-to-br from-slate-50 to-slate-200 py-16 sm:py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">

          <div className="flex flex-col-reverse lg:flex-row items-center gap-10">

            {/* TEXT */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="w-full lg:w-1/2 text-center lg:text-left"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                Build Your Future with <span className="text-blue-600">EDOT</span>
              </h1>

              <p className="text-slate-600 text-base sm:text-lg mb-8">
                Discover real-world learning built for students in Ethiopia and beyond.
                Build practical skills in programming, science, and mathematics all in one platform.
              </p>

              {/* BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
                
                <Link
                  to="/courses"
                  className="group flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <GraduationCap className="w-5 h-5 group-hover:scale-110 transition" />
                  Explore Courses
                </Link>

                <button
                  className="group flex items-center justify-center gap-2 px-6 py-3 border rounded-lg bg-white hover:bg-slate-100 transition-all duration-300 hover:-translate-y-1"
                >
                  <Play className="w-5 h-5 text-blue-600 group-hover:scale-110" />
                  How it Works
                </button>
              </div>

              {/* STATS */}
              <div className="flex justify-center lg:justify-start gap-8">
                {["Courses", "Learners", "Instructors"].map((label, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.1 }}
                    className="text-center"
                  >
                    <p className="text-2xl sm:text-3xl font-bold text-blue-600">
                      {i === 1 ? "500+" : "10+"}
                    </p>
                    <p className="text-sm text-slate-500">{label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* IMAGE */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="w-full lg:w-1/2"
            >
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
                alt="Students learning"
                className="w-full h-[220px] sm:h-[300px] lg:h-[400px] object-cover rounded-2xl shadow-xl hover:scale-105 transition duration-500"
              />
            </motion.div>

          </div>
        </div>
      </section>

      {/* ================= CATEGORIES ================= */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">

          <h2 className="text-2xl sm:text-3xl font-bold mb-10">
            Learn by Category
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {[
              { name: 'Programming', icon: Code },
              { name: 'Mathematics', icon: Calculator },
              { name: 'Science', icon: FlaskConical },
              { name: 'Exam Prep', icon: BookOpen }
            ].map((cat, i) => {
              const Icon = cat.icon;
              return (
                <motion.div
                  key={i}
                  whileHover={{ y: -8, scale: 1.05 }}
                >
                  <Link
                    to={`/courses?category=${cat.name.toLowerCase()}`}
                    className="group p-6 border rounded-xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 block"
                  >
                    <Icon className="w-8 h-8 mx-auto text-blue-600 mb-3 group-hover:rotate-12 transition" />
                    <p className="font-semibold">{cat.name}</p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= COURSES ================= */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">

          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">
            Featured Courses
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <p className="text-center col-span-full">Loading...</p>
            ) : (
              featuredCourses.map(course => (
                <motion.div
                  key={course._id}
                  whileHover={{ y: -10 }}
                  className="bg-white rounded-xl shadow hover:shadow-2xl transition"
                >
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="h-40 w-full object-cover rounded-t-xl"
                  />

                  <div className="p-4">
                    <h3 className="font-bold mb-2">{course.title}</h3>
                    <p className="text-sm text-slate-500 mb-4">
                      {course.description}
                    </p>

                    <Link className="text-blue-600 font-semibold flex items-center gap-1 group">
                      Start Learning
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                    </Link>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-16 bg-grayy-600 text-center text-white">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-3xl sm:text-4xl font-bold mb-6"
        >
          Start Learning Today
        </motion.h2>

        <Link
          to="/register"
          className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
        >
          Join Now
        </Link>
      </section>
    </>
  );
}