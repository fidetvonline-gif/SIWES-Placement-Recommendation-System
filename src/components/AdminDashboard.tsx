import React, { useEffect, useState } from 'react';
import { Department, Skill, Organization, Placement, Student } from '../types';
import { getAdminStats, getDepartments, getSkills, getOrganizations, getPlacements, createOrganization, createPlacement, addDepartment, addSkill, updatePlacementStatus } from '../services/api';
import { Shield, Users, Building2, Briefcase, BookOpen, Plus, CheckCircle, TrendingUp, Layers, Sparkles } from 'lucide-react';

interface AdminDashboardProps {
  departments: Department[];
  skills: Skill[];
  onRefreshData: () => void;
}

export function AdminDashboard({ departments, skills, onRefreshData }: AdminDashboardProps) {
  const [stats, setStats] = useState<any>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'organizations' | 'placements' | 'reference'>('overview');
  
  // Form states
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgIndustry, setNewOrgIndustry] = useState('');
  const [newOrgAddress, setNewOrgAddress] = useState('');
  const [newOrgLocation, setNewOrgLocation] = useState('Uyo');
  const [newOrgEmail, setNewOrgEmail] = useState('');
  const [newOrgPhone, setNewOrgPhone] = useState('');
  const [newOrgDesc, setNewOrgDesc] = useState('');
  const [newOrgDept, setNewOrgDept] = useState(departments[0]?.departmentID || 'dept-1');

  const [newPlaceOrgID, setNewPlaceOrgID] = useState('');
  const [newPlacePosition, setNewPlacePosition] = useState('');
  const [newPlaceSlots, setNewPlaceSlots] = useState(2);
  const [newPlaceDept, setNewPlaceDept] = useState(departments[0]?.departmentID || 'dept-1');

  const [newDeptName, setNewDeptName] = useState('');
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillDesc, setNewSkillDesc] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const loadAdminData = async () => {
    try {
      const s = await getAdminStats();
      setStats(s);
      const orgs = await getOrganizations();
      setOrganizations(orgs);
      if (orgs.length > 0 && !newPlaceOrgID) {
        setNewPlaceOrgID(orgs[0].organizationID);
      }
      const places = await getPlacements();
      setPlacements(places);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createOrganization({
        organizationName: newOrgName,
        industry: newOrgIndustry,
        address: newOrgAddress,
        location: newOrgLocation,
        email: newOrgEmail,
        phone: newOrgPhone,
        description: newOrgDesc,
        relevantDepartmentID: newOrgDept,
        requiredSkillIDs: ['skill-1', 'skill-3']
      });
      setSuccessMsg('Organization created successfully!');
      setNewOrgName('');
      setNewOrgIndustry('');
      setNewOrgAddress('');
      setNewOrgEmail('');
      setNewOrgPhone('');
      setNewOrgDesc('');
      loadAdminData();
      onRefreshData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCreatePlacement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPlacement({
        organizationID: newPlaceOrgID,
        position: newPlacePosition,
        departmentID: newPlaceDept,
        availableSlots: Number(newPlaceSlots),
        status: 'active'
      });
      setSuccessMsg('Placement opportunity created successfully!');
      setNewPlacePosition('');
      loadAdminData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAddDept = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDepartment(newDeptName);
      setSuccessMsg('Department added successfully!');
      setNewDeptName('');
      loadAdminData();
      onRefreshData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAddSk = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addSkill(newSkillName, newSkillDesc);
      setSuccessMsg('Skill added successfully!');
      setNewSkillName('');
      setNewSkillDesc('');
      loadAdminData();
      onRefreshData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const togglePlacementStatus = async (placementID: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'inactive' : 'active';
    await updatePlacementStatus(placementID, nextStatus);
    loadAdminData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/30 rounded-full text-xs font-semibold text-indigo-300 mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Administrator Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">SIWES System Management</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage departments, skills, partner organizations, and placement opportunities.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-200 pb-2 overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview & Stats' },
          { id: 'organizations', label: 'Manage Organizations' },
          { id: 'placements', label: 'Manage Placements' },
          { id: 'reference', label: 'Departments & Skills' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && stats && (
        <div className="space-y-8 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Registered Students</span>
              <span className="text-3xl font-extrabold text-slate-900 mt-1 block">{stats.totalStudents}</span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Partner Organizations</span>
              <span className="text-3xl font-extrabold text-slate-900 mt-1 block">{stats.totalOrganizations}</span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Active Placements</span>
              <span className="text-3xl font-extrabold text-slate-900 mt-1 block">{stats.totalPlacements}</span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Recommendations Run</span>
              <span className="text-3xl font-extrabold text-slate-900 mt-1 block">{stats.totalRecommendationsRun}</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'organizations' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
          {/* Create Form */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm lg:col-span-1">
            <h3 className="text-base font-bold text-slate-900 mb-4">Register New Organization</h3>
            <form onSubmit={handleCreateOrg} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Organization Name</label>
                <input
                  type="text"
                  required
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                  placeholder="e.g. Google West Africa"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Industry / Sector</label>
                <input
                  type="text"
                  required
                  value={newOrgIndustry}
                  onChange={(e) => setNewOrgIndustry(e.target.value)}
                  placeholder="e.g. Software Engineering"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Address</label>
                <input
                  type="text"
                  required
                  value={newOrgAddress}
                  onChange={(e) => setNewOrgAddress(e.target.value)}
                  placeholder="e.g. 5 Marina Street"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Location City</label>
                <select
                  value={newOrgLocation}
                  onChange={(e) => setNewOrgLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                >
                  <option value="Uyo">Uyo</option>
                  <option value="Ikot Ekpene">Ikot Ekpene</option>
                  <option value="Eket">Eket</option>
                  <option value="Port Harcourt">Port Harcourt</option>
                  <option value="Aba">Aba</option>
                  <option value="Calabar">Calabar</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={newOrgEmail}
                    onChange={(e) => setNewOrgEmail(e.target.value)}
                    placeholder="hr@company.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    required
                    value={newOrgPhone}
                    onChange={(e) => setNewOrgPhone(e.target.value)}
                    placeholder="+234..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Relevant Department</label>
                <select
                  value={newOrgDept}
                  onChange={(e) => setNewOrgDept(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                >
                  {departments.map(d => (
                    <option key={d.departmentID} value={d.departmentID}>{d.departmentName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={newOrgDesc}
                  onChange={(e) => setNewOrgDesc(e.target.value)}
                  placeholder="Brief organization description..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Save Organization Profile</span>
              </button>
            </form>
          </div>

          {/* List */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm lg:col-span-2">
            <h3 className="text-base font-bold text-slate-900 mb-4">Existing Partner Organizations ({organizations.length})</h3>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {organizations.map(org => (
                <div key={org.organizationID} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-indigo-600">{org.industry}</span>
                    <h4 className="text-base font-bold text-slate-900">{org.organizationName}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{org.address} · <span className="font-semibold text-slate-700">{org.location}</span></p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-semibold text-slate-700 bg-white px-3 py-1 rounded-lg border border-slate-200">
                      {org.placements?.length || 0} Placement(s)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'placements' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
          {/* Create Placement */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm lg:col-span-1">
            <h3 className="text-base font-bold text-slate-900 mb-4">Create Placement Opportunity</h3>
            <form onSubmit={handleCreatePlacement} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Organization</label>
                <select
                  value={newPlaceOrgID}
                  onChange={(e) => setNewPlaceOrgID(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                >
                  {organizations.map(org => (
                    <option key={org.organizationID} value={org.organizationID}>{org.organizationName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Position Title</label>
                <input
                  type="text"
                  required
                  value={newPlacePosition}
                  onChange={(e) => setNewPlacePosition(e.target.value)}
                  placeholder="e.g. Software Developer Intern"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                <select
                  value={newPlaceDept}
                  onChange={(e) => setNewPlaceDept(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                >
                  {departments.map(d => (
                    <option key={d.departmentID} value={d.departmentID}>{d.departmentName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Available Slots</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  required
                  value={newPlaceSlots}
                  onChange={(e) => setNewPlaceSlots(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Publish Placement Position</span>
              </button>
            </form>
          </div>

          {/* List Placements */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm lg:col-span-2">
            <h3 className="text-base font-bold text-slate-900 mb-4">All Placement Positions ({placements.length})</h3>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {placements.map(pl => (
                <div key={pl.placementID} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-indigo-600">{pl.organizationName}</span>
                    <h4 className="text-base font-bold text-slate-900">{pl.position}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Location: {pl.location} · Slots: <span className="font-semibold text-slate-800">{pl.availableSlots}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 text-[11px] font-bold rounded-full ${pl.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                      {pl.status}
                    </span>
                    <button
                      onClick={() => togglePlacementStatus(pl.placementID, pl.status)}
                      className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl transition-all"
                    >
                      Toggle Status
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'reference' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
          {/* Departments */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4">Academic Departments ({departments.length})</h3>
            <form onSubmit={handleAddDept} className="flex gap-2 mb-4">
              <input
                type="text"
                required
                value={newDeptName}
                onChange={(e) => setNewDeptName(e.target.value)}
                placeholder="New Department Name"
                className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
              <button type="submit" className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl whitespace-nowrap">
                Add Dept
              </button>
            </form>
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {departments.map(d => (
                <div key={d.departmentID} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs font-semibold text-slate-800">
                  {d.departmentName}
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4">Reusable Skills ({skills.length})</h3>
            <form onSubmit={handleAddSk} className="space-y-3 mb-4">
              <input
                type="text"
                required
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                placeholder="Skill Name (e.g. Flutter)"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
              <input
                type="text"
                value={newSkillDesc}
                onChange={(e) => setNewSkillDesc(e.target.value)}
                placeholder="Skill Description"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
              <button type="submit" className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl">
                Add Skill Record
              </button>
            </form>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {skills.map(s => (
                <div key={s.skillID} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{s.skillName}</span>
                  <span className="text-[11px] text-slate-500">{s.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
