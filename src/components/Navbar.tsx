import React from 'react';
import { GraduationCap, Shield, User as UserIcon, LogOut, Compass, Building2, BookOpen } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  currentUser: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenLogin: (role: 'student' | 'admin') => void;
  onLogout: () => void;
}

export function Navbar({ currentUser, activeTab, setActiveTab, onOpenLogin, onLogout }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-900 block leading-tight">
              SIWES RecSys
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <button 
            onClick={() => setActiveTab('home')} 
            className={`transition-colors hover:text-indigo-600 ${activeTab === 'home' ? 'text-indigo-600 font-semibold' : ''}`}
          >
            Overview
          </button>
          
          {currentUser?.role === 'student' && (
            <>
              <button 
                onClick={() => setActiveTab('student-dashboard')} 
                className={`transition-colors hover:text-indigo-600 ${activeTab === 'student-dashboard' ? 'text-indigo-600 font-semibold' : ''}`}
              >
                My Profile
              </button>
              <button 
                onClick={() => setActiveTab('recommendations')} 
                className={`transition-colors hover:text-indigo-600 ${activeTab === 'recommendations' ? 'text-indigo-600 font-semibold' : ''}`}
              >
                Recommendations
              </button>
            </>
          )}

          {currentUser?.role === 'admin' && (
            <button 
              onClick={() => setActiveTab('admin-dashboard')} 
              className={`transition-colors hover:text-indigo-600 ${activeTab === 'admin-dashboard' ? 'text-indigo-600 font-semibold' : ''}`}
            >
              Admin Dashboard
            </button>
          )}

          <button 
            onClick={() => setActiveTab('organizations')} 
            className={`transition-colors hover:text-indigo-600 ${activeTab === 'organizations' ? 'text-indigo-600 font-semibold' : ''}`}
          >
            Directory
          </button>
        </nav>

        {/* Zone 3: Primary Actions / User Account */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-3 bg-slate-100/80 px-3.5 py-1.5 rounded-full border border-slate-200">
              <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                {currentUser.fullName ? currentUser.fullName.charAt(0) : 'U'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-900 leading-none truncate max-w-[120px]">
                  {currentUser.fullName}
                </p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mt-0.5">
                  {currentUser.role}
                </p>
              </div>
              <button
                onClick={onLogout}
                title="Sign out"
                className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-white rounded-full transition-colors ml-1"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenLogin('student')}
                className="px-4.5 py-2 text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-all whitespace-nowrap"
              >
                Student Sign In
              </button>
              <button
                onClick={() => onOpenLogin('admin')}
                className="px-4.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-200 transition-all whitespace-nowrap flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Portal</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
