import React, { useState } from 'react';
import { TeacherFormData } from '../teacher.types';
import { teacherService } from '../teacher.service';
import { Button } from '../../../shared/components/Button';

interface TeacherFormProps {
  schoolId: string;
  initialData?: TeacherFormData;
  teacherId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function TeacherForm({ schoolId, initialData, teacherId, onSuccess, onCancel }: TeacherFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<TeacherFormData>(initialData || {
    name: '',
    subjectSpecialty: '',
    email: '',
    contactInfo: '',
    assignedClasses: []
  });
  const [newClass, setNewClass] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (teacherId) {
        await teacherService.updateTeacher(schoolId, teacherId, formData);
      } else {
        await teacherService.createTeacher(schoolId, formData);
      }
      onSuccess();
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addClass = () => {
    if (newClass && !formData.assignedClasses.includes(newClass)) {
      setFormData(prev => ({
        ...prev,
        assignedClasses: [...prev.assignedClasses, newClass]
      }));
      setNewClass('');
    }
  };

  const removeClass = (cls: string) => {
    setFormData(prev => ({
      ...prev,
      assignedClasses: prev.assignedClasses.filter(c => c !== cls)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Full Name</label>
        <input
          name="name"
          type="text"
          required
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Prof. David Miller"
          className="w-full bg-gray-50 border-gray-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 text-sm h-11"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Specialty</label>
          <input
            name="subjectSpecialty"
            type="text"
            required
            value={formData.subjectSpecialty}
            onChange={handleChange}
            placeholder="e.g. Quantum Physics"
            className="w-full bg-gray-50 border-gray-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 text-sm h-11"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Contact No.</label>
          <input
            name="contactInfo"
            type="text"
            required
            value={formData.contactInfo}
            onChange={handleChange}
            placeholder="+1 (555) 000-0000"
            className="w-full bg-gray-50 border-gray-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 text-sm h-11"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Work Email</label>
        <input
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
          placeholder="teacher@nexusacademy.edu"
          className="w-full bg-gray-50 border-gray-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 text-sm h-11"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Assigned Classes</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={newClass}
            onChange={(e) => setNewClass(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addClass())}
            placeholder="e.g. 10-A"
            className="flex-1 bg-gray-50 border-gray-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 text-sm h-11"
          />
          <button
            type="button"
            onClick={addClass}
            className="px-4 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-colors"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.assignedClasses.map(cls => (
            <span key={cls} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium flex items-center gap-2 group">
              {cls}
              <button onClick={() => removeClass(cls)} className="text-indigo-300 hover:text-indigo-600">×</button>
            </span>
          ))}
        </div>
      </div>

      <div className="pt-6 flex items-center justify-end gap-3 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors"
        >
          Cancel
        </button>
        <Button
          type="submit"
          isLoading={loading}
          className="px-8 shadow-indigo-100 shadow-lg"
        >
          {teacherId ? 'Update' : 'Register'} Teacher
        </Button>
      </div>
    </form>
  );
}
