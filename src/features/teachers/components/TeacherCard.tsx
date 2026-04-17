import React from 'react';
import { GraduationCap, Mail, Phone, BookOpen, MoreVertical } from 'lucide-react';
import { Teacher } from '../teacher.types';
import { useAuth } from '../../auth/auth.hooks';

interface TeacherCardProps {
  teacher: Teacher;
  onEdit?: (teacher: Teacher) => void;
  onDelete?: (id: string) => void;
}

export function TeacherCard({ teacher, onEdit, onDelete }: TeacherCardProps) {
  const { permissions } = useAuth();
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all group relative">
      <div className="flex items-start justify-between mb-4">
        <div className="size-16 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl">
          {teacher.name[0]}
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 border border-indigo-100">
            Faculty
          </span>
          <button className="text-gray-400 hover:text-gray-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreVertical className="size-4" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{teacher.name}</h3>
          <p className="text-sm text-indigo-600 font-semibold">{teacher.subjectSpecialty}</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Mail className="size-3.5" />
            <span className="truncate">{teacher.email}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Phone className="size-3.5" />
            <span>{teacher.contactInfo}</span>
          </div>
        </div>

        {teacher.assignedClasses && teacher.assignedClasses.length > 0 && (
          <div className="pt-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1">
              <BookOpen className="size-3" /> Assigned Classes
            </p>
            <div className="flex flex-wrap gap-1">
              {teacher.assignedClasses.map((cls) => (
                <span key={cls} className="px-2 py-1 bg-gray-50 rounded-md text-[10px] text-gray-600 font-medium border border-gray-100">
                  {cls}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
        {permissions.canEditRecords && (
          <button 
            onClick={() => onEdit?.(teacher)}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-wider"
          >
            Edit Profile
          </button>
        )}
        {permissions.canDeleteRecords && (
          <button 
            onClick={() => onDelete?.(teacher.id)}
            className="text-xs font-bold text-red-600 hover:text-red-700 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
}
