import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Shield, Bell, Lock, Eye, CreditCard, Clock, Sliders, Save, Palette, Key, BookOpen, Settings, User, Mail, Smartphone, Globe, AlertTriangle, Fingerprint, Activity, CheckCircle2 } from 'lucide-react';
import CustomDropdown from '../components/CustomDropdown';

export default function SettingsView() {
  const { user, login } = useAuth(); // use login to refresh context
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Profile Specific State
  const [profileData, setProfileData] = useState({ name: '', email: '' });

  // Parent Connection
  const [connectEmail, setConnectEmail] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [connectMsg, setConnectMsg] = useState('');

  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    if (user) {
      setProfileData({ name: user.name || '', email: user.email || '' });
    }
    fetchSettings();
  }, [user]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/settings');
      if (res.data.success) {
        setSettings(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e?.preventDefault();
    try {
      setSaving(true);
      setSuccessMsg('');
      
      // Save Settings (Database & API)
      const payload = { 
        [user.role]: settings[user.role],
        common: settings.common
      };
      await api.put('/settings', payload);

      // Save General Profile Data if Changed
      if (profileData.name !== user.name || profileData.email !== user.email) {
        const profileRes = await api.put('/users/profile', profileData);
        if (profileRes.data.success && profileRes.data.data) {
           // We might want to refresh the auth context user data
           const token = localStorage.getItem('token');
           if (token) {
               // Reload context cleanly by re-fetching user profile from token manually or window reload
               window.location.reload(); 
               return; 
           }
        }
      }

      setSuccessMsg('Settings updated successfully.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleConnectParent = async () => {
    if (!connectEmail) return;
    try {
      setConnecting(true);
      setConnectMsg('');
      const res = await api.post('/users/connect', { email: connectEmail });
      if (res.data.success) {
        setConnectMsg('Connected successfully!');
        setConnectEmail('');
      } else {
        setConnectMsg(res.data.message || 'Failed to connect.');
      }
    } catch (err) {
      setConnectMsg(err.response?.data?.message || 'Error connecting.');
    } finally {
      setConnecting(false);
    }
  };

  const handleChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [user.role]: {
        ...(prev[user.role] || {}),
        [field]: value
      }
    }));
  };

  const handleCommonChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      common: {
        ...(prev.common || {}),
        [field]: value
      }
    }));
  };

  const ToggleSwitch = ({ label, description, checked, onChange }) => (
    <div className="flex items-center justify-between p-5 bg-[#11151F] rounded-2xl border border-white/5 hover:border-[#FFD700]/30 transition-all group shadow-sm">
      <div className="flex items-start gap-4 pr-6">
        <div>
          <h4 className="font-bold text-white text-sm tracking-wide group-hover:text-[#FFD700] transition-colors">{label}</h4>
          <p className="text-xs text-slate-200 leading-relaxed mt-1">{description}</p>
        </div>
      </div>
      <button 
        type="button" 
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors shrink-0 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0B0E14] focus:ring-[#FFD700] ${checked ? 'bg-[#008A32]' : 'bg-slate-700'}`}
      >
        <span className={`inline-block h-5 w-5 transform rounded-full bg-[#11151F] shadow-md transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  );

  const NumberSlider = ({ label, description, value, onChange, min, max, unit = '' }) => (
    <div className="p-5 bg-[#11151F] rounded-2xl border border-white/5 hover:border-white/10 transition-all shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="font-bold text-white text-sm tracking-wide">{label}</h4>
          <p className="text-xs text-slate-200 mt-1">{description}</p>
        </div>
        <span className="font-black text-lg text-[#008A32] bg-[#008A32]/10 border border-[#008A32]/30 px-3 py-1 rounded-lg shrink-0 shadow-inner">{value}{unit}</span>
      </div>
      <div className="px-1">
        <input 
          type="range" min={min} max={max} value={value} 
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#FFD700]"
        />
        <div className="flex justify-between text-[10px] uppercase font-black text-slate-300 mt-3 tracking-widest">
          <span>{min}{unit}</span>
          <span>{max}{unit}</span>
        </div>
      </div>
    </div>
  );

  const InputField = ({ label, description, type = "text", value, onChange, placeholder, icon: Icon }) => (
    <div className="p-5 bg-[#11151F] rounded-2xl border border-white/5 hover:border-white/10 transition-all shadow-sm">
      <label className="block text-xs font-black uppercase tracking-widest text-[#FFD700] mb-2 flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4" />} {label}
      </label>
      {description && <p className="text-xs text-slate-200 mb-4">{description}</p>}
      <div className="relative">
        <input 
          type={type} 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full p-3.5 bg-[#0B0E14] border border-white/10 text-white rounded-xl font-medium text-sm outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent placeholder:text-slate-300 transition-all shadow-inner"
        />
      </div>
    </div>
  );

  if (loading || !settings) return (
    <div className="flex justify-center items-center h-[60vh]">
      <div className="w-12 h-12 border-4 border-white/10 border-t-[#FFD700] rounded-full animate-spin shadow-[0_0_15px_rgba(255,215,0,0.5)]"></div>
    </div>
  );

  const roleConfig = settings[user.role] || {};
  const commonConfig = settings.common || {};

  // Build tabs dynamically based on role
  const tabs = [
    { id: 'general', icon: User, label: 'General Profile' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'security', icon: Lock, label: 'Security & Auth' }
  ];

  if (user.role === 'admin') {
    tabs.push({ id: 'platform', icon: Globe, label: 'Platform DNA' });
    tabs.push({ id: 'ledger', icon: CreditCard, label: 'Ledger & AI' });
  } else if (user.role === 'instructor') {
    tabs.push({ id: 'pedagogy', icon: BookOpen, label: 'Pedagogy Logic' });
    tabs.push({ id: 'ai', icon: Activity, label: 'Automation & AI' });
  } else if (user.role === 'student') {
    tabs.push({ id: 'privacy', icon: Eye, label: 'Privacy & Sharing' });
    tabs.push({ id: 'family', icon: Shield, label: 'Family Link' });
  } else if (user.role === 'parent') {
    tabs.push({ id: 'billing', icon: CreditCard, label: 'Billing Settings' });
    tabs.push({ id: 'alerts', icon: AlertTriangle, label: 'Alert Thresholds' });
  }

  return (
    <div className="animate-in fade-in max-w-7xl mx-auto space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 border-b border-white/10 pb-6">
        <div>
          <h2 className="text-3xl font-display font-black text-white tracking-widest uppercase flex items-center gap-3">
             <Sliders className="w-8 h-8 text-[#FFD700]" /> Configuration Hub
          </h2>
          <p className="text-slate-200 font-medium text-sm mt-2">Manage preferences, security protocols, and platform mechanics.</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          {successMsg && (
            <span className="text-[#008A32] font-bold uppercase tracking-widest text-[10px] bg-[#008A32]/10 px-3 py-1.5 rounded-md border border-[#008A32]/20 animate-in slide-in-from-right-4 flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5"/> {successMsg}
            </span>
          )}
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#EAB308] text-[#0B0E14] font-black uppercase tracking-widest text-xs rounded-xl shadow-[0_0_20px_rgba(255,215,0,0.2)] hover:shadow-[0_0_25px_rgba(255,215,0,0.4)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50"
          >
            {saving ? <div className="w-4 h-4 border-2 border-[#0B0E14]/30 border-t-[#0B0E14] rounded-full animate-spin"></div> : <Save className="w-4 h-4" />}
            {saving ? 'Comitting...' : 'Apply Changes'}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Navigation Sidebar */}
        <div className="w-full lg:w-64 shrink-0">
          <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-hide sticky top-[104px]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-left font-bold text-sm tracking-wide transition-all whitespace-nowrap outline-none ${
                  activeTab === tab.id 
                  ? 'bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20 shadow-inner' 
                  : 'text-slate-200 hover:bg-[#11151F]/5 hover:text-white border border-transparent focus:ring-2 focus:ring-[#FFD700]/50'
                }`}
              >
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'opacity-100' : 'opacity-70'}`} /> {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Configuration Panel */}
        <div className="flex-1 bg-[#0B0E14]/80 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl min-h-[500px] relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#FFD700]/3 to-[#008A32]/3 rounded-full blur-[100px] pointer-events-none -z-10"></div>

          <div className="animate-in fade-in slide-in-from-right-4 duration-300 z-10 relative space-y-8">
            
            {/* GENERAL TAB (Database Connected) */}
            {activeTab === 'general' && (
              <>
                <div className="border-b border-white/10 pb-4 mb-6">
                  <h3 className="text-lg font-black text-white uppercase tracking-widest">General Profile Mechanics</h3>
                  <p className="text-xs text-slate-200 mt-1">Configure baseline structural data and display protocols.</p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <InputField label="Public Display Name" value={profileData.name} onChange={(v) => setProfileData(p => ({...p, name: v}))} placeholder="Full Name" type="text" />
                  <InputField label="Primary Email Route" value={profileData.email} onChange={(v) => setProfileData(p => ({...p, email: v}))} placeholder="Email" type="email" />
                </div>
                <div className="space-y-4">
                  <label className="block text-xs font-black uppercase tracking-widest text-[#FFD700]">Timezone Protocol</label>
                  <CustomDropdown
                    value={commonConfig.timezone || '(GMT+03:00) East Africa Time'}
                    onChange={(v) => handleCommonChange('timezone', v)}
                    options={[
                      {label: '(GMT+03:00) East Africa Time', value: '(GMT+03:00) East Africa Time'},
                      {label: '(GMT+00:00) Greenwich Mean Time', value: '(GMT+00:00) Greenwich Mean Time'},
                      {label: '(GMT-05:00) Eastern Time', value: '(GMT-05:00) Eastern Time'},
                      {label: '(GMT-08:00) Pacific Time', value: '(GMT-08:00) Pacific Time'},
                    ]}
                    className="w-full md:w-1/2 [&>button]:py-3.5 [&>button]:bg-[#11151F] [&>button]:text-white [&>button]:border-white/10"
                  />
                </div>
              </>
            )}

            {/* NOTIFICATIONS TAB (Database Connected) */}
            {activeTab === 'notifications' && (
              <>
                <div className="border-b border-white/10 pb-4 mb-6">
                  <h3 className="text-lg font-black text-white uppercase tracking-widest">Notification Matrix</h3>
                  <p className="text-xs text-slate-200 mt-1">Design your interrupt frequency and communication channels.</p>
                </div>
                <div className="grid gap-4">
                  <ToggleSwitch label="System Announcements" description="Critical platform updates and scheduled maintenance downtimes." checked={commonConfig.notifySystem ?? true} onChange={(v) => handleCommonChange('notifySystem', v)} />
                  <ToggleSwitch label="Direct Messages" description="In-app and email routing for personal communications." checked={commonConfig.notifyMessages ?? true} onChange={(v) => handleCommonChange('notifyMessages', v)} />
                  <ToggleSwitch label="Weekly Digested Reports" description="Algorithmic summaries sent via email every Sunday at 00:00 UTC." checked={commonConfig.notifyDigest ?? false} onChange={(v) => handleCommonChange('notifyDigest', v)} />
                </div>
              </>
            )}

            {/* SECURITY TAB (Mocked Advanced UI) */}
            {activeTab === 'security' && (
              <>
                <div className="border-b border-white/10 pb-4 mb-6">
                  <h3 className="text-lg font-black text-white uppercase tracking-widest">Security & Authentication</h3>
                  <p className="text-xs text-slate-200 mt-1">Audit logs, 2FA protocols, and access management.</p>
                </div>
                <div className="p-6 bg-[#11151F] rounded-2xl border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                  <div>
                    <h4 className="font-bold text-white text-sm tracking-wide flex items-center gap-2"><Fingerprint className="w-4 h-4 text-[#FFD700]"/> Biometric / Two-Factor Protocol</h4>
                    <p className="text-xs text-slate-200 mt-1">Currently utilizing standard credential validation. We recommend enabling 2FA.</p>
                  </div>
                  <button type="button" className="px-5 py-2.5 bg-[#11151F]/5 border border-white/10 text-white font-bold uppercase tracking-widest text-[10px] rounded-lg hover:bg-[#11151F]/10 transition-all shrink-0">Enable 2FA</button>
                </div>
                <div className="p-6 bg-[#11151F] rounded-2xl border border-white/5 flex flex-col justify-center gap-4 shadow-sm">
                  <div>
                    <h4 className="font-bold text-rose-500 text-sm tracking-wide">Device Sessions</h4>
                    <p className="text-xs text-slate-200 mt-1">1 active session on Windows NT 10.0; Win64.</p>
                  </div>
                  <button type="button" className="w-max px-5 py-2.5 bg-rose-500/100/10 border border-rose-500/30 text-rose-500 font-bold uppercase tracking-widest text-[10px] rounded-lg hover:bg-rose-500/100/20 transition-all">Terminate All Other Sessions</button>
                </div>
              </>
            )}

            {/* INSTRUCTOR: PEDAGOGY */}
            {activeTab === 'pedagogy' && (
              <>
                <div className="border-b border-white/10 pb-4 mb-6">
                  <h3 className="text-lg font-black text-[#FFD700] uppercase tracking-widest">Pedagogy Logic</h3>
                  <p className="text-xs text-slate-200 mt-1">Configure instructional defaults and visibility parameters.</p>
                </div>
                <div className="space-y-6">
                  <InputField 
                    icon={Clock} label="Consultation Window (Office Hours)" 
                    description="Define your public schedule for dynamic student booking."
                    type="text" value={roleConfig.consultationHours || ''} onChange={(v) => handleChange('consultationHours', v)} placeholder="e.g. Mon-Wed 3PM-5PM (GMT+3)" 
                  />
                  <div className="p-5 bg-[#11151F] rounded-2xl border border-white/5 hover:border-white/10 transition-all shadow-sm">
                    <label className="block text-xs font-black uppercase tracking-widest text-[#FFD700] mb-2 flex items-center gap-2">
                       <BookOpen className="w-4 h-4" /> Catalog Autonomy
                    </label>
                    <p className="text-xs text-slate-200 mb-4">Default visibility protocol for unapproved drafted courses.</p>
                    <CustomDropdown
                      value={roleConfig.courseVisibility || 'public'}
                      onChange={(val) => handleChange('courseVisibility', val)}
                      options={[
                        { label: 'Public (Requires Approval Algorithm)', value: 'public' },
                        { label: 'Hidden (Private Link Only)', value: 'enrolled_only' }
                      ]}
                      className="w-full md:w-3/4 [&>button]:py-3.5 [&>button]:bg-[#0B0E14] [&>button]:text-white [&>button]:border-white/10 font-bold"
                    />
                  </div>
                </div>
              </>
            )}

            {/* INSTRUCTOR: AI */}
            {activeTab === 'ai' && (
              <>
                <div className="border-b border-white/10 pb-4 mb-6">
                  <h3 className="text-lg font-black text-[#FFD700] uppercase tracking-widest">Automation & AI</h3>
                  <p className="text-xs text-slate-200 mt-1">Algorithmic generation toggles.</p>
                </div>
                <div className="grid gap-4">
                  <ToggleSwitch 
                    label="Automated Tag Analysis" 
                    description="Generate algorithmic performance reports on student progress asynchronously to save manual review time." 
                    checked={roleConfig.autoTags !== false} onChange={(v) => handleChange('autoTags', v)} 
                  />
                  <ToggleSwitch 
                    label="AI Auto-Grading (Beta)" 
                    description="Allow the system to automatically infer grades on free-text quiz formats." 
                    checked={roleConfig.autoGrade ?? false} onChange={(v) => handleChange('autoGrade', v)} 
                  />
                </div>
              </>
            )}

            {/* ADMIN: PLATFORM */}
            {activeTab === 'platform' && (
              <>
                <div className="border-b border-white/10 pb-4 mb-6">
                  <h3 className="text-lg font-black text-[#FFD700] uppercase tracking-widest">Platform DNA</h3>
                  <p className="text-xs text-slate-200 mt-1">Global branding and root configurations.</p>
                </div>
                <div className="p-8 bg-[#11151F] rounded-2xl border border-white/5 flex flex-col justify-center mb-6 shadow-sm">
                  <label className="block text-xs font-black uppercase tracking-widest text-[#FFD700] mb-4 flex items-center gap-2"><Palette className="w-4 h-4"/> Global Hex Code</label>
                  <p className="text-xs text-slate-200 mb-6 font-medium">This cascades the color injection across the SCSS variables.</p>
                  <div className="flex gap-4 items-center bg-[#0B0E14] p-3 rounded-xl border border-white/10 w-max shadow-inner">
                    <input 
                      type="color" 
                      value={roleConfig.primaryColor || '#0B0E14'}
                      onChange={(e) => handleChange('primaryColor', e.target.value)}
                      className="w-10 h-10 p-0 border-none rounded-lg cursor-pointer bg-transparent"
                    />
                    <span className="font-mono text-white tracking-widest font-black pr-4">{roleConfig.primaryColor || '#0B0E14'}</span>
                  </div>
                </div>
                <InputField 
                    icon={Key} label="External Auth API Proxy Key" 
                    description="Overriding the live sk_live secret layer."
                    type="password" value={roleConfig.apiKey || ''} onChange={(v) => handleChange('apiKey', v)} placeholder="sk_live_..." 
                />
              </>
            )}

            {/* ADMIN: LEDGER & AI */}
            {activeTab === 'ledger' && (
              <>
                <div className="border-b border-white/10 pb-4 mb-6">
                  <h3 className="text-lg font-black text-[#FFD700] uppercase tracking-widest">Ledger & Intelligence</h3>
                  <p className="text-xs text-slate-200 mt-1">Financial logic and automated interventions.</p>
                </div>
                <div className="grid gap-6">
                  <NumberSlider 
                    label="Standard Ledger Commission" 
                    description="Default global percentage fee cut extracted from instructor ticket sales."
                    min={0} max={30} unit="%"
                    value={roleConfig.feePercentage ?? 10} 
                    onChange={(val) => handleChange('feePercentage', val)} 
                  />
                  <ToggleSwitch 
                    label="AI Intervention Protocol" 
                    description="Aggressively trigger automated behavioral interventions server-side for severe attendance drops."
                    checked={roleConfig.autoInterventionTriggers !== false} 
                    onChange={(val) => handleChange('autoInterventionTriggers', val)} 
                  />
                </div>
              </>
            )}

            {/* STUDENT: PRIVACY */}
            {activeTab === 'privacy' && (
              <>
                <div className="border-b border-white/10 pb-4 mb-6">
                  <h3 className="text-lg font-black text-[#FFD700] uppercase tracking-widest">Transparency Matrix</h3>
                  <p className="text-xs text-slate-200 mt-1">Control your data visibility to guardians and peers.</p>
                </div>
                <div className="grid gap-4">
                  <ToggleSwitch 
                    label="Private Mode" 
                    description="Go completely off-grid. Prevents automatic activity syncing to supporters." 
                    checked={roleConfig.privateMode === true} onChange={(v) => handleChange('privateMode', v)} 
                  />
                  <ToggleSwitch 
                    label="Share Milestones with Parents" 
                    description="Allow linked parent accounts to see when you complete a course or lesson." 
                    checked={roleConfig.shareMilestones !== false} onChange={(v) => handleChange('shareMilestones', v)} 
                  />
                  <ToggleSwitch 
                    label="Share Grade Summaries" 
                    description="Allow parents to view your aggregate test scores and quiz metrics." 
                    checked={roleConfig.shareGrades !== false} onChange={(v) => handleChange('shareGrades', v)} 
                  />
                </div>
              </>
            )}

            {/* STUDENT: FAMILY */}
            {activeTab === 'family' && (
              <>
                <div className="border-b border-white/10 pb-4 mb-6">
                  <h3 className="text-lg font-black text-[#FFD700] uppercase tracking-widest">Family Supporter Link</h3>
                  <p className="text-xs text-slate-200 mt-1">Connect your account securely via email validation.</p>
                </div>
                <div className="p-8 bg-[#11151F] rounded-2xl border border-white/5 border-l-4 border-l-[#008A32] shadow-sm">
                  <h4 className="text-sm font-bold text-white mb-2">Guardian Email Address</h4>
                  <p className="text-xs text-slate-200 mb-6 font-medium max-w-lg leading-relaxed">Link your account with a parent's registered email to securely share progress dynamically. Both parties must be registered.</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input 
                      type="email" 
                      value={connectEmail}
                      onChange={(e) => setConnectEmail(e.target.value)}
                      placeholder="parent@example.com"
                      className="flex-1 p-3.5 bg-[#0B0E14] border border-white/10 text-white rounded-xl font-semibold outline-none focus:ring-2 focus:ring-[#008A32] focus:border-transparent placeholder:text-slate-300 shadow-inner"
                    />
                    <button 
                      type="button"
                      onClick={handleConnectParent}
                      disabled={connecting}
                      className="px-6 py-3.5 bg-gradient-to-r from-[#008A32] to-[#006622] text-white font-black uppercase tracking-widest text-[11px] rounded-xl hover:shadow-[0_0_15px_rgba(0,138,50,0.4)] hover:-translate-y-0.5 transition-all disabled:opacity-50 shrink-0"
                    >
                      {connecting ? 'Linking...' : 'Establish Link'}
                    </button>
                  </div>
                  {connectMsg && <p className={`mt-4 text-xs font-bold uppercase tracking-widest ${(connectMsg.includes('Error') || connectMsg.includes('Failed') || connectMsg.includes('not found') || connectMsg.includes('Already')) ? 'text-[#E30A17]' : 'text-[#008A32]'}`}>{connectMsg}</p>}
                </div>
              </>
            )}

            {/* PARENT: BILLING */}
            {activeTab === 'billing' && (
              <>
                <div className="border-b border-white/10 pb-4 mb-6">
                  <h3 className="text-lg font-black text-[#FFD700] uppercase tracking-widest">Subscriptions & Billing</h3>
                  <p className="text-xs text-slate-200 mt-1">Manage payment sources for dependent enrollments.</p>
                </div>
                <div className="p-6 bg-[#11151F] rounded-2xl border border-white/5 shadow-sm">
                  <label className="block text-xs font-black uppercase tracking-widest text-[#FFD700] mb-4 flex items-center gap-2"><CreditCard className="w-4 h-4"/> Default Payment Protocol</label>
                  <CustomDropdown
                    value={roleConfig.billingMethod || 'unlinked'}
                    onChange={(val) => handleChange('billingMethod', val)}
                    options={[
                      { label: 'Unlinked / Manual Checkout', value: 'unlinked' },
                      { label: 'Stored Payment Vault', value: 'card' },
                      { label: 'Direct Bank Wire Interface', value: 'bank_transfer' }
                    ]}
                    className="w-full md:w-3/4 [&>button]:py-4 [&>button]:bg-[#0B0E14] [&>button]:text-white [&>button]:border-white/10"
                  />
                </div>
              </>
            )}

            {/* PARENT: ALERTS */}
            {activeTab === 'alerts' && (
              <>
                <div className="border-b border-white/10 pb-4 mb-6">
                  <h3 className="text-lg font-black text-[#FFD700] uppercase tracking-widest">Support Thresholds</h3>
                  <p className="text-xs text-slate-200 mt-1">Algorithmic danger alerts based on real student data.</p>
                </div>
                <div className="grid lg:grid-cols-2 gap-6">
                  <NumberSlider 
                    label="Grade Alert Drop Threshold" 
                    description="Trigger real-time alert if average grades structurally fall below this mark."
                    min={0} max={100} unit="%"
                    value={roleConfig.alertGradeBelow ?? 70} 
                    onChange={(val) => handleChange('alertGradeBelow', val)} 
                  />
                  <NumberSlider 
                    label="Absence Danger Threshold" 
                    description="Immediately escalate alert after this many consecutive missed sessions."
                    min={1} max={10} unit=" days"
                    value={roleConfig.alertAbsenceCount ?? 3} 
                    onChange={(val) => handleChange('alertAbsenceCount', val)} 
                  />
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
