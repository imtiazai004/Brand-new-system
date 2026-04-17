import React, { useState, useEffect } from 'react';
import { 
  Baby, 
  TrendingUp, 
  Receipt, 
  Calendar, 
  Bell, 
  LogOut, 
  ChevronRight,
  Download,
  CreditCard,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../auth/auth.hooks';
import { guardianService } from '../guardian.service';
import { Student } from '../../students/student.types';
import { ExamResult, FeeRecord, Announcement } from '../guardian.types';
import { jsPDF } from 'jspdf';

export default function GuardianDashboard() {
  const { profile, schoolId, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'academic' | 'billing' | 'meetings'>('overview');
  const [child, setChild] = useState<Student | null>(null);
  const [results, setResults] = useState<ExamResult[]>([]);
  const [fees, setFees] = useState<FeeRecord[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!schoolId || !profile?.studentId) return;

    const unsubChild = guardianService.subscribeToChildData(schoolId, profile.studentId, (data) => {
      setChild(data);
      setLoading(false);
    });

    const unsubResults = guardianService.subscribeToExamResults(schoolId, profile.studentId, (data) => {
      setResults(data);
    });

    const unsubFees = guardianService.subscribeToFees(schoolId, profile.studentId, (data) => {
      setFees(data);
    });

    const unsubAnnouncements = guardianService.subscribeToAnnouncements(schoolId, (data) => {
      setAnnouncements(data);
    });

    return () => {
      unsubChild();
      unsubResults();
      unsubFees();
      unsubAnnouncements();
    };
  }, [schoolId, profile?.studentId]);

  const downloadReceipt = (fee: FeeRecord) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text('Nexus Academy Payment Receipt', 20, 20);
    doc.setFontSize(14);
    doc.text(`Student: ${child?.name}`, 20, 40);
    doc.text(`Student ID: ${fee.studentId}`, 20, 50);
    doc.text(`Amount: $${fee.amount}`, 20, 60);
    doc.text(`Status: ${fee.status}`, 20, 70);
    doc.text(`Description: ${fee.description || 'School Fees'}`, 20, 80);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 90);
    doc.save(`Receipt-${fee.id}.pdf`);
  };

  const [meetingForm, setMeetingForm] = useState({
    teacherId: '',
    purpose: '',
    preferredTime: ''
  });

  const handleMeetingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolId || !profile?.uid) return;

    try {
      await guardianService.requestMeeting(schoolId, {
        guardianId: profile.uid,
        teacherId: meetingForm.teacherId,
        purpose: meetingForm.purpose,
        preferredTime: meetingForm.preferredTime,
        schoolId
      });
      alert('Meeting request sent successfully!');
      setMeetingForm({ teacherId: '', purpose: '', preferredTime: '' });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFDFC] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFC] text-slate-900 font-sans">
      {/* Header */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-xl border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white">
              <Sparkles className="size-6" />
            </div>
            <span className="text-xl font-bold tracking-tight">Guardian Hub</span>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-gray-400 hover:text-indigo-600 transition-colors">
              <Bell className="size-6" />
              <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-gray-100"></div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-bold">{profile?.displayName}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Parent Profile</p>
              </div>
              <button 
                onClick={() => logout()}
                className="size-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
              >
                <LogOut className="size-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Sidebar - Profile Summary */}
          <div className="lg:col-span-4 space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-indigo-100/20 border border-gray-100 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8">
                <Baby className="size-20 text-indigo-50/50 -rotate-12" />
              </div>
              
              <div className="relative z-10">
                <div className="size-20 rounded-3xl bg-indigo-50 flex items-center justify-center mb-6">
                  <span className="text-3xl">🧑‍🎓</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 leading-tight">
                  {child?.name}
                </h2>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold uppercase tracking-widest">
                    Grade {child?.grade}
                  </span>
                  <span className="size-1 bg-gray-300 rounded-full"></span>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    ID: {child?.studentId}
                  </span>
                </div>

                <div className="mt-10 p-6 bg-slate-50 rounded-[2rem] border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Attendance</span>
                    <span className="text-sm font-bold text-indigo-600">88%</span>
                  </div>
                  <div className="h-3 w-full bg-indigo-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '88%' }}
                      className="h-full bg-indigo-600 rounded-full"
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-3 font-medium">
                    22 days present • 3 days absent
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Quick Links */}
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`p-6 rounded-[2rem] border transition-all flex flex-col items-center gap-3 ${activeTab === 'overview' ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200' : 'bg-white border-gray-100 hover:border-indigo-200'}`}
              >
                <div className={`size-10 rounded-xl flex items-center justify-center ${activeTab === 'overview' ? 'bg-white/20' : 'bg-indigo-50 text-indigo-600'}`}>
                  <Sparkles className="size-5" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest">Focus</span>
              </button>
              <button 
                onClick={() => setActiveTab('academic')}
                className={`p-6 rounded-[2rem] border transition-all flex flex-col items-center gap-3 ${activeTab === 'academic' ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200' : 'bg-white border-gray-100 hover:border-indigo-200'}`}
              >
                <div className={`size-10 rounded-xl flex items-center justify-center ${activeTab === 'academic' ? 'bg-white/20' : 'bg-indigo-50 text-indigo-600'}`}>
                  <TrendingUp className="size-5" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest">Scores</span>
              </button>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* Tabs Navigation */}
            <div className="flex items-center gap-2 bg-indigo-50/50 p-2 rounded-[2rem] border border-indigo-100/50 self-start">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`px-8 py-3 rounded-[1.5rem] text-sm font-bold transition-all ${activeTab === 'overview' ? 'bg-white text-indigo-600 shadow-sm' : 'text-indigo-400 hover:text-indigo-600'}`}
              >
                Overview
              </button>
              <button 
                onClick={() => setActiveTab('academic')}
                className={`px-8 py-3 rounded-[1.5rem] text-sm font-bold transition-all ${activeTab === 'academic' ? 'bg-white text-indigo-600 shadow-sm' : 'text-indigo-400 hover:text-indigo-600'}`}
              >
                Academics
              </button>
              <button 
                onClick={() => setActiveTab('billing')}
                className={`px-8 py-3 rounded-[1.5rem] text-sm font-bold transition-all ${activeTab === 'billing' ? 'bg-white text-indigo-600 shadow-sm' : 'text-indigo-400 hover:text-indigo-600'}`}
              >
                Billing
              </button>
              <button 
                onClick={() => setActiveTab('meetings')}
                className={`px-8 py-3 rounded-[1.5rem] text-sm font-bold transition-all ${activeTab === 'meetings' ? 'bg-white text-indigo-600 shadow-sm' : 'text-indigo-400 hover:text-indigo-600'}`}
              >
                Meetings
              </button>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div 
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-xl font-bold flex items-center gap-3">
                        <Bell className="size-6 text-indigo-600" />
                        Announcement Board
                      </h3>
                      <button className="text-xs font-bold text-indigo-600 uppercase tracking-widest hover:underline">View All</button>
                    </div>
                    
                    <div className="space-y-6">
                      {announcements.length > 0 ? announcements.map(ann => (
                        <div key={ann.id} className="p-6 bg-slate-50 rounded-[2rem] border border-gray-100 flex gap-6 group hover:border-indigo-200 transition-colors">
                          <div className="size-12 rounded-2xl bg-white flex items-center justify-center text-xl shadow-sm">
                            📢
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{ann.title}</h4>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                              {ann.content}
                            </p>
                            <div className="flex items-center gap-4 mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                              <span>{ann.author}</span>
                              <span className="size-1 bg-gray-300 rounded-full"></span>
                              <span>{ann.date}</span>
                            </div>
                          </div>
                        </div>
                      )) : (
                        <div className="text-center py-10">
                          <p className="text-gray-400 italic">No new announcements at this time.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'academic' && (
                <motion.div 
                  key="academic"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100 overflow-hidden"
                >
                  <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                    <TrendingUp className="size-6 text-indigo-600" />
                    Academic Progress
                  </h3>
                  
                  <div className="overflow-x-auto -mx-10 px-10">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-gray-50">
                          <th className="pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Subject</th>
                          <th className="pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Term</th>
                          <th className="pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Score</th>
                          <th className="pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Teacher Insights</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.length > 0 ? results.map(res => (
                          <tr key={res.id} className="border-b border-gray-50 hover:bg-slate-50 transition-colors group">
                            <td className="py-6 font-bold text-slate-900">{res.subject}</td>
                            <td className="py-6 text-sm text-gray-500">{res.term}</td>
                            <td className="py-6 text-center">
                              <span className={`px-4 py-2 rounded-xl text-xs font-bold ${res.score >= 85 ? 'bg-green-50 text-green-700' : 'bg-indigo-50 text-indigo-700'}`}>
                                {res.score}% 
                              </span>
                            </td>
                            <td className="py-6 text-sm text-gray-500 max-w-xs">{res.teacherComment || 'Excellent consistency shown throughout the term.'}</td>
                          </tr>
                        )) : (
                          <tr><td colSpan={4} className="py-10 text-center text-gray-400 italic">No academic records found for this term.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {activeTab === 'billing' && (
                <motion.div 
                  key="billing"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-100 flex flex-col justify-between relative overflow-hidden">
                      <CreditCard className="absolute top-0 right-0 size-32 text-white/5 -rotate-12 translate-x-10 -translate-y-10" />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest opacity-80">Outstanding Balance</p>
                        <h4 className="text-4xl font-bold mt-2">$2,450.00</h4>
                      </div>
                      <div className="mt-8 flex items-center gap-3">
                        <button className="px-6 py-2.5 bg-white text-indigo-600 rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-black/10 hover:bg-indigo-50 transition-colors">
                          Settle Now
                        </button>
                        <p className="text-[10px] opacity-70 italic font-medium">Due in 12 days</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <div className="size-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center">
                          <Receipt className="size-6" />
                        </div>
                        <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Auto-Pay Active</span>
                      </div>
                      <div className="mt-6">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Last Payment</p>
                        <h4 className="text-2xl font-bold text-slate-900 mt-1">$1,200.00</h4>
                        <p className="text-xs text-gray-500 mt-1 font-medium">Paid on Oct 12, 2025</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100 font-sans">
                    <h3 className="text-xl font-bold mb-8">Transaction History</h3>
                    <div className="space-y-4">
                      {fees.map(fee => (
                        <div key={fee.id} className="p-6 bg-slate-50 rounded-[2rem] border border-gray-50 flex items-center justify-between group hover:border-indigo-100 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className={`size-10 rounded-xl flex items-center justify-center ${fee.status === 'Paid' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                              <Receipt className="size-5" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{fee.description || 'Monthly Tuition Fee'}</p>
                              <p className="text-xs text-gray-500 font-medium">Invoice #{fee.id.slice(0, 6)} • {fee.dueDate}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <span className="text-sm font-bold text-slate-900">${fee.amount.toLocaleString()}</span>
                            <button 
                              onClick={() => downloadReceipt(fee)}
                              className="p-3 bg-white text-gray-400 rounded-xl hover:text-indigo-600 hover:shadow-md transition-all border border-transparent hover:border-indigo-100"
                            >
                              <Download className="size-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'meetings' && (
                <motion.div 
                  key="meetings"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 md:grid-cols-5 gap-10"
                >
                  <div className="md:col-span-3 bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold mb-8">Schedule a Consultation</h3>
                    <form onSubmit={handleMeetingSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Select Faculty</label>
                        <select 
                          value={meetingForm.teacherId}
                          onChange={(e) => setMeetingForm({ ...meetingForm, teacherId: e.target.value })}
                          required
                          className="w-full h-14 px-6 bg-slate-50 border-gray-100 focus:border-indigo-600 rounded-2xl outline-none transition-all text-sm font-medium"
                        >
                          <option value="">Choose a teacher...</option>
                          <option value="sarah-chen">Dr. Sarah Chen (Mathematics)</option>
                          <option value="james-wilson">Prof. James Wilson (Physics)</option>
                          <option value="elena-rodriguez">Ms. Elena Rodriguez (Literature)</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Preferred Time Window</label>
                        <input 
                          type="datetime-local" 
                          value={meetingForm.preferredTime}
                          onChange={(e) => setMeetingForm({ ...meetingForm, preferredTime: e.target.value })}
                          required
                          className="w-full h-14 px-6 bg-slate-50 border-gray-100 focus:border-indigo-600 rounded-2xl outline-none transition-all text-sm font-medium" 
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Meeting Objectives</label>
                        <textarea 
                          placeholder="Briefly describe what you'd like to discuss..."
                          value={meetingForm.purpose}
                          onChange={(e) => setMeetingForm({ ...meetingForm, purpose: e.target.value })}
                          required
                          className="w-full p-6 bg-slate-50 border-gray-100 focus:border-indigo-600 rounded-[2rem] outline-none transition-all text-sm font-medium min-h-[120px]"
                        ></textarea>
                      </div>

                      <button 
                        type="submit"
                        className="w-full h-14 bg-indigo-600 text-white rounded-2xl text-sm font-bold uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                      >
                        <Calendar className="size-5" /> Request Conference
                      </button>
                    </form>
                  </div>

                  <div className="md:col-span-2 space-y-6">
                    <div className="bg-indigo-50/50 rounded-[2.5rem] p-8 border border-indigo-100/50">
                      <h4 className="font-bold text-indigo-900 mb-4 flex items-center gap-2">
                        <MessageSquare className="size-5" /> Open Consultations
                      </h4>
                      <div className="space-y-4">
                        <div className="p-4 bg-white rounded-2xl border border-indigo-100 shadow-sm">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm font-bold text-indigo-900">Dr. Sarah Chen</p>
                              <p className="text-[10px] text-indigo-400 font-bold uppercase">Oct 24 • 10:30 AM</p>
                            </div>
                            <span className="px-2 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-bold">Pending</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
