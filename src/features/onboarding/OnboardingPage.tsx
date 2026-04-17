import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { PlusCircle, Users, ArrowRight, GraduationCap } from 'lucide-react';
import { Button } from '../../shared/components/Button';

export default function OnboardingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FDFDFC] flex items-center justify-center p-6">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col justify-center space-y-8 pr-0 md:pr-12">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-100">
              <GraduationCap className="size-7" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">Nexus Academy</span>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-[1.1] tracking-tight">
              Welcome to the <span className="text-indigo-600">Future</span> of School Management.
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed font-medium">
              You're just one step away from transforming your institution. Choose how you'd like to get started today.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <motion.button
            whileHover={{ y: -4, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/onboarding/create')}
            className="w-full text-left p-8 bg-white border border-gray-100 rounded-[2.5rem] shadow-xl shadow-indigo-100/20 group transition-all hover:border-indigo-200"
          >
            <div className="flex items-start justify-between">
              <div className="size-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                <PlusCircle className="size-7" />
              </div>
              <ArrowRight className="size-6 text-gray-200 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
            </div>
            <div className="mt-6">
              <h3 className="text-xl font-bold text-gray-900">Create a New School</h3>
              <p className="text-gray-500 mt-2 font-medium leading-relaxed">
                Establish a new digital campus for your institution. You'll be the primary administrator.
              </p>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ y: -4, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/onboarding/join')}
            className="w-full text-left p-8 bg-white border border-gray-100 rounded-[2.5rem] shadow-xl shadow-indigo-100/20 group transition-all hover:border-indigo-200"
          >
            <div className="flex items-start justify-between">
              <div className="size-14 rounded-2xl bg-slate-50 text-slate-600 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors duration-300">
                <Users className="size-7" />
              </div>
              <ArrowRight className="size-6 text-gray-200 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
            </div>
            <div className="mt-6">
              <h3 className="text-xl font-bold text-gray-900">Join an Existing Institution</h3>
              <p className="text-gray-500 mt-2 font-medium leading-relaxed">
                Already have a school on Nexus? Enter your invite code to join your colleagues.
              </p>
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
