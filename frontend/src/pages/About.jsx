import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Globe, Award, Shield, MonitorPlay, ArrowRight } from 'lucide-react';

export default function About() {
  return (
    <div className="bg-white min-h-[calc(100vh-80px)]">
      {/* Header Section */}
      <div className="bg-slate-900 text-white py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 rounded-l-full blur-3xl pointer-events-none transform translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            About <span className="text-blue-500">EDOT</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            EDOT (Education Digital Online Tutorials) is a modern learning platform designed to transform how students access knowledge. We combine technology, expert teaching, and structured content to deliver high-quality education for everyone, everywhere.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="flex-1 space-y-8">
              <div>
                <h2 className="text-3xl font-display font-bold text-slate-900 mb-6 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-16 after:h-1 after:bg-blue-600 after:rounded-full">
                  Our Mission
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Our mission is to make quality education accessible to every student, regardless of location or background. EDOT bridges the gap between traditional learning and modern digital education systems.
                </p>
              </div>
              <p className="text-lg text-slate-600 leading-relaxed">
                We empower students by providing structured courses, interactive tools, and both online and in-person tutoring support—ensuring every learner can grow confidently and achieve academic success.
              </p>

              <div className="grid grid-cols-2 gap-6 pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Global Access</h4>
                    <p className="text-sm text-slate-500 mt-1">
                      Learn from anywhere at any time
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Trusted Learning</h4>
                    <p className="text-sm text-slate-500 mt-1">
                      High-quality structured content
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-blue-600/10 rounded-2xl transform translate-x-4 translate-y-4"></div>
              <img
                src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
                alt="Students studying together"
                className="relative rounded-2xl shadow-xl object-cover w-full h-[500px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Grid */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-4 inline-block relative after:content-[''] after:absolute after:-bottom-4 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-1 after:bg-gradient-to-r after:from-blue-600 after:to-blue-400 after:rounded-full">
              Why Choose EDOT?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center group">
              <div className="w-20 h-20 mx-auto rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                Expert Instructors
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Learn from qualified educators and professionals who deliver clear, practical, and engaging lessons designed for real understanding.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center group">
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MonitorPlay className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                Smart Learning Platform
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Access a powerful digital system that helps you manage courses, track your progress, and stay organized throughout your learning journey.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center group">
              <div className="w-20 h-20 mx-auto rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Award className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                Achieve Academic Success
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Build strong knowledge, improve problem-solving skills, and prepare for exams with structured lessons and continuous support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-blue-600/30 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-6">
            Start Your Learning Journey Today
          </h2>
          <p className="text-xl text-gray-700 mb-10 max-w-2xl mx-auto">
            Join EDOT and experience a smarter way of learning with digital courses, expert guidance, and personalized support.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 font-bold text-lg rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              Join as a Student
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link to="/register" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-700 text-white font-bold text-lg rounded-xl border border-blue-500 hover:bg-blue-800 hover:-translate-y-1 transition-all duration-300">
              Become an Instructor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}