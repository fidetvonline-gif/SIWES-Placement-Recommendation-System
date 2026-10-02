import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Building, ShieldCheck, ArrowRight } from 'lucide-react';
import { Department, Skill } from '../types';
import { loginUser, registerStudent } from '../services/api';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole: 'student' | 'admin';
  onLoginSuccess: (user: any) => void;
  departments: Department[];
  skills: Skill[];
}

export function LoginModal({ isOpen, onClose, defaultRole, onLoginSuccess, departments, skills }: LoginModalProps) {
  const [role, setRole] = useState<'student' | 'admin'>(defaultRole);
  const [isRegistering, setIsRegistering] = useState(false);
  const [emailOrReg, setEmailOrReg] = useState('student@fedpolyukana.edu.ng');
  const [password, setPassword] = useState('password123');
  
  // Registration form state
  const [fullName, setFullName] = useState('');
  const [regNo, setRegNo] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('password123');
  const [deptID, setDeptID] = useState(departments[0]?.departmentID || 'dept-1');
  const [level, setLevel] = useState('ND 2');
  const [interest, setInterest] = useState('Software Development');
  const [preferredLocation, setPreferredLocation] = useState('Uyo');
  const [selectedSkillIDs, setSelectedSkillIDs] = useState<string[]>(['skill-1', 'skill-3']);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // 1. Optionally sync with Supabase Auth only if real project credentials are provided
      if (isSupabaseConfigured && supabase) {
        try {
          const { error: authError } = await supabase.auth.signInWithPassword({
            email: emailOrReg.includes('@') ? emailOrReg : `${emailOrReg}@example.com`,
            password
          });
          if (authError) console.warn('Supabase Auth notice:', authError.message);
        } catch (authErr) {
          console.warn('Supabase Auth call ignored:', authErr);
        }
      }

      // 2. Call backend API for user credentials verification
      const data = await loginUser(emailOrReg, password, role);
      if (data.success) {
        onLoginSuccess(data.user);
        onClose();
      } else {
        setError(data.message || 'Login failed. Please verify credentials.');
      }
    } catch (err: any) {
      console.error('Login submission error:', err);
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // 1. Optionally sync with Supabase Auth only if real project credentials are provided
      if (isSupabaseConfigured && supabase) {
        try {
          const { error: authError } = await supabase.auth.signUp({
            email: regEmail,
            password: regPassword
          });
          if (authError) console.warn('Supabase SignUp notice:', authError.message);
        } catch (authErr) {
          console.warn('Supabase SignUp call ignored:', authErr);
        }
      }

      // 2. Call our backend API to create the profile
      const data = await registerStudent({
        fullName,
        regNo,
        email: regEmail,
        password: regPassword,
        departmentID: deptID,
        level,
        interest,
        preferredLocation,
        skillIDs: selectedSkillIDs
      });
      if (data.success) {
        onLoginSuccess(data.user);
        onClose();
      } else {
        setError(data.message || 'Registration failed. Please check your details.');
      }
    } catch (err: any) {
      console.error('Registration submission error:', err);
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleSkill = (skillID: string) => {
    if (selectedSkillIDs.includes(skillID)) {
      setSelectedSkillIDs(selectedSkillIDs.filter(id => id !== skillID));
    } else {
      setSelectedSkillIDs([...selectedSkillIDs, skillID]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">
              {isRegistering ? 'Student SIWES Registration' : `${role === 'admin' ? 'Administrator' : 'Student'} Portal Sign In`}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              SIWES Placement Recommendation System
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Role & Mode Switcher */}
        {!isRegistering && (
          <div className="px-6 pt-4 bg-slate-50 border-b border-slate-200 flex gap-2">
            <button
              onClick={() => { setRole('student'); setEmailOrReg('student@fedpolyukana.edu.ng'); }}
              className={`flex-1 py-2.5 text-xs font-semibold rounded-xl transition-all ${role === 'student' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Student Portal
            </button>
            <button
              onClick={() => { setRole('admin'); setEmailOrReg('admin@fedpolyukana.edu.ng'); setPassword('adminpassword'); }}
              className={`flex-1 py-2.5 text-xs font-semibold rounded-xl transition-all ${role === 'admin' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Administrator Portal
            </button>
          </div>
        )}

        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
              {error}
            </div>
          )}

          {!isRegistering ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  {role === 'student' ? 'Email or Registration Number' : 'Admin Email'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    {role === 'student' ? <UserIcon className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                  </div>
                  <input
                    type="text"
                    required
                    value={emailOrReg}
                    onChange={(e) => setEmailOrReg(e.target.value)}
                    placeholder={role === 'student' ? 'Registration Number or email' : 'admin@fedpolyukana.edu.ng'}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 mt-2"
              >
                <span>{loading ? 'Signing in...' : 'Sign In to Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {role === 'student' && (
                <div className="text-center pt-3 border-t border-slate-100">
                  <p className="text-xs text-slate-500">
                    Don't have a student account yet?{' '}
                    <button
                      type="button"
                      onClick={() => setIsRegistering(true)}
                      className="text-indigo-600 font-bold hover:underline"
                    >
                      Register here
                    </button>
                  </p>
                </div>
              )}
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your Full Name"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Reg Number</label>
                  <input
                    type="text"
                    required
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value)}
                    placeholder="e.g. 2024/ND/CS/001"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Email Address</label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="student@fedpolyukana.edu.ng"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Password</label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Department</label>
                  <select
                    value={deptID}
                    onChange={(e) => setDeptID(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
                  >
                    {departments.map(d => (
                      <option key={d.departmentID} value={d.departmentID}>{d.departmentName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Level</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="ND 1">ND 1</option>
                    <option value="ND 2">ND 2</option>
                    <option value="HND 1">HND 1</option>
                    <option value="HND 2">HND 2</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Area of Interest</label>
                  <input
                    type="text"
                    required
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                    placeholder="Software Development"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Preferred Location</label>
                  <select
                    value={preferredLocation}
                    onChange={(e) => setPreferredLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Uyo">Uyo</option>
                    <option value="Ikot Ekpene">Ikot Ekpene</option>
                    <option value="Eket">Eket</option>
                    <option value="Port Harcourt">Port Harcourt</option>
                    <option value="Aba">Aba</option>
                    <option value="Calabar">Calabar</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Select Your Skills</label>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 bg-slate-50 border border-slate-200 rounded-xl">
                  {skills.map(s => {
                    const isSelected = selectedSkillIDs.includes(s.skillID);
                    return (
                      <button
                        key={s.skillID}
                        type="button"
                        onClick={() => toggleSkill(s.skillID)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${isSelected ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'}`}
                      >
                        {s.skillName}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 mt-4"
              >
                <span>{loading ? 'Creating Account...' : 'Complete Registration & Login'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setIsRegistering(false)}
                  className="text-xs text-indigo-600 font-bold hover:underline"
                >
                  Already have an account? Sign in here
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
