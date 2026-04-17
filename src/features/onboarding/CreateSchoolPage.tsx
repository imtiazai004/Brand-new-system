import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { GraduationCap, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { Button } from '../../shared/components/Button';
import { schoolService } from './onboarding.service';
import { useAuth } from '../auth/auth.hooks';

export default function CreateSchoolPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !name.trim()) return;

    setLoading(true);
    setError(null);
    try {
      await schoolService.createSchool(user.uid, name.trim());
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create school. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFC] flex flex-col items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <button 
          onClick={() => navigate('/onboarding')}
          className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors mb-8 group"
        >
          <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-widest">Back to choices</span>
        </button>

        <div className="bg-white rounded-[3rem] shadow-2xl shadow-indigo-100/40 border border-gray-100 overflow-hidden">
          <div className="p-12">
            <div className="size-16 rounded-3xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-100 mb-8">
              <GraduationCap className="size-9" />
            </div>

            <div className="space-y-2 mb-10">
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Name Your Campus</h1>
              <p className="text-gray-500 font-medium leading-relaxed">
                This name will be visible to all students, parents, and faculty members.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] px-1">
                  Institution Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Nexus International Academy"
                    required
                    className="w-full h-14 px-6 bg-slate-50 border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all text-lg font-medium"
                  />
                  <Sparkles className="absolute right-5 top-1/2 -translate-y-1/2 size-5 text-indigo-200" />
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full h-14 text-lg font-bold shadow-xl shadow-indigo-100 rounded-2xl"
                isLoading={loading}
              >
                Create My Institution
              </Button>
            </form>
          </div>
          
          <div className="px-12 py-6 bg-indigo-600 text-white text-center">
            <p className="text-xs font-bold uppercase tracking-widest opacity-80">
              Nexus Academy • Institutional Tier
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
