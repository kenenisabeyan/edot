import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { User, Mail, Phone, MapPin, Save, AlertCircle, CircleCheck, Camera, Loader2, Briefcase, Calendar } from 'lucide-react';
import CustomDropdown from '../components/CustomDropdown';

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
        <div className="w-10 h-10 border-4 border-white/10 border-t-[#FFD700] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in max-w-3xl mx-auto space-y-6">
      <div className="flex justify-center items-center text-center pb-2">
        <div>
          <h1 className="text-3xl font-display font-black text-white tracking-widest uppercase">My Portfolio</h1>
          <p className="text-[#FFD700] text-xs font-bold uppercase tracking-widest mt-2">Manage your professional identity and platform presence</p>
        </div>
      </div>

      <div className="bg-[#0B0E14]/90 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
        <div 
          className="h-48 bg-gradient-to-tr from-[#11151F] to-[#008A32]/20 border-b border-white/10 relative group"
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
           
           <div className="absolute -top-20 border-4 border-[#0B0E14] rounded-full w-36 h-36 bg-[#11151F] flex items-center justify-center overflow-hidden group shadow-[0_0_20px_rgba(255,215,0,0.2)]">
              {formData.avatar && formData.avatar !== 'default-avatar.png' ? (
                <img src={`http://localhost:5000${formData.avatar}`} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-16 h-16 text-slate-500" />
              )}
              
              <label htmlFor="avatar-upload" className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-all backdrop-blur-sm">
                {uploadingImage ? <Loader2 className="w-6 h-6 animate-spin text-[#FFD700]" /> : <Camera className="w-6 h-6 text-[#FFD700]" />}
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
             {message && <div className="mb-6 p-4 bg-[#008A32]/10 text-[#008A32] rounded-xl text-sm font-bold border border-[#008A32]/20 flex items-center gap-2 shadow-sm"><CircleCheck className="w-4 h-4" /> {message}</div>}
             {error && <div className="mb-6 p-4 bg-[#E30A17]/10 text-[#E30A17] rounded-xl text-sm font-bold border border-[#E30A17]/20 flex items-center gap-2 shadow-sm"><AlertCircle className="w-4 h-4" /> {error}</div>}

             <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-[#FFD700]">Full Name</label>
                  <div className="relative border border-white/10 rounded-xl overflow-hidden focus-within:border-[#FFD700]/50 focus-within:ring-1 focus-within:ring-[#FFD700]/50 transition-all">
                    <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 bg-[#11151F] text-white font-medium outline-none placeholder:text-slate-600" 
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-[#FFD700]">Email Address</label>
                  <div className="relative border border-white/5 rounded-xl overflow-hidden opacity-50">
                    <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled
                      className="w-full pl-12 pr-4 py-3 bg-transparent text-slate-400 font-medium cursor-not-allowed outline-none" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-[#FFD700]">Phone Number</label>
                  <div className="relative border border-white/10 rounded-xl overflow-hidden focus-within:border-[#FFD700]/50 focus-within:ring-1 focus-within:ring-[#FFD700]/50 transition-all">
                    <Phone className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+251 9XX XXX XXX"
                      className="w-full pl-12 pr-4 py-3 bg-[#11151F] text-white font-medium outline-none placeholder:text-slate-600" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-[#FFD700]">Gender</label>
                  <div className="relative border border-white/10 rounded-xl overflow-hidden focus-within:border-[#FFD700]/50 focus-within:ring-1 focus-within:ring-[#FFD700]/50 transition-all">
                    <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 z-10" />
                    <CustomDropdown 
                      value={formData.gender}
                      onChange={(val) => setFormData({ ...formData, gender: val })}
                      placeholder="Select Gender"
                      options={[
                        { label: 'Male', value: 'Male' },
                        { label: 'Female', value: 'Female' },
                        { label: 'Other', value: 'Other' },
                        { label: 'Prefer not to say', value: 'Prefer not to say' }
                      ]}
                      className="w-full [&>button]:pl-12 [&>button]:py-3 [&>button]:bg-[#11151F] [&>button]:border-none [&>button]:font-medium [&>button]:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-[#FFD700]">Date of Birth</label>
                  <div className="relative border border-white/10 rounded-xl overflow-hidden focus-within:border-[#FFD700]/50 focus-within:ring-1 focus-within:ring-[#FFD700]/50 transition-all">
                    <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                    <input 
                      type="date" 
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 bg-[#11151F] text-white font-medium outline-none color-scheme-dark" 
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-black uppercase tracking-widest text-[#FFD700]">Address</label>
                  <div className="relative border border-white/10 rounded-xl overflow-hidden focus-within:border-[#FFD700]/50 focus-within:ring-1 focus-within:ring-[#FFD700]/50 transition-all">
                    <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                    <input 
                      type="text" 
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="e.g. Bole, Addis Ababa"
                      className="w-full pl-12 pr-4 py-3 bg-[#11151F] text-white font-medium outline-none placeholder:text-slate-600" 
                    />
                  </div>
                </div>

                {user?.role === 'student' && (
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-black uppercase tracking-widest text-emerald-400">Emergency Contact</label>
                    <div className="relative border border-white/10 rounded-xl overflow-hidden focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/50 transition-all">
                      <Phone className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                      <input 
                        type="text" 
                        name="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={handleChange}
                        placeholder="Name and Phone number"
                        className="w-full pl-12 pr-4 py-3 bg-[#11151F] text-white font-medium outline-none placeholder:text-slate-600" 
                      />
                    </div>
                  </div>
                )}

                {(user?.role === 'instructor' || user?.role === 'admin') && (
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-[#008A32]">Department</label>
                    <div className="relative border border-white/10 rounded-xl overflow-hidden focus-within:border-[#008A32]/50 focus-within:ring-1 focus-within:ring-[#008A32]/50 transition-all">
                      <Briefcase className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                      <input 
                        type="text" 
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        placeholder="e.g. Computer Science"
                        className="w-full pl-12 pr-4 py-3 bg-[#11151F] text-white font-medium outline-none placeholder:text-slate-600" 
                      />
                    </div>
                  </div>
                )}

                {user?.role === 'instructor' && (
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-[#008A32]">Specialization</label>
                    <div className="relative border border-white/10 rounded-xl overflow-hidden focus-within:border-[#008A32]/50 focus-within:ring-1 focus-within:ring-[#008A32]/50 transition-all">
                      <Briefcase className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                      <input 
                        type="text" 
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleChange}
                        placeholder="e.g. Web Development"
                        className="w-full pl-12 pr-4 py-3 bg-[#11151F] text-white font-medium outline-none placeholder:text-slate-600" 
                      />
                    </div>
                  </div>
                )}

                {user?.role === 'parent' && (
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-black uppercase tracking-widest text-purple-400">Occupation</label>
                    <div className="relative border border-white/10 rounded-xl overflow-hidden focus-within:border-purple-500/50 focus-within:ring-1 focus-within:ring-purple-500/50 transition-all">
                      <Briefcase className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                      <input 
                        type="text" 
                        name="occupation"
                        value={formData.occupation}
                        onChange={handleChange}
                        placeholder="e.g. Engineer"
                        className="w-full pl-12 pr-4 py-3 bg-[#11151F] text-white font-medium outline-none placeholder:text-slate-600" 
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-black uppercase tracking-widest text-[#FFD700]">Bio</label>
                  <textarea 
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="4" 
                    placeholder="Tell us a little about yourself"
                    className="w-full p-4 bg-[#11151F] border border-white/10 text-white rounded-xl outline-none focus:border-[#FFD700]/50 focus:ring-1 focus:ring-[#FFD700]/50 font-medium resize-none placeholder:text-slate-600 transition-all"
                  ></textarea>
                </div>

                <div className="md:col-span-2 flex justify-end mt-4">
                   <button 
                     type="submit" 
                     disabled={updating}
                     className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#FFD700] to-yellow-600 text-[#0B0E14] font-black uppercase tracking-widest text-xs rounded-xl hover:shadow-[0_0_20px_rgba(255,215,0,0.4)] hover:-translate-y-0.5 transition-all disabled:opacity-50"
                   >
                     <Save className="w-4 h-4" />
                     {updating ? 'Committing...' : 'Commit Changes'}
                   </button>
                </div>

             </form>
           </div>
        </div>
      </div>
    </div>
  );
}
