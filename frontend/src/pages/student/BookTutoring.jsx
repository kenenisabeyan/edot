// frontend/src/pages/student/BookTutoring.jsx
import React, { useState } from 'react';
import { CalendarIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline';

const BookTutoring = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedTutor, setSelectedTutor] = useState('');

  const tutors = [
    { id: 1, name: 'Dr. Sarah Johnson', expertise: 'Web Development', rating: 4.9, price: 75 },
    { id: 2, name: 'Prof. Michael Chen', expertise: 'Data Science', rating: 4.8, price: 85 },
    { id: 3, name: 'Emma Davis', expertise: 'UI/UX Design', rating: 4.9, price: 70 },
  ];

  const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

  const handleBooking = (e) => {
    e.preventDefault();
    alert('Booking confirmed! You will receive a meeting link shortly.');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-textPrimary mb-6">Book a Tutoring Session</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tutor Selection */}
        <div className="lg:col-span-2">
          <div className="bg-cardBackground rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-textPrimary mb-4">Select a Tutor</h2>
            <div className="space-y-4">
              {tutors.map((tutor) => (
                <div
                  key={tutor.id}
                  onClick={() => setSelectedTutor(tutor.id)}
                  className={`p-4 border rounded-lg cursor-pointer transition duration-300 ${
                    selectedTutor === tutor.id
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-primary'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={`https://randomuser.me/api/portraits/${tutor.id % 2 ? 'women' : 'men'}/${tutor.id}.jpg`}
                      alt={tutor.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-textPrimary">{tutor.name}</h3>
                      <p className="text-sm text-textSecondary">{tutor.expertise}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm text-accent">★ {tutor.rating}</span>
                        <span className="text-sm text-primary">${tutor.price}/hour</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="lg:col-span-1">
          <div className="bg-cardBackground rounded-xl shadow-lg p-6 sticky top-6">
            <h2 className="text-xl font-semibold text-textPrimary mb-4">Book Session</h2>
            
            <form onSubmit={handleBooking} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-textPrimary mb-2">
                  Select Date
                </label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-textPrimary mb-2">
                  Select Time
                </label>
                <div className="relative">
                  <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    required
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                  >
                    <option value="">Select a time</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-textPrimary mb-2">
                  Topic / Questions
                </label>
                <textarea
                  rows="4"
                  placeholder="What would you like to discuss?"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={!selectedTutor || !selectedDate || !selectedTime}
                className="w-full bg-primary text-white py-3 rounded-lg hover:bg-blue-800 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Booking
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookTutoring;