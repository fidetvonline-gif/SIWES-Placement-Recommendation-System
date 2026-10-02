import React from 'react';
import { GraduationCap, Shield, Sparkles, Building2, BookOpen, Compass, ArrowRight, CheckCircle2, Award, Users, Smartphone } from 'lucide-react';
import { User } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface LandingPageProps {
  currentUser: User | null;
  onOpenLogin: (role: 'student' | 'admin') => void;
  onNavigateTab: (tab: string) => void;
}

export function LandingPage({ currentUser, onOpenLogin, onNavigateTab }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32 bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-900 text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              SIWES Placement Recommendation System
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              An intelligent web-based recommendation system designed to seamlessly match students with verified industrial attachment organizations based on academic department, skills, interests, and location.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              {currentUser ? (
                <button
                  onClick={() => onNavigateTab(currentUser.role === 'admin' ? 'admin-dashboard' : 'student-dashboard')}
                  className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <span>Open Your Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <>
                  <button
                    onClick={() => onOpenLogin('student')}
                    className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Student Portal Login</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onOpenLogin('admin')}
                    className="w-full sm:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-2xl border border-slate-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Shield className="w-4 h-4 text-indigo-400" />
                    <span>Administrator Access</span>
                  </button>
                </>
              )}
              
              <PWAInstallButton variant="hero" />
            </div>

            <div className="mt-12 pt-8 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">30%</p>
                <p className="text-xs text-slate-400 mt-1">Academic Department Match</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">30%</p>
                <p className="text-xs text-slate-400 mt-1">Skill Match Weight</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">20%</p>
                <p className="text-xs text-slate-400 mt-1">Interest Correspondence</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">20%</p>
                <p className="text-xs text-slate-400 mt-1">Location Preference</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      py-20 lg:py-28
      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest block mb-2">Core Methodology</span>
          <h2 className="text-3xl font-extrabold text-slate-900">
            How the Weighted Compatibility Engine Works
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Eliminating manual search friction and placement mismatch through rigorous multi-criteria evaluation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg mb-6">
              01
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Student Profile Setup</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Students complete their academic programme, department, current level, technical skills, area of interest, and preferred location.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg mb-6">
              02
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Multi-Criteria Scoring</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              The algorithm evaluates department relevance (30%), skill overlap (30%), interest correlation (20%), and location match (20%) to compute total compatibility.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg mb-6">
              03
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Ranked Recommendations</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Organizations and placement slots are automatically ranked in descending order, displaying full contact info and active slot availability.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <p className="text-sm font-bold">SIWES Placement Recommendation System</p>
          </div>
          <div className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} All Rights Reserved
          </div>
        </div>
      </footer>

    </div>
  );
}
