import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Shield, Bell, Lock, Eye, CreditCard, Clock, Sliders, Save, Palette, Key, BookOpen, Settings } from 'lucide-react';

export default function SettingsView() {
  const { user } = useAuth();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

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
    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4 pr-6">
        {Icon && <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0"><Icon className="w-5 h-5"/></div>}
        <div>
          <h4 className="font-semibold text-slate-900">{label}</h4>
          <p className="text-sm text-slate-500 leading-snug mt-0.5">{description}</p>
        </div>
      </div>
      <button 
        type="button" 
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors shrink-0 ${checked ? 'bg-indigo-600' : 'bg-slate-300'}`}
      >
        <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  );

  const NumberSlider = ({ label, description, value, onChange, min, max, icon: Icon, unit = '' }) => (
    <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-start gap-3">
          {Icon && <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0"><Icon className="w-5 h-5"/></div>}
          <div>
            <h4 className="font-semibold text-slate-900">{label}</h4>
            <p className="text-sm text-slate-500 mt-0.5">{description}</p>
          </div>
        </div>
        <span className="font-bold text-lg text-slate-800 bg-slate-100 px-3 py-1 rounded-lg shrink-0">{value}{unit}</span>
      </div>
      <div className="px-2">
        <input 
          type="range" min={min} max={max} value={value} 
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
        <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
          <span>{min}{unit}</span>
          <span>{max}{unit}</span>
        </div>
      </div>
    </div>
  );

  if (loading || !settings) return (
    <div className="flex justify-center items-center h-64">
      <div className="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>
  );

  const roleConfig = settings[user.role] || {};

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto pb-12">
      <div className="mb-8 p-6 bg-slate-900 rounded-3xl text-white shadow-xl flex items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-bl-full opacity-20 -z-0"></div>
        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md z-10 shrink-0">
          <Settings className="w-8 h-8 text-indigo-300" />
        </div>
        <div className="z-10">
          <h2 className="text-3xl font-display font-bold mb-1">Platform Settings</h2>
          <p className="text-slate-400 font-medium tracking-wide">Manage your preferences, privacy, and system behavior.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* STUDENT SETTINGS - The Freedom Toggle */}
        {user.role === 'student' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-2">Transparency Center</h3>
            <div className="grid gap-4">
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
          </div>
        )}

        {/* PARENT SETTINGS - Supporter Hub */}
        {user.role === 'parent' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-2">Supporter Profile & Thresholds</h3>
            <div className="mb-6 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2"><CreditCard className="w-5 h-5 text-indigo-500"/> Billing Method</label>
              <select 
                value={roleConfig.billingMethod || 'unlinked'}
                onChange={(e) => handleChange('billingMethod', e.target.value)}
                className="w-full md:w-1/2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="unlinked">Unlinked / Manual</option>
                <option value="card">Credit Card on File</option>
                <option value="bank_transfer">Direct Bank Transfer</option>
              </select>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <NumberSlider 
                icon={Bell} label="Grade Alert Threshold" 
                description="Notify me if average grades fall below this point."
                min={0} max={100} unit="%"
                value={roleConfig.alertGradeBelow ?? 70} 
                onChange={(val) => handleChange('alertGradeBelow', val)} 
              />
              <NumberSlider 
                icon={Clock} label="Absence Alert Threshold" 
                description="Notify me after this many consecutive missed days."
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
            <h3 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-2">Pedagogical Settings</h3>
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <label className="block text-sm font-bold text-slate-700 mb-2">Consultation Windows</label>
              <p className="text-sm text-slate-500 mb-4 font-medium">Define office hours visible to students and parents.</p>
              <input 
                type="text" 
                value={roleConfig.consultationHours || ''}
                onChange={(e) => handleChange('consultationHours', e.target.value)}
                placeholder="e.g. Mon-Wed 3PM-5PM"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
                 <div>
                   <h4 className="font-semibold text-slate-900">Default Course Visibility</h4>
                   <p className="text-sm text-slate-500 mt-1">Should newly created courses be public in the catalog?</p>
                 </div>
                 <select 
                  value={roleConfig.courseVisibility || 'public'}
                  onChange={(e) => handleChange('courseVisibility', e.target.value)}
                  className="p-3 bg-slate-50 font-medium border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                 >
                   <option value="public">Public (Catalog)</option>
                   <option value="enrolled_only">Hidden (Invite Only)</option>
                 </select>
              </div>
              <ToggleSwitch 
                icon={Sliders} label="Auto-Tag Templates" 
                description="Generate automated 'Good/Bad Side' report structures when flagging activity."
                checked={roleConfig.autoTags !== false} 
                onChange={(val) => handleChange('autoTags', val)} 
              />
            </div>
          </div>
        )}

        {/* ADMIN SETTINGS */}
        {user.role === 'admin' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-2">Institutional Governance</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <label className="block text-sm font-bold text-slate-700 mb-4 flex items-center gap-2"><Palette className="w-5 h-5 text-indigo-500"/> Primary Brand Color</label>
                <div className="flex gap-4 items-center">
                  <input 
                    type="color" 
                    value={roleConfig.primaryColor || '#4f46e5'}
                    onChange={(e) => handleChange('primaryColor', e.target.value)}
                    className="w-16 h-16 p-1 rounded-xl cursor-pointer border border-slate-200"
                  />
                  <span className="font-mono text-slate-600 bg-slate-100 font-bold px-3 py-2 rounded-lg">{roleConfig.primaryColor || '#4f46e5'}</span>
                </div>
              </div>
              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <label className="block text-sm font-bold text-slate-700 mb-4 flex items-center gap-2"><Key className="w-5 h-5 text-amber-500"/> External API Key</label>
                <input 
                  type="password" 
                  value={roleConfig.apiKey || ''}
                  onChange={(e) => handleChange('apiKey', e.target.value)}
                  placeholder="sk_live_..."
                  className="w-full p-4 bg-slate-50 font-medium border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
            
            <NumberSlider 
              label="Standard Platform Fee" 
              description="The default percentage cut taken from premium course sales."
              min={0} max={30} unit="%"
              value={roleConfig.feePercentage ?? 10} 
              onChange={(val) => handleChange('feePercentage', val)} 
            />

            <ToggleSwitch 
              icon={Shield} label="Global Auto-Intervention Rules" 
              description="Automatically send alert emails to parents when critical thresholds are breached system-wide."
              checked={roleConfig.autoInterventionTriggers !== false} 
              onChange={(val) => handleChange('autoInterventionTriggers', val)} 
            />
          </div>
        )}

        <div className="pt-8 flex items-center gap-4">
          <button 
            type="submit" 
            disabled={saving}
            className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-[0_8px_16px_-4px_rgba(79,70,229,0.4)] hover:bg-indigo-700 hover:-translate-y-1 hover:shadow-[0_12px_20px_-4px_rgba(79,70,229,0.5)] transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Save className="w-5 h-5" />}
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
          {successMsg && <span className="text-emerald-600 font-bold text-sm bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100 animate-in fade-in">{successMsg}</span>}
        </div>
      </form>
    </div>
  );
}
