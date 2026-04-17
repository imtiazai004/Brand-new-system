import React from 'react';
import { 
  User, 
  Mail, 
  Hash, 
  Calendar, 
  Phone, 
  MapPin, 
  Cake, 
  GraduationCap,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { Student } from '../student.types';
import { Button } from '../../../shared/components/Button';

interface StudentProfileProps {
  student: Student;
  onBack: () => void;
  onEdit?: (student: Student) => void;
  onGenerateReport?: (student: Student) => void;
}

export function StudentProfile({ student, onBack, onEdit, onGenerateReport }: StudentProfileProps) {
  const statusColors = {
    Active: 'bg-green-100 text-green-700',
    Alumni: 'bg-blue-100 text-blue-700',
    Inactive: 'bg-gray-100 text-gray-700',
  };

  const details = [
    { label: 'Registration ID', value: student.studentId, icon: Hash },
    { label: 'Grade / Class', value: student.grade, icon: GraduationCap },
    { label: 'Date of Birth', value: student.dob ? new Date(student.dob).toLocaleDateString() : 'Not provided', icon: Cake },
    { label: 'Contact Number', value: student.contactNumber || 'Not provided', icon: Phone },
    { label: 'Parent Email', value: student.parentEmail, icon: Mail },
    { label: 'Enrollment Date', value: new Date(student.enrollmentDate).toLocaleDateString(), icon: Calendar },
  ];

  return (
    <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100">
      {/* Header Profile Section */}
      <div className="bg-indigo-600 px-8 py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/50 via-transparent to-transparent opacity-50" />
        
        <button 
          onClick={onBack}
          className="absolute top-6 left-6 text-white/80 hover:text-white transition-colors"
        >
          <ArrowLeft className="size-6" />
        </button>

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="size-24 rounded-3xl bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center text-white mb-6 shadow-2xl">
            <User className="size-12" />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">{student.name}</h2>
          <div className="flex items-center gap-3 mt-3">
             <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider border border-white/20">
               Grade {student.grade}
             </span>
             <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${statusColors[student.status]}`}>
               {student.status}
             </span>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="p-8 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Detailed Info */}
          <div className="space-y-6">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Academic & Personal Info</h3>
            <div className="grid grid-cols-1 gap-4">
              {details.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-indigo-100 transition-colors group">
                  <div className="size-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-indigo-600 transition-colors">
                    <item.icon className="size-5" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.label}</label>
                    <p className="text-sm font-semibold text-gray-900">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Location & Actions */}
          <div className="space-y-6">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Additional Details</h3>
            
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 h-fit">
              <div className="flex items-start gap-4 mb-4">
                 <div className="size-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400">
                    <MapPin className="size-5" />
                 </div>
                 <div className="flex-1">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Permanent Address</label>
                    <p className="text-sm font-medium text-gray-700 leading-relaxed mt-1">
                      {student.address || 'Address not listed in records.'}
                    </p>
                 </div>
              </div>
            </div>

            <div className="pt-6 space-y-3">
              <Button 
                variant="primary" 
                className="w-full h-14 rounded-2xl text-base shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
                onClick={() => onGenerateReport?.(student)}
              >
                <Sparkles className="size-5" /> Generate AI Report
              </Button>
              <Button 
                variant="outline" 
                className="w-full h-14 rounded-2xl text-base border-gray-200"
                onClick={() => onEdit?.(student)}
              >
                Modify Records
              </Button>
              <Button 
                variant="ghost" 
                className="w-full h-14 rounded-2xl text-base text-gray-500"
                onClick={onBack}
              >
                Close Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
