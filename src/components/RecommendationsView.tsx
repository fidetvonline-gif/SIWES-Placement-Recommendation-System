import React, { useEffect, useState } from 'react';
import { User, Recommendation, Organization } from '../types';
import { generateRecommendations, getRecommendationHistory } from '../services/api';
import { Sparkles, Award, MapPin, Building2, CheckCircle2, ChevronRight, Phone, Mail, FileText, Filter, RefreshCw } from 'lucide-react';

interface RecommendationsViewProps {
  user: User;
  onSelectOrganization: (orgId: string) => void;
}

export function RecommendationsView({ user, onSelectOrganization }: RecommendationsViewProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState('all');

  const student = user as any;
  const fetchRecs = async (forceRun = false) => {
    setLoading(true);
    setError(null);
    try {
      if (forceRun) {
        const results = await generateRecommendations(student.studentID);
        setRecommendations(results);
      } else {
        const history = await getRecommendationHistory(student.studentID);
        if (history && history.length > 0) {
          setRecommendations(history);
        } else {
          const results = await generateRecommendations(student.studentID);
          setRecommendations(results);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate recommendations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecs(false);
  }, [student.studentID]);

  const filteredRecs = recommendations.filter(rec => {
    if (locationFilter === 'all') return true;
    return rec.location.toLowerCase() === locationFilter.toLowerCase();
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Weighted Recommendation Engine (Academic 30% · Skills 30% · Interest 20% · Location 20%)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Your Ranked Placement Recommendations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Matched against active SIWES organization profiles and available placement slots for {user.fullName}.
          </p>
        </div>
        <button
          onClick={() => fetchRecs(true)}
          disabled={loading}
          className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md transition-all flex items-center gap-2 text-xs self-start md:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Calculating Scores...' : 'Recalculate Recommendations'}</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3 mb-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">
          <Filter className="w-3.5 h-3.5" />
          <span>Filter Location:</span>
        </div>
        <div className="flex items-center gap-1.5">
          {['all', 'Uyo', 'Ikot Ekpene', 'Eket', 'Port Harcourt'].map(loc => (
            <button
              key={loc}
              onClick={() => setLocationFilter(loc)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all capitalize whitespace-nowrap ${locationFilter === loc ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {loc}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 mb-6 font-medium">
          {error}
        </div>
      )}

      {loading && recommendations.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm font-semibold text-slate-700">Evaluating student profile compatibility...</p>
        </div>
      ) : filteredRecs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No organizations found</h3>
          <p className="text-xs text-slate-500 mt-1">Try changing your location filter or updating your profile skills and interest.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredRecs.map((rec, index) => {
            const isTopMatch = index === 0 && rec.totalScore >= 75;
            return (
              <div
                key={rec.recommendationID}
                className={`bg-white rounded-3xl border transition-all p-6 sm:p-8 hover:shadow-lg ${isTopMatch ? 'border-indigo-500 ring-2 ring-indigo-500/10' : 'border-slate-200 shadow-sm'}`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-lg shrink-0 shadow-inner">
                      #{index + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{rec.industry}</span>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{rec.location}</span>
                        </span>
                        {isTopMatch && (
                          <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-bold rounded-md">
                            Top Recommendation
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mt-1">
                        {rec.organizationName}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2 max-w-2xl">
                        {rec.description}
                      </p>
                    </div>
                  </div>

                  {/* Score Badge */}
                  <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 shrink-0">
                    <div className="text-right">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Compatibility Score</span>
                      <span className="text-2xl font-extrabold text-indigo-600 tracking-tight">{rec.totalScore}%</span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-indigo-200">
                      {rec.totalScore}%
                    </div>
                  </div>
                </div>

                {/* Score Breakdown (Academic 30%, Skill 30%, Interest 20%, Location 20%) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-slate-100">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-500">Academic (30%)</span>
                      <span className="text-slate-900 font-bold">{rec.academicScore}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${rec.academicScore}%` }}></div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl">
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-500">Skill Match (30%)</span>
                      <span className="text-slate-900 font-bold">{rec.skillScore}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${rec.skillScore}%` }}></div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl">
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-500">Interest (20%)</span>
                      <span className="text-slate-900 font-bold">{rec.interestScore}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${rec.interestScore}%` }}></div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl">
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-500">Location (20%)</span>
                      <span className="text-slate-900 font-bold">{rec.locationScore}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${rec.locationScore}%` }}></div>
                    </div>
                  </div>
                </div>

                {/* Footer details & action */}
                <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{rec.phone}</span>
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{rec.email}</span>
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-indigo-600 font-bold">
                      {rec.placements?.length || 0} Active Placement Position(s)
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectOrganization(rec.organizationID)}
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 self-start sm:self-auto shadow-sm"
                  >
                    <span>View Organization & Placements</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
