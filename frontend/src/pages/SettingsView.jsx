import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Shield, Bell, Lock, Eye, CreditCard, Clock, Sliders, Save, Palette, Key, BookOpen, Settings } from 'lucide-react';
import CustomDropdown from '../components/CustomDropdown';

export default function SettingsView() {
  const { user } = useAuth();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Connect Parent States
  const [connectEmail, setConnectEmail] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [connectMsg, setConnectMsg] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

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
      const payload = { [user.role]: settings[user.role] };
      const res = await api.put('/settings', payload);
      if (res.data.success) {
        setSettings(res.data.data);
        setSuccessMsg('Settings saved successfully!');
        setTimeout(() => setSuccessMsg(''), 3000);
      }
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

  const ToggleSwitch = ({ label, description, checked, onChange, icon: Icon }) => (
    <div className="flex items-center justify-between p-6 bg-[#0B0E14]/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl hover:border-[#FFD700]/30 transition-all">
      <div className="flex items-start gap-4 pr-6">
        {Icon && <div className="w-12 h-12 rounded-xl bg-white/5 text-[#FFD700] border border-white/10 flex items-center justify-center shrink-0 shadow-sm"><Icon className="w-6 h-6"/></div>}
        <div>
          <h4 className="font-bold text-white text-[15px] tracking-wide">{label}</h4>
          <p className="text-sm text-slate-400 leading-relaxed mt-1 font-medium">{description}</p>
        </div>
      </div>
      <button 
        type="button" 
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors shrink-0 ${checked ? 'bg-[#008A32]' : 'bg-slate-700'}`}
      >
        <span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform ${checked ? 'translate-x-7' : 'translate-x-1'}`} />
      </button>
    </div>
  );

  const NumberSlider = ({ label, description, value, onChange, min, max, icon: Icon, unit = '' }) => (
    <div className="p-6 bg-[#0B0E14]/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-start gap-4">
          {Icon && <div className="w-12 h-12 rounded-xl bg-white/5 text-[#FFD700] border border-white/10 flex items-center justify-center shrink-0 shadow-sm"><Icon className="w-6 h-6"/></div>}
          <div>
            <h4 className="font-bold text-white text-[15px] tracking-wide">{label}</h4>
            <p className="text-sm text-slate-400 mt-1 font-medium">{description}</p>
          </div>
        </div>
        <span className="font-black text-xl text-[#008A32] bg-[#008A32]/10 border border-[#008A32]/30 px-3 py-1 rounded-lg shrink-0">{value}{unit}</span>
      </div>
      <div className="px-2">
        <input 
          type="range" min={min} max={max} value={value} 
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#FFD700]"
        />
        <div className="flex justify-between text-[11px] uppercase font-black text-slate-500 mt-3 tracking-widest">
          <span>{min}{unit}</span>
          <span>{max}{unit}</span>
        </div>
      </div>
    </div>
  );

  if (loading || !settings) return (
    <div className="flex justify-center items-center h-64">
      <div className="w-10 h-10 border-4 border-white/10 border-t-[#FFD700] rounded-full animate-spin"></div>
    </div>
  );

  const roleConfig = settings[user.role] || {};

  return (
    <div className="animate-in fade-in max-w-4xl mx-auto pb-12 space-y-8">
      <div className="bg-[#0B0E14]/90 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl flex items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#FFD700] rounded-bl-full opacity-5 pointer-events-none"></div>
        <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md z-10 shrink-0 shadow-lg">
          <Settings className="w-8 h-8 text-[#FFD700]" />
        </div>
        <div className="z-10">
          <h2 className="text-3xl font-display font-black text-white tracking-widest uppercase">Platform Configuration</h2>
          <p className="text-[#FFD700] font-bold text-xs uppercase tracking-widest mt-1">Manage global preferences, privacy, and system behavior.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-10">
        
        {/* STUDENT SETTINGS - The Freedom Toggle */}
        {user.role === 'student' && (
          <div className="space-y-6">
            <h3 className="text-xl font-black text-white border-b border-white/10 pb-3 uppercase tracking-widest">Transparency Control</h3>
            <div className="grid gap-6">
              <ToggleSwitch 
                icon={Eye} label="Share Milestones with Parents" 
                description="Allow linked parent accounts to see when you complete a course or lesson."
                checked={roleConfig.shareMilestones !== false} 
                onChange={(val) => handleChange('shareMilestones', val)} 
              />
              <ToggleSwitch 
                icon={BookOpen} label="Share Grade Summaries" 
                description="Allow parents to view your aggregate test scores and quiz metrics."
                checked={roleConfig.shareGrades !== false} 
                onChange={(val) => handleChange('shareGrades', val)} 
              />
              <ToggleSwitch 
                icon={Lock} label="Private Mode" 
                description="Go completely off-grid. Prevents automatic activity syncing to supporters."
                checked={roleConfig.privateMode === true} 
                onChange={(val) => handleChange('privateMode', val)} 
              />
            </div>

            <h3 className="text-xl font-black text-white border-b border-white/10 pb-3 mt-10 uppercase tracking-widest">Parent / Guardian Sync</h3>
            <div className="p-8 bg-[#0B0E14]/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl">
              <label className="block text-[11px] font-black uppercase tracking-widest text-[#FFD700] mb-3">Guardian Email Address</label>
              <p className="text-sm text-slate-400 mb-6 font-medium">Link your account with a parent's registered email to securely share progress dynamically.</p>
              <div className="flex flex-col md:flex-row gap-4">
                <input 
                  type="email" 
                  value={connectEmail}
                  onChange={(e) => setConnectEmail(e.target.value)}
                  placeholder="parent@example.com"
                  className="flex-1 p-4 bg-[#11151F] border border-white/10 text-white rounded-xl font-semibold outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent placeholder:text-slate-600 shadow-inner"
                />
                <button 
                  type="button"
                  onClick={handleConnectParent}
                  disabled={connecting}
                  className="px-8 py-4 bg-gradient-to-r from-[#008A32] to-[#006622] text-white font-black uppercase tracking-widest text-[11px] rounded-xl shadow-lg hover:shadow-[#008A32]/30 transition-all disabled:opacity-50"
                >
                  {connecting ? 'Linking...' : 'Establish Link'}
                </button>
              </div>
              {connectMsg && <p className={`mt-4 text-xs font-bold uppercase tracking-widest ${(connectMsg.includes('Error') || connectMsg.includes('Failed') || connectMsg.includes('not found') || connectMsg.includes('Already')) ? 'text-[#E30A17]' : 'text-[#008A32]'}`}>{connectMsg}</p>}
            </div>
          </div>
        )}

        {/* PARENT SETTINGS - Supporter Hub */}
        {user.role === 'parent' && (
          <div className="space-y-6">
            <h3 className="text-xl font-black text-white border-b border-white/10 pb-3 uppercase tracking-widest">Support Thresholds</h3>
            <div className="mb-6 p-8 bg-[#0B0E14]/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl">
              <label className="block text-[11px] font-black uppercase tracking-widest text-[#FFD700] mb-4 flex items-center gap-2"><CreditCard className="w-5 h-5 text-[#FFD700]"/> Subscriptions & Billing</label>
              <CustomDropdown
                value={roleConfig.billingMethod || 'unlinked'}
                onChange={(val) => handleChange('billingMethod', val)}
                options={[
                  { label: 'Unlinked / Manual Checkout', value: 'unlinked' },
                  { label: 'Stored Payment Method', value: 'card' },
                  { label: 'Direct Bank Wire', value: 'bank_transfer' }
                ]}
                className="w-full md:w-1/2 [&>button]:py-4 [&>button]:bg-[#11151F] [&>button]:text-white [&>button]:border-white/10"
              />
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
              <NumberSlider 
                icon={Bell} label="Grade Alert Drop Threshold" 
                description="Trigger real-time alert if average grades structurally fall below this mark."
                min={0} max={100} unit="%"
                value={roleConfig.alertGradeBelow ?? 70} 
                onChange={(val) => handleChange('alertGradeBelow', val)} 
              />
              <NumberSlider 
                icon={Clock} label="Absence Danger Threshold" 
                description="Immediately escalate alert after this many consecutive missed sessions."
                min={1} max={10} unit=" days"
                value={roleConfig.alertAbsenceCount ?? 3} 
                onChange={(val) => handleChange('alertAbsenceCount', val)} 
              />
            </div>
          </div>
        )}

        {/* INSTRUCTOR SETTINGS */}
        {user.role === 'instructor' && (
          <div className="space-y-6">
            <h3 className="text-xl font-black text-white border-b border-white/10 pb-3 uppercase tracking-widest">Pedagogy & Delivery</h3>
            <div className="p-8 bg-[#0B0E14]/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl">
              <label className="block text-[11px] font-black uppercase tracking-widest text-[#FFD700] mb-3">Consultation Window (Office Hours)</label>
              <p className="text-sm text-slate-400 mb-6 font-medium">Define your public schedule for dynamic student booking.</p>
              <input 
                type="text" 
                value={roleConfig.consultationHours || ''}
                onChange={(e) => handleChange('consultationHours', e.target.value)}
                placeholder="e.g. Mon-Wed 3PM-5PM (GMT+3)"
                className="w-full p-4 bg-[#11151F] border border-white/10 text-white rounded-xl font-semibold outline-none focus:ring-2 focus:ring-[#FFD700] placeholder:text-slate-600 shadow-inner"
              />
            </div>
            
            <div className="grid gap-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-8 bg-[#0B0E14]/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl">
                 <div className="mb-4 md:mb-0 pr-6">
                   <h4 className="font-bold text-white text-[15px] tracking-wide">Catalog Autonomy</h4>
                   <p className="text-sm text-slate-400 mt-1 font-medium">Configure default visibility protocol for unapproved drafted courses.</p>
                 </div>
                 <CustomDropdown
                  value={roleConfig.courseVisibility || 'public'}
                  onChange={(val) => handleChange('courseVisibility', val)}
                  options={[
                    { label: 'Public (Requires Approval)', value: 'public' },
                    { label: 'Hidden (Private Link)', value: 'enrolled_only' }
                  ]}
                  className="w-full md:w-64 [&>button]:py-3 [&>button]:bg-[#11151F] [&>button]:text-white [&>button]:border-white/10"
                 />
              </div>
              <ToggleSwitch 
                icon={Sliders} label="Automated Tag Analysis" 
                description="Generate algorithmic performance reports on student progress asynchronously."
                checked={roleConfig.autoTags !== false} 
                onChange={(val) => handleChange('autoTags', val)} 
              />
            </div>
          </div>
        )}

        {/* ADMIN SETTINGS */}
        {user.role === 'admin' && (
          <div className="space-y-6">
            <h3 className="text-xl font-black text-white border-b border-white/10 pb-3 uppercase tracking-widest">System Governance</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-8 bg-[#0B0E14]/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl flex flex-col justify-center">
                <label className="block text-[11px] font-black uppercase tracking-widest text-[#FFD700] mb-4 flex items-center gap-2"><Palette className="w-5 h-5 text-[#FFD700]"/> Global Brand DNA</label>
                <div className="flex gap-4 items-center bg-[#11151F] p-3 rounded-xl border border-white/5">
                  <input 
                    type="color" 
                    value={roleConfig.primaryColor || '#0B0E14'}
                    onChange={(e) => handleChange('primaryColor', e.target.value)}
                    className="w-12 h-12 p-0 border-none rounded-lg cursor-pointer bg-transparent"
                  />
                  <span className="font-mono text-white tracking-widest font-black text-lg">{roleConfig.primaryColor || '#0B0E14'}</span>
                </div>
              </div>
              <div className="p-8 bg-[#0B0E14]/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl">
                <label className="block text-[11px] font-black uppercase tracking-widest text-[#E30A17] mb-4 flex items-center gap-2"><Key className="w-5 h-5 text-[#E30A17]"/> Ext-Auth Key</label>
                <input 
                  type="password" 
                  value={roleConfig.apiKey || ''}
                  onChange={(e) => handleChange('apiKey', e.target.value)}
                  placeholder="sk_live_..."
                  className="w-full p-4 bg-[#11151F] font-mono tracking-widest border border-white/10 text-white rounded-xl outline-none focus:ring-2 focus:ring-[#E30A17] placeholder:text-slate-700"
                />
              </div>
            </div>
            
            <NumberSlider 
              label="Standard Ledger Commission" 
              description="Default global percentage fee cut extracted from instructor ticket sales."
              min={0} max={30} unit="%"
              value={roleConfig.feePercentage ?? 10} 
              onChange={(val) => handleChange('feePercentage', val)} 
            />

            <ToggleSwitch 
              icon={Shield} label="AI Intervention Triggers" 
              description="Aggressively trigger automated behavioral interventions server-side for severe attendance drops."
              checked={roleConfig.autoInterventionTriggers !== false} 
              onChange={(val) => handleChange('autoInterventionTriggers', val)} 
            />
          </div>
        )}

        <div className="pt-8 flex flex-col sm:flex-row items-center gap-6">
          <button 
            type="submit" 
            disabled={saving}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-[#FFD700] to-yellow-600 text-[#0B0E14] font-black uppercase tracking-widest text-xs rounded-xl shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:shadow-[0_0_30px_rgba(255,215,0,0.5)] hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {saving ? <div className="w-5 h-5 border-2 border-[#0B0E14]/30 border-t-[#0B0E14] rounded-full animate-spin"></div> : <Save className="w-5 h-5" />}
            {saving ? 'Persisting...' : 'Commit Settings'}
          </button>
          {successMsg && <span className="text-[#008A32] font-black uppercase tracking-widest text-[11px] bg-[#008A32]/10 px-4 py-2 rounded-lg border border-[#008A32]/20 animate-in fade-in shadow-sm flex items-center gap-2"><Shield className="w-4 h-4"/> {successMsg}</span>}
        </div>
      </form>
    </div>
  );
}
