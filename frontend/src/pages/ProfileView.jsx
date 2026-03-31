import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { User, Mail, Phone, MapPin, Save, AlertCircle, CheckCircle } from 'lucide-react';

export default function ProfileView() {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    bio: ''
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/users/profile');
        if (data.success && data.user) {
          setFormData({
            name: data.user.name || '',
            email: data.user.email || '',
            phone: data.user.phone || '',
            bio: data.user.bio || ''
          });
        }
      } catch (err) {
        console.error('Failed to fetch profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setMessage('');
    setError('');

    // Basic Ethiopian Phone Validation
    const phoneRegex = /^(\+251|0)9\d{8}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
       setError('Please enter a valid Ethiopian phone number (e.g., +2519... or 09...)');
       setUpdating(false);
       return;
    }

    try {
      const { data } = await api.put('/users/profile', {
        name: formData.name,
        bio: formData.bio,
        phone: formData.phone
      });
      if (data.success) {
        setMessage('Profile updated successfully!');
        // Ideally update the user context here with data.user
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in max-w-3xl space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your account settings and preferences.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="h-32 bg-indigo-600"></div>
        <div className="px-8 pb-8 relative">
           
           <div className="absolute -top-16 border-4 border-white rounded-full w-32 h-32 bg-slate-200 flex items-center justify-center overflow-hidden">
              <User className="w-16 h-16 text-slate-400" />
           </div>

           <div className="pt-20">
             {message && <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium border border-emerald-100 flex items-center gap-2"><CheckCircle className="w-4 h-4" /> {message}</div>}
             {error && <div className="mb-6 p-4 bg-rose-50 text-rose-700 rounded-xl text-sm font-medium border border-rose-100 flex items-center gap-2"><AlertCircle className="w-4 h-4" /> {error}</div>}

             <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500" 
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 text-slate-400 rounded-xl cursor-not-allowed" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Phone Number (Ethiopian)</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+251 9XX XXX XXX or 09XX XXX XXX"
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500" 
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-slate-700">Bio</label>
                  <textarea 
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="4" 
                    placeholder="Tell us a little about yourself"
                    className="w-full p-4 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                  ></textarea>
                </div>

                <div className="md:col-span-2 flex justify-end">
                   <button 
                     type="submit" 
                     disabled={updating}
                     className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition"
                   >
                     <Save className="w-5 h-5" />
                     {updating ? 'Saving...' : 'Save Profile'}
                   </button>
                </div>

             </form>
           </div>
        </div>
      </div>
    </div>
  );
}
