import React, { useState } from 'react';
import { User, Department, Skill } from '../types';
import { updateStudentProfile } from '../services/api';
import { UserCheck, MapPin, BookOpen, Award, CheckCircle, Sparkles, Edit3, Save, Compass } from 'lucide-react';

interface StudentDashboardProps {
  user: User;
  departments: Department[];
  skills: Skill[];
  onUpdateUser: (updatedUser: User) => void;
  onNavigateRecommendations: () => void;
}

export function StudentDashboard({ user, departments, skills, onUpdateUser, onNavigateRecommendations }: StudentDashboardProps) {
  const student = user as any;
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(student.fullName || '');
  const [departmentID, setDepartmentID] = useState(student.departmentID || departments[0]?.departmentID);
  const [level, setLevel] = useState(student.level || 'ND 2');
  const [interest, setInterest] = useState(student.interest || 'Software Development');
  const [preferredLocation, setPreferredLocation] = useState(student.preferredLocation || 'Uyo');
  const [selectedSkillIDs, setSelectedSkillIDs] = useState<string[]>(student.skillIDs || []);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const studentDept = departments.find(d => d.departmentID === student.departmentID)?.departmentName || 'Computer Science';
  const studentSkills = skills.filter(s => student.skillIDs?.includes(s.skillID));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const data = await updateStudentProfile(student.studentID, {
        fullName,
        departmentID,
        level,
        interest,
        preferredLocation,
        skillIDs: selectedSkillIDs
      });
      if (data.success) {
        onUpdateUser(data.user);
        setIsEditing(false);
        setMessage('Profile updated successfully!');
      }
    } catch (err: any) {
      setMessage(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
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
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-3xl p-8 shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-10 translate-y-10">
          <Sparkles className="w-64 h-64 text-white" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/30 backdrop-blur-md rounded-full text-xs font-semibold text-indigo-200 mb-3">
              <span>SIWES Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Welcome back, {student.fullName}!
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-xl">
              Registration No: <span className="font-mono font-semibold text-white">{student.regNo}</span> · {studentDept} ({level})
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateRecommendations}
              className="px-6 py-3.5 bg-white text-indigo-900 hover:bg-indigo-50 font-bold rounded-2xl shadow-lg transition-all flex items-center gap-2 text-sm whitespace-nowrap"
            >
              <Compass className="w-4 h-4 text-indigo-600" />
              <span>View Recommendations</span>
            </button>
          </div>
        </div>
      </div>

      {message && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {/* Profile Details Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Student Placement Profile</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Attributes used by the recommendation engine (Academic 30%, Skills 30%, Interests 20%, Location 20%).
            </p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Cancel Editing' : 'Edit Profile'}</span>
          </button>
        </div>

        {!isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Department</span>
              <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>{studentDept}</span>
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Academic Level</span>
              <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-indigo-600" />
                <span>{student.level}</span>
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Area of Interest</span>
              <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>{student.interest}</span>
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Preferred Location</span>
              <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-600" />
                <span>{student.preferredLocation}</span>
              </p>
            </div>

            <div className="md:col-span-2 lg:col-span-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Registered Skills</span>
              <div className="flex flex-wrap gap-2">
                {studentSkills.length > 0 ? (
                  studentSkills.map(sk => (
                    <span key={sk.skillID} className="px-3 py-1 bg-white border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg shadow-xs">
                      {sk.skillName}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">No skills selected. Click Edit Profile to add skills.</span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Department</label>
                <select
                  value={departmentID}
                  onChange={(e) => setDepartmentID(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500"
                >
                  {departments.map(d => (
                    <option key={d.departmentID} value={d.departmentID}>{d.departmentName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Academic Level</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="ND 1">ND 1</option>
                  <option value="ND 2">ND 2</option>
                  <option value="HND 1">HND 1</option>
                  <option value="HND 2">HND 2</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Area of Interest</label>
                <input
                  type="text"
                  required
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Preferred Location</label>
                <select
                  value={preferredLocation}
                  onChange={(e) => setPreferredLocation(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500"
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
              <label className="block text-xs font-bold text-slate-700 mb-2 uppercase">Select Your Skills (Click to toggle)</label>
              <div className="flex flex-wrap gap-2 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                {skills.map(s => {
                  const isSelected = selectedSkillIDs.includes(s.skillID);
                  return (
                    <button
                      key={s.skillID}
                      type="button"
                      onClick={() => toggleSkill(s.skillID)}
                      className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all ${isSelected ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'}`}
                    >
                      {s.skillName}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        )}
      </div>

    </div>
  );
}
