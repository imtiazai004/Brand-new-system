import React from 'react';
import { User, Mail, Hash, Calendar, MoreVertical, Sparkles } from 'lucide-react';
import { Student } from '../student.types';

import { useAuth } from '../../auth/auth.hooks';

interface StudentCardProps {
  student: Student;
  onEdit?: (student: Student) => void;
  onDelete?: (id: string) => void;
  onGenerateReport?: (student: Student) => void;
  onView?: (student: Student) => void;
}

export function StudentCard({ student, onEdit, onDelete, onGenerateReport, onView }: StudentCardProps) {
  const { permissions } = useAuth();
  const statusColors = {
    Active: 'bg-green-100 text-green-700',
    Alumni: 'bg-blue-100 text-blue-700',
    Inactive: 'bg-gray-100 text-gray-700',
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all group relative">
      <div className="flex items-start justify-between mb-4">
        <div 
          onClick={() => onView?.(student)}
          className="size-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 cursor-pointer hover:bg-indigo-100 transition-colors"
        >
          <User className="size-6" />
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColors[student.status]}`}>
            {student.status}
          </span>
          <button className="text-gray-400 hover:text-gray-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreVertical className="size-4" />
          </button>
        </div>
      </div>

      <div 
        onClick={() => onView?.(student)}
        className="space-y-3 cursor-pointer group/content"
      >
        <div>
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover/content:text-indigo-600 transition-colors">{student.name}</h3>
          <p className="text-sm text-gray-500 font-medium">Grade {student.grade}</p>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Hash className="size-3.5" />
            <span className="font-mono">{student.studentId}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Mail className="size-3.5" />
            <span className="truncate">{student.parentEmail}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Calendar className="size-3.5" />
            <span>Joined {new Date(student.enrollmentDate).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-50 grid grid-cols-3 gap-2">
        {permissions.canEditRecords && (
          <button 
            onClick={() => onEdit?.(student)}
            className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-widest text-center"
          >
            Edit
          </button>
        )}
        {permissions.canGenerateReports && (
          <button 
            onClick={() => onGenerateReport?.(student)}
            className="text-[10px] font-bold text-amber-600 hover:text-amber-700 uppercase tracking-widest flex items-center justify-center gap-1 group/ai"
          >
            <Sparkles className="size-3 group-hover/ai:animate-pulse" />
            AI
          </button>
        )}
        {permissions.canDeleteRecords && (
          <button 
            onClick={() => onDelete?.(student.id)}
            className="text-[10px] font-bold text-red-600 hover:text-red-700 uppercase tracking-widest text-center"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
