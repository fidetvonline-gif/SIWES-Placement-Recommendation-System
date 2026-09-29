import React, { useEffect, useState } from 'react';
import { Organization } from '../types';
import { X, Building2, MapPin, Phone, Mail, CheckCircle, Briefcase, Users, Award, BookOpen } from 'lucide-react';

interface OrganizationDetailsModalProps {
  organizationID: string | null;
  onClose: () => void;
}

export function OrganizationDetailsModal({ organizationID, onClose }: OrganizationDetailsModalProps) {
  const [org, setOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!organizationID) return;
    setLoading(true);
    fetch(`/api/organizations/${organizationID}`)
      .then(res => res.json())
      .then(data => {
        setOrg(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [organizationID]);

  if (!organizationID) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Organization Profile</span>
            <h3 className="text-xl font-bold mt-0.5">{org ? org.organizationName : 'Loading...'}</h3>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {loading ? (
            <div className="py-20 text-center">
              <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-xs text-slate-500">Loading organization details...</p>
            </div>
          ) : org ? (
            <>
              {/* Overview */}
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600 mb-2">
                  <span className="text-indigo-600 font-bold">{org.industry}</span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{org.address}</span>
                  </span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {org.description}
                </p>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Phone Number</span>
                    <span className="text-xs font-semibold text-slate-900">{org.phone}</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</span>
                    <span className="text-xs font-semibold text-slate-900">{org.email}</span>
                  </div>
                </div>
              </div>

              {/* Required Skills */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">Required Skills & Competencies</h4>
                <div className="flex flex-wrap gap-1.5">
                  {org.requiredSkills && org.requiredSkills.length > 0 ? (
                    org.requiredSkills.map(sk => (
                      <span key={sk.skillID} className="px-3 py-1.5 bg-indigo-50 text-indigo-800 text-xs font-semibold rounded-lg">
                        {sk.skillName}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">No specific technical skills listed.</span>
                  )}
                </div>
              </div>

              {/* Available Placements */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Active SIWES Placement Positions</h4>
                <div className="space-y-3">
                  {org.placements && org.placements.length > 0 ? (
                    org.placements.map(pl => (
                      <div key={pl.placementID} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-indigo-600" />
                            <span>{pl.position}</span>
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Available Slots: <span className="font-semibold text-slate-800">{pl.availableSlots} student(s)</span>
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-full">
                          {pl.status}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic">No active placement slots currently posted for this organization.</p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <p className="text-center text-xs text-red-600 py-10">Organization not found.</p>
          )}
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition-all"
          >
            Close Details
          </button>
        </div>

      </div>
    </div>
  );
}
