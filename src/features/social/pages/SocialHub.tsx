import React from 'react';
import { Megaphone, CalendarDays, Image as ImageIcon, Sparkles, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../auth/auth.hooks';
import { NoticeBoard } from '../components/NoticeBoard';
import { SmartPostGenerator } from '../components/SmartPostGenerator';
import { EventsManager } from '../components/EventsManager';
import { MediaLibrary } from '../components/MediaLibrary';
import { Navbar } from '../../../shared/components/Navbar';
import { motion } from 'motion/react';

export const SocialHub = () => {
  const { profile } = useAuth();
  const schoolId = profile?.schoolId || '';

  if (!schoolId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500 font-medium">Loading school context...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFC]">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-wider rounded-md">
                Admin Portal
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500 font-medium italic">PR & Communication</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
              Social Hub
            </h1>
          </motion.div>
          
          <div className="flex items-center gap-4 bg-white p-1.5 border border-slate-200 rounded-2xl shadow-sm">
             <div className="px-4 py-2 bg-slate-50 rounded-xl flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
               <span className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Live Feed Status</span>
             </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Left Column (Announcements) */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <NoticeBoard schoolId={schoolId} />
            </motion.div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <EventsManager schoolId={schoolId} />
            </motion.div>
          </div>

          {/* Sidebar Column (AI Tool & Stats) */}
          <div className="lg:col-span-4 flex flex-col gap-8 h-fit">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="lg:sticky lg:top-24"
            >
              <SmartPostGenerator schoolId={schoolId} />
            </motion.div>

            <motion.div
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 0.4 }}
               className="bg-indigo-900 rounded-2xl p-6 text-white overflow-hidden relative"
            >
              <div className="relative z-10">
                <h3 className="text-lg font-bold mb-1">Impact Analytics</h3>
                <p className="text-sm text-indigo-200 mb-6">Social reach for the month of April</p>
                
                <div className="space-y-4">
                  {[
                    { label: 'Feed Impressions', value: '12.4K', growth: '+14%' },
                    { label: 'Event Attendance', value: '842', growth: '+21%' },
                    { label: 'Media Downloads', value: '1.2K', growth: '+8%' }
                  ].map((stat, i) => (
                    <div key={i} className="flex items-end justify-between border-b border-indigo-800/50 pb-2">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider font-mono">{stat.label}</p>
                        <p className="text-2xl font-black">{stat.value}</p>
                      </div>
                      <span className="text-emerald-400 text-xs font-bold font-mono">{stat.growth}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-500/10 rounded-full -ml-12 -mb-12 blur-2xl"></div>
            </motion.div>
          </div>
          
          {/* Full Width Bottom (Media Library) */}
          <div className="lg:col-span-12">
             <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <MediaLibrary schoolId={schoolId} />
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};
