import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { motion } from 'framer-motion';
import {
  GraduationCap, Code, Calculator, FlaskConical, BookOpen,
  Play, ArrowRight, ShieldCheck, Sparkles, LayoutGrid
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
    <div className="bg-[#0B0E14] min-h-screen text-white overflow-hidden font-sans pt-8">
      {/* Background Accent Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#FFD700]/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-[#008A32]/5 rounded-full blur-[150px]"></div>
      </div>

      {/* ================= HERO ================= */}
      <section className="relative z-10 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20">

            {/* TEXT */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="w-full lg:w-1/2 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-[#FFD700]" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#FFD700]">The Next Generation of Learning</span>
              </div>

              <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-black text-white mb-6 leading-[1.1] drop-shadow-2xl">
                Build Your Future with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#EAB308]">EDOT</span>
              </h1>

              <p className="text-slate-400 text-lg sm:text-xl mb-10 leading-relaxed font-medium">
                Discover real-world learning built for students in Ethiopia and beyond.
                Build practical skills in programming, science, and mathematics all in an elite, data-driven platform.
              </p>

              {/* BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start mb-12">
                <Link
                  to="/courses"
                  className="group flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#FFD700] to-[#EAB308] text-[#0f172a] rounded-xl font-black uppercase tracking-widest shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:shadow-[0_0_30px_rgba(255,215,0,0.5)] transition-all duration-300 hover:-translate-y-1"
                >
                  <GraduationCap className="w-5 h-5 group-hover:scale-110 transition" />
                  Explore Catalog
                </Link>

                <button
                  className="group flex items-center justify-center gap-2 px-8 py-4 bg-white/5 border border-white/10 rounded-xl text-white font-bold uppercase tracking-widest backdrop-blur-md hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:border-[#FFD700]/30"
                >
                  <Play className="w-5 h-5 text-[#FFD700] group-hover:scale-110" />
                  How it Works
                </button>
              </div>

              {/* STATS */}
              <div className="flex justify-center lg:justify-start gap-12 bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md inline-flex shadow-inner">
                {["Courses", "Learners", "Instructors"].map((label, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    className="text-center"
                  >
                    <p className="text-2xl sm:text-3xl font-black text-[#FFD700] mb-1">
                      {i === 1 ? "500+" : "10+"}
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* IMAGE */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full lg:w-1/2 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-[#008A32]/20 to-[#FFD700]/20 rounded-[2.5rem] transform rotate-3 blur-sm"></div>
              <div className="relative rounded-[2rem] border border-white/10 bg-[#0B0E14] shadow-2xl overflow-hidden group">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
                  alt="Students learning"
                  className="w-full h-[300px] lg:h-[500px] object-cover transform group-hover:scale-105 transition duration-700 opacity-90"
                />
                
                {/* Floating Badge */}
                <div className="absolute bottom-6 right-6 z-20 bg-[#0B0E14]/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl flex items-center gap-4 group-hover:-translate-y-2 transition-transform duration-500">
                  <div className="w-12 h-12 bg-[#008A32]/20 border border-[#008A32]/30 rounded-xl flex items-center justify-center text-[#008A32]">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-white font-bold">Verified Excellence</p>
                    <p className="text-xs text-slate-400">Top-tier instructors</p>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ================= CATEGORIES ================= */}
      <section className="relative z-10 py-24 bg-[#11151F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-black mb-4">
              Explore Domains
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Master new skills with our heavily curated, category-specific learning libraries.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Architecture', icon: LayoutGrid, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
              { name: 'Mathematics', icon: Calculator, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
              { name: 'Science', icon: FlaskConical, color: 'text-[#008A32]', bg: 'bg-[#008A32]/10', border: 'border-[#008A32]/20' },
              { name: 'Exam Prep', icon: BookOpen, color: 'text-[#FFD700]', bg: 'bg-[#FFD700]/10', border: 'border-[#FFD700]/20' }
            ].map((cat, i) => {
              const Icon = cat.icon;
              return (
                <motion.div
                  key={i}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    to={`/courses?category=${cat.name.toLowerCase()}`}
                    className="group border border-white/5 bg-[#0B0E14] rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-lg hover:shadow-2xl hover:border-white/10 transition-all duration-300 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-white-[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className={`w-16 h-16 rounded-2xl ${cat.bg} ${cat.border} border mb-5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                      <Icon className={`w-8 h-8 ${cat.color}`} />
                    </div>
                    <p className="font-bold text-lg text-white group-hover:text-[#FFD700] transition-colors">{cat.name}</p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= COURSES ================= */}
      <section className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col sm:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-display font-black mb-3 text-white">
                Featured Edges
              </h2>
              <p className="text-slate-400">The most popular and highly-rated programs right now.</p>
            </div>
            <Link to="/courses" className="mt-4 sm:mt-0 flex items-center gap-2 text-[#FFD700] font-bold uppercase tracking-widest text-sm hover:text-white transition-colors group">
              View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full flex justify-center py-12">
                <div className="w-12 h-12 border-4 border-white/10 border-t-[#FFD700] rounded-full animate-spin"></div>
              </div>
            ) : (
              featuredCourses.map(course => (
                <motion.div
                  key={course._id}
                  whileHover={{ y: -10 }}
                  className="bg-[#11151F] border border-white/10 rounded-3xl overflow-hidden shadow-xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-300 group flex flex-col"
                >
                  <div className="h-56 relative overflow-hidden bg-black">
                    <img
                      src={course.thumbnail === 'default-course.jpg' || !course.thumbnail ? 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80' : course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#11151F] via-transparent to-transparent"></div>
                    <div className="absolute top-4 left-4 bg-[#0B0E14]/80 backdrop-blur-md px-3 py-1 rounded-md border border-white/10 text-[10px] font-black text-[#FFD700] uppercase tracking-widest shadow-lg">
                      {course.category}
                    </div>
                  </div>

                  <div className="p-6 md:p-8 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold mb-3 text-white line-clamp-2 group-hover:text-[#FFD700] transition-colors">{course.title}</h3>
                    <p className="text-sm text-slate-400 mb-6 line-clamp-2 leading-relaxed flex-1">
                      {course.description}
                    </p>

                    <Link to={`/course/${course._id}`} className="mt-auto px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-center font-bold uppercase tracking-widest text-[#FFD700] text-sm hover:bg-[#FFD700] hover:text-[#0f172a] hover:border-[#FFD700] transition-all flex items-center justify-center gap-2 group/btn shadow-inner">
                      Explore Course
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="relative z-10 py-24 mb-10 mx-4 sm:mx-6 lg:mx-8">
        <div className="max-w-5xl mx-auto rounded-[3rem] overflow-hidden relative border border-white/10 shadow-[0_0_50px_rgba(255,215,0,0.1)]">
          <div className="absolute inset-0 bg-[#0B0E14]"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80')] opacity-20 bg-cover bg-center mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-[#0B0E14] via-[#0B0E14]/80 to-[#FFD700]/20"></div>
          
          <div className="relative z-10 px-6 py-20 md:py-24 text-center flex flex-col items-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl sm:text-5xl lg:text-6xl font-display font-black mb-6 text-white leading-tight"
            >
              Ready to Shift Your <br/> <span className="text-[#FFD700]">Learning Paradigm?</span>
            </motion.h2>

            <p className="text-slate-300 text-lg sm:text-xl max-w-2xl text-center mb-10 font-medium">
              Join thousands of students and instructors leveraging our state-of-the-art platform to achieve excellence.
            </p>

            <Link
              to="/register"
              className="inline-flex items-center gap-3 px-10 py-5 bg-[#FFD700] text-[#0f172a] font-black uppercase tracking-widest text-lg rounded-2xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,215,0,0.4)]"
            >
              Sign Up For Free <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}