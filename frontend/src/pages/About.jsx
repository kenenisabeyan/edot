import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Award, MonitorPlay, ArrowRight, PlayCircle, Star } from 'lucide-react';
import { motion } from 'framer-motion';

import kenoImg from '../assets/keno.jpg';
import firoImg from '../assets/firo.jpg';
import bettyImg from '../assets/betty.jpg';
import yobsanImg from '../assets/yobsan.jpg';


export default function About() {
  const [counts, setCounts] = useState({ students: 0, courses: 0, success: 0 });

  // Animated counters
  useEffect(() => {
    let start = 0;
    const interval = setInterval(() => {
      start += 100;
      setCounts({
        students: Math.min(start, 10000),
        courses: Math.min(start / 10, 500),
        success: Math.min(start / 100, 98)
      });
      if (start >= 10000) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const team = [
    { 
      name: 'Kenenisa Beyan', 
      role: 'CEO & Founder / IT Security Officer', 
      img: kenoImg,
      desc: 'Leads the company vision and focuses on cyber security. Monitors network access to ensure a secure platform.'
    },
    { 
      name: 'Firomsa Guteta', 
      role: 'Visionary & Lead Fullstack Developer', 
      img: firoImg,
      desc: 'Oversees the entire ecosystem, from the 3D Portfolio marketing to the MERN backend architecture of EDOT.'
    },
    { 
      name: 'Bethelhem Yehuala', 
      role: 'Academic Director (Curriculum)', 
      img: bettyImg,
      desc: 'Reviews courses to ensure all lessons and quizzes meet EDOT\'s high educational standards before they go live.'
    },
    { 
      name: 'Yobsan Girma', 
      role: 'Financial Controller & Registrar', 
      img: yobsanImg,
      desc: 'Oversees tuition payments, instructor payouts, student enrollments, progress validation, and certificate issuance.'
    }
  ];

  const testimonials = [
    { name: 'Student A', text: 'EDOT changed how I learn. Very practical and easy!' },
    { name: 'Student B', text: 'The best platform for real skills. Highly recommended!' },
    { name: 'Student C', text: 'I improved my grades and confidence thanks to EDOT.' }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card">

      {/* HERO */}
      <section className="py-24 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <h1 className="text-5xl font-bold mb-4">About EDOT</h1>
        <p className="max-w-2xl mx-auto text-lg">A modern platform designed to help students learn smarter and succeed faster.</p>
      </section>

      {/* VIDEO SECTION */}
      <section className="py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">See How EDOT Works</h2>
        <div className="relative max-w-3xl mx-auto">
          <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3" className="rounded-xl" />
          <PlayCircle className="absolute inset-0 m-auto text-white" size={80} />
        </div>
      </section>

      {/* STATS */}
      <section className="py-20 bg-transparent text-center">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div>
            <h3 className="text-4xl font-bold text-blue-600">{counts.students}+</h3>
            <p>Students</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-blue-600">{counts.courses}+</h3>
            <p>Courses</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-blue-600">{counts.success}%</h3>
            <p>Success Rate</p>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="py-20">
        <h2 className="text-3xl font-bold text-center mb-10">Meet Our Team</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto px-4">
          {team.map((member, i) => (
            <motion.div key={i} whileHover={{ y: -5 }} className="glass-card p-6 rounded-2xl shadow-sm border border-slate-100 text-center flex flex-col h-full">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-blue-50 shadow-md">
                <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
              </div>
              <h4 className="font-bold text-xl text-slate-900 mb-1">{member.name}</h4>
              <p className="text-blue-600 font-semibold text-sm mb-4">{member.role}</p>
              <p className="text-slate-500 text-sm leading-relaxed flex-1">{member.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-transparent">
        <h2 className="text-3xl font-bold text-center mb-10">What Our Students Say</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div key={i} whileHover={{ y: -5 }} className="glass-card p-6 rounded-xl shadow">
              <div className="flex mb-2">
                {[...Array(5)].map((_, i) => <Star key={i} className="text-yellow-400 fill-yellow-400" size={16} />)}
              </div>
              <p className="text-gray-600">"{t.text}"</p>
              <h4 className="mt-4 font-bold">{t.name}</h4>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center bg-blue-600 text-white">
        <h2 className="text-3xl font-bold mb-4">Start Learning Today</h2>
        <Link to="/register" className="inline-flex items-center gap-2 glass-card text-blue-600 px-6 py-3 rounded-xl font-bold">
          Get Started <ArrowRight />
        </Link>
      </section>

    </motion.div>
  );
}
