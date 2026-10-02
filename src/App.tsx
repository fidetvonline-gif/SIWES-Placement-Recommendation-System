import React, { useState, useEffect } from 'react';
import { User, Department, Skill, Organization } from './types';
import { getDepartments, getSkills, getOrganizations } from './services/api';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { LoginModal } from './components/LoginModal';
import { StudentDashboard } from './components/StudentDashboard';
import { RecommendationsView } from './components/RecommendationsView';
import { OrganizationDetailsModal } from './components/OrganizationDetailsModal';
import { AdminDashboard } from './components/AdminDashboard';
import { Building2, MapPin, Phone, Mail, Search, Sparkles, ChevronRight } from 'lucide-react';
import { supabase, isSupabaseConfigured } from './lib/supabase';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('siwes_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      return;
    }

    // Check active session on mount if Supabase is configured
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const saved = localStorage.getItem('siwes_current_user');
        if (saved) {
          try {
            setCurrentUser(JSON.parse(saved));
          } catch {}
        }
      }
    }).catch(err => {
      console.warn('Supabase getSession notice:', err);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session && isSupabaseConfigured) {
        // Only clear if Supabase is genuinely configured and was signed out
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const [activeTab, setActiveTab] = useState<string>(() => {
    const savedUser = localStorage.getItem('siwes_current_user');
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        return u.role === 'admin' ? 'admin-dashboard' : 'student-dashboard';
      } catch {}
    }
    return 'home';
  });
  
  useEffect(() => {
    if (currentUser) {
      setActiveTab(currentUser.role === 'admin' ? 'admin-dashboard' : 'student-dashboard');
    } else {
      setActiveTab('home');
    }
  }, [currentUser]);

  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginRole, setLoginRole] = useState<'student' | 'admin'>('student');
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);

  const [departments, setDepartments] = useState<Department[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');

  const loadReferenceData = async () => {
    try {
      const [deptData, skillData, orgData] = await Promise.all([
        getDepartments(),
        getSkills(),
        getOrganizations()
      ]);
      setDepartments(deptData);
      setSkills(skillData);
      setOrganizations(orgData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadReferenceData();
  }, []);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('siwes_current_user', JSON.stringify(user));
    if (user.role === 'admin') {
      setActiveTab('admin-dashboard');
    } else {
      setActiveTab('student-dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('siwes_current_user');
    setActiveTab('home');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('siwes_current_user', JSON.stringify(updatedUser));
  };

  const filteredOrgs = organizations.filter(org => {
    const matchesQuery = org.organizationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         org.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         org.industry.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = industryFilter === 'all' || org.industry.toLowerCase().includes(industryFilter.toLowerCase());
    return matchesQuery && matchesIndustry;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenLogin={(role) => {
          setLoginRole(role);
          setLoginModalOpen(true);
        }}
        onLogout={handleLogout}
      />

      <main className="flex-1">
        {activeTab === 'home' && (
          <LandingPage
            currentUser={currentUser}
            onOpenLogin={(role) => {
              setLoginRole(role);
              setLoginModalOpen(true);
            }}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'student-dashboard' && currentUser?.role === 'student' && (
          <StudentDashboard
            user={currentUser}
            departments={departments}
            skills={skills}
            onUpdateUser={handleUpdateUser}
            onNavigateRecommendations={() => setActiveTab('recommendations')}
          />
        )}

        {activeTab === 'recommendations' && currentUser?.role === 'student' && (
          <RecommendationsView
            user={currentUser}
            onSelectOrganization={(orgId) => setSelectedOrgId(orgId)}
          />
        )}

        {activeTab === 'admin-dashboard' && currentUser?.role === 'admin' && (
          <AdminDashboard
            departments={departments}
            skills={skills}
            onRefreshData={loadReferenceData}
          />
        )}

        {activeTab === 'organizations' && (
          <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
            <div className="mb-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">Partner Network</span>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  Industrial Attachment Organizations
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Browse verified organizations and available SIWES placement opportunities.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative w-full sm:w-64">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search name, location..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOrgs.map(org => (
                <div key={org.organizationID} className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider truncate">{org.industry}</span>
                      <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{org.location}</span>
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{org.organizationName}</h3>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">{org.description}</p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200">
                      {org.placements?.length || 0} Placement(s) Active
                    </span>
                    <button
                      onClick={() => setSelectedOrgId(org.organizationID)}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all flex items-center gap-1"
                    >
                      <span>View Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        defaultRole={loginRole}
        onLoginSuccess={handleLoginSuccess}
        departments={departments}
        skills={skills}
      />

      <OrganizationDetailsModal
        organizationID={selectedOrgId}
        onClose={() => setSelectedOrgId(null)}
      />
    </div>
  );
}
