import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { User, Mail, Phone, MapPin, Save, AlertCircle, CircleCheck, Camera, Loader2, Briefcase, Calendar } from 'lucide-react';

export default function ProfileView() {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    bio: '',
    avatar: '',
    coverPhoto: '',
    gender: '',
    dateOfBirth: '',
    address: '',
    emergencyContact: '',
    department: '',
    specialization: '',
    occupation: ''
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
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
            bio: data.user.bio || '',
            avatar: data.user.avatar || '',
            coverPhoto: data.user.coverPhoto || '',
            gender: data.user.gender || '',
            dateOfBirth: data.user.dateOfBirth || '',
            address: data.user.address || '',
            emergencyContact: data.user.emergencyContact || '',
            department: data.user.department || '',
            specialization: data.user.specialization || '',
            occupation: data.user.occupation || ''
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

  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageData = new FormData();
    imageData.append('image', file);

    setUploadingImage(true);
    setError('');
    
    try {
      const { data } = await api.post('/upload', imageData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (data.success) {
        setFormData((prev) => ({ ...prev, [field]: data.filePath }));
        setMessage(`${field === 'avatar' ? 'Profile picture' : 'Cover photo'} uploaded successfully! Remember to save.`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
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
        phone: formData.phone,
        avatar: formData.avatar,
        coverPhoto: formData.coverPhoto,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address,
        emergencyContact: formData.emergencyContact,
        department: formData.department,
        specialization: formData.specialization,
        occupation: formData.occupation
      });
      if (data.success) {
        setMessage('Profile updated successfully!');
        if (data.user) {
          updateUser(data.user);
        }
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
    <div className="animate-in fade-in max-w-3xl mx-auto space-y-6">
      <div className="flex justify-center items-center text-center pb-2">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">My Profile</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your account settings and preferences.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div 
          className="h-32 bg-indigo-600 relative group"
          style={{ 
            backgroundImage: formData.coverPhoto ? `url(http://localhost:5000${formData.coverPhoto})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <label htmlFor="cover-upload" className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full cursor-pointer transition-colors opacity-0 group-hover:opacity-100 flex items-center justify-center backdrop-blur-sm">
            <Camera className="w-5 h-5" />
            <input 
              id="cover-upload" 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={(e) => handleImageUpload(e, 'coverPhoto')}
              disabled={uploadingImage}
            />
          </label>
        </div>
        <div className="px-8 pb-8 relative">
           
           <div className="absolute -top-16 border-4 border-white rounded-full w-32 h-32 bg-slate-200 flex items-center justify-center overflow-hidden group">
              {formData.avatar && formData.avatar !== 'default-avatar.png' ? (
                <img src={`http://localhost:5000${formData.avatar}`} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-16 h-16 text-slate-400" />
              )}
              
              <label htmlFor="avatar-upload" className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity backdrop-blur-sm">
                {uploadingImage ? <Loader2 className="w-6 h-6 animate-spin" /> : <Camera className="w-6 h-6" />}
                <input 
                  id="avatar-upload" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => handleImageUpload(e, 'avatar')}
                  disabled={uploadingImage}
                />
              </label>
           </div>

           <div className="pt-20">
             {message && <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium border border-emerald-100 flex items-center gap-2"><CircleCheck className="w-4 h-4" /> {message}</div>}
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

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Gender</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <select 
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 appearance-none bg-white" 
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Date of Birth</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input 
                      type="date" 
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500" 
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-slate-700">Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input 
                      type="text" 
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="e.g. Bole, Addis Ababa"
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500" 
                    />
                  </div>
                </div>

                {user?.role === 'student' && (
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-slate-700">Emergency Contact</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                      <input 
                        type="text" 
                        name="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={handleChange}
                        placeholder="Name and Phone number"
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500" 
                      />
                    </div>
                  </div>
                )}

                {(user?.role === 'instructor' || user?.role === 'admin') && (
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Department</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                      <input 
                        type="text" 
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        placeholder="e.g. Computer Science"
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500" 
                      />
                    </div>
                  </div>
                )}

                {user?.role === 'instructor' && (
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Specialization</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                      <input 
                        type="text" 
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleChange}
                        placeholder="e.g. Web Development"
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500" 
                      />
                    </div>
                  </div>
                )}

                {user?.role === 'parent' && (
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-slate-700">Occupation</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                      <input 
                        type="text" 
                        name="occupation"
                        value={formData.occupation}
                        onChange={handleChange}
                        placeholder="e.g. Engineer"
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500" 
                      />
                    </div>
                  </div>
                )}

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
