import React, { useState, useEffect, useRef } from 'react';
import { Head } from '@inertiajs/react';
import { Star, Smartphone, Globe, CheckCircle, Clock, AlertTriangle, MoreVertical, ThumbsUp, ThumbsDown } from 'lucide-react';
import axios from 'axios';

export default function ReviewDashboard() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number } | null>(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<{id: number, status: string} | null>(null);

  // Close dropdown 
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const openConfirmation = (id: number, status: string, e: React.MouseEvent) => {
    e.stopPropagation(); 
    setSelectedAction({ id, status });
    setIsModalOpen(true);
    setActiveDropdown(null);
  };

  const token = localStorage.getItem('token');

  const api = axios.create({
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });

  const confirmAction = async () => {
    if (!selectedAction || !apiRole) return;

    try {
      await api.patch(
        `/api/${apiRole}/feedback/${selectedAction.id}/status`,
        { status: selectedAction.status }
      );

      setReviews(prev =>
        prev.map(r =>
          r.id === selectedAction.id
            ? { ...r, status: selectedAction.status }
            : r
        )
      );
    } catch (err) {
      console.error('Failed to update feedback status', err);
    } finally {
      setIsModalOpen(false);
      setSelectedAction(null);
    }
  };

  const filteredReviews = filter === 'all' ? reviews : reviews.filter(r => r.status === filter);

  const rawRole = sessionStorage.getItem('dashboard_role');

  const apiRole =
    rawRole === 'super_admin'
      ? 'superadmin'
      : rawRole === 'admin'
      ? 'admin'
      : null;

  useEffect(() => {
    if (!apiRole) return;

    api.get(`/api/${apiRole}/feedback`)
      .then(res => setReviews(res.data))
      .catch(err => console.error('Failed to fetch feedback', err));
  }, [apiRole]);

  return (
    <div className="min-h-screen bg-gray-50 font-inter relative pb-20">
      <Head title="Review Management" />

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#3d230d]/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95">
            <div className="flex flex-col items-center text-center">
              <div className={`p-4 rounded-full mb-4 ${selectedAction?.status === 'approved' ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
                {selectedAction?.status === 'approved' ? <ThumbsUp size={32} /> : <ThumbsDown size={32} />}
              </div>
              <h3 className="text-xl font-bold text-[#3d230d]">Confirm Action</h3>
              <p className="text-gray-500 text-sm mt-2">
                Do you want to{" "}
                <span className="font-bold">
                  {selectedAction?.status === "approved" ? "approve" : "reject"}
                </span>{" "}
                this review?
              </p>
              <div className="flex gap-3 w-full mt-6">
                <button onClick={() => setIsModalOpen(false)} className="cursor-pointer flex-1 px-4 py-3 rounded-xl bg-gray-200 text-gray-600 font-bold text-sm transition hover:bg-gray-300">Cancel</button>
                <button 
                  onClick={confirmAction} 
                  className={`cursor-pointer flex-1 px-4 py-3 rounded-xl text-white font-bold text-sm shadow-lg transition
                    ${
                      selectedAction?.status === "approved"
                        ? "bg-[#8CB662] hover:bg-[#9FC97A]"
                        : "bg-red-500 hover:bg-red-400"
                    }
                  `}
                  >
                    Confirm
                  </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-3 sm:p-6 lg:p-8 w-full max-w-[1100px] mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#3d230d]">Reviews Control</h1>
            <p className="text-gray-500 text-xs sm:text-sm font-medium">Manage and moderate customer feedback across platforms.</p>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            <StatCard label="Pending" count={reviews.filter(r => r.status === 'pending').length} color="border-[#8CB662]" icon={<Clock size={16}/>} />
            <StatCard label="Total" count={reviews.length} color="border-[#3d230d]" icon={<Star size={16}/>} />
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
          {['all', 'pending', 'approved', 'rejected'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-5 py-2 rounded-full text-xs font-bold capitalize transition-all whitespace-nowrap ${filter === s ? 'bg-[#3d230d] text-white' : 'bg-white text-gray-400 border border-gray-100'}`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          
          {/* Desktop View */}
          <div className="hidden lg:block">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 font-bold text-[11px] uppercase tracking-widest text-gray-400">
                  <th className="px-8 py-5">Reviewer</th>
                  <th className="px-6 py-5">Comment</th>
                  <th className="px-6 py-5 text-center">Status</th>
                  <th className="px-8 py-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredReviews.map((review) => (
                  <tr key={review.id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="font-bold text-[#3d230d]">{review.user}</div>
                      <div className="text-[10px] text-gray-400 font-medium">
                        {new Date(review.created_at).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex text-yellow-400 mb-1">
                        {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} />)}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 max-w-xs">{review.comment}</p>
                    </td>
                    <td className="px-6 py-6 text-center"><StatusBadge status={review.status} /></td>
                    <td className="px-8 py-6 text-right relative">
                      {review.status === 'pending' && (
                        <div className="inline-block text-left">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();

                              setDropdownPos({
                                top: rect.bottom + 8,
                                left: rect.right - 160,
                              });

                              setActiveDropdown(review.id);
                            }}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-[#3d230d]"
                          >
                            <MoreVertical size={20} />
                          </button>
                          
                          {activeDropdown === review.id && (
                            <div className="absolute right-8 mt-2 w-40 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                              <button onClick={(e) => openConfirmation(review.id, 'approved', e)} className="w-full px-4 py-3 text-left text-sm font-bold text-green-600 hover:bg-green-50 flex items-center gap-2">
                                <ThumbsUp size={16} /> Approve
                              </button>
                              <button onClick={(e) => openConfirmation(review.id, 'rejected', e)} className="w-full px-4 py-3 text-left text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-gray-50">
                                <ThumbsDown size={16} /> Reject
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile/Tablet View (Cards) */}
          <div className="lg:hidden divide-y divide-gray-50">
            {filteredReviews.map((review) => (
              <div key={review.id} className="p-5 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-[#3d230d]">{review.user.charAt(0)}</div>
                    <div>
                      <h4 className="font-bold text-[#3d230d] text-sm">{review.user}</h4>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => <Star key={i} size={10} fill={i < review.rating ? "currentColor" : "none"} />)}
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    {review.status === 'pending' ? (
                      <button 
                        onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === review.id ? null : review.id); }}
                        className="p-2 bg-gray-50 rounded-lg text-gray-500"
                      >
                        <MoreVertical size={18} />
                      </button>
                    ) : (
                      <StatusBadge status={review.status} />
                    )}
                    
                    {activeDropdown === review.id && (
                      <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                        <button onClick={(e) => openConfirmation(review.id, 'approved', e)} className="w-full px-4 py-3 text-left text-xs font-bold text-green-600 active:bg-green-50">Approve</button>
                        <button onClick={(e) => openConfirmation(review.id, 'rejected', e)} className="w-full px-4 py-3 text-left text-xs font-bold text-red-600 border-t border-gray-50 active:bg-red-50">Reject</button>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100/50">"{review.comment}"</p>
                <div className="flex justify-between items-center">
                  <SourceBadge source={review.source} />
                  <span className="text-[10px] text-gray-400 font-bold uppercase">{review.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {activeDropdown !== null && dropdownPos && (
          <div
            className="fixed z-[9999] w-40 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
            style={{ top: dropdownPos.top, left: dropdownPos.left }}
          >
            <button
              onClick={(e) => openConfirmation(activeDropdown, 'approved', e)}
              className="w-full px-4 py-3 text-left text-sm font-bold text-green-600 hover:bg-green-50 flex items-center gap-2"
            >
              <ThumbsUp size={16} /> Approve
            </button>
            <button
              onClick={(e) => openConfirmation(activeDropdown, 'rejected', e)}
              className="w-full px-4 py-3 text-left text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-gray-50"
            >
              <ThumbsDown size={16} /> Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Sub-components
const StatCard = ({ label, count, color, icon }: any) => (
  <div className={`bg-white p-4 rounded-2xl shadow-sm border-l-4 ${color} min-w-[120px] flex flex-col gap-1`}>
    <div className="flex items-center gap-2 text-gray-400">{icon} <span className="text-[10px] uppercase font-bold tracking-tighter">{label}</span></div>
    <p className="text-xl font-black text-[#3d230d]">{count}</p>
  </div>
);

const SourceBadge = ({ source }: { source: string }) => (
  <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-md border ${source === 'Mobile' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
    {source === 'Mobile' ? <Smartphone size={10}/> : <Globe size={10}/>} {source}
  </span>
);

const StatusBadge = ({ status }: { status: string }) => {
  const styles: any = {
    approved: "bg-green-50 text-green-600 border-green-100",
    pending: "bg-orange-50 text-orange-600 border-orange-100",
    rejected: "bg-red-50 text-red-600 border-red-100",
  };

  return (
    <span
      className={`text-[11px] sm:text-xs uppercase font-bold px-3 py-1 rounded-full border ${styles[status]}`}
    >
      {status}
    </span>
  );
};
