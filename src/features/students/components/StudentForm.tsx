import React, { useState } from 'react';
import { StudentFormData } from '../student.types';
import { studentService } from '../student.service';
import { Button } from '../../../shared/components/Button';

interface StudentFormProps {
  schoolId: string;
  initialData?: StudentFormData;
  studentId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function StudentForm({ schoolId, initialData, studentId, onSuccess, onCancel }: StudentFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<StudentFormData>(initialData || {
    name: '',
    grade: '',
    parentEmail: '',
    studentId: '',
    classId: '',
    status: 'Active'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (studentId) {
        await studentService.updateStudent(schoolId, studentId, formData);
      } else {
        await studentService.createStudent(schoolId, formData);
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

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Full Name</label>
        <input
          name="name"
          type="text"
          required
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. John Doe"
          className="w-full bg-gray-50 border-gray-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Grade</label>
          <input
            name="grade"
            type="text"
            required
            value={formData.grade}
            onChange={handleChange}
            placeholder="e.g. 10A"
            className="w-full bg-gray-50 border-gray-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Reg ID</label>
          <input
            name="studentId"
            type="text"
            required
            value={formData.studentId}
            onChange={handleChange}
            placeholder="e.g. NA-2024-001"
            className="w-full bg-gray-50 border-gray-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Date of Birth</label>
          <input
            name="dob"
            type="date"
            value={formData.dob || ''}
            onChange={handleChange}
            className="w-full bg-gray-50 border-gray-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Contact Number</label>
          <input
            name="contactNumber"
            type="tel"
            value={formData.contactNumber || ''}
            onChange={handleChange}
            placeholder="+1 (555) 000-0000"
            className="w-full bg-gray-50 border-gray-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Address</label>
        <input
          name="address"
          type="text"
          value={formData.address || ''}
          onChange={handleChange}
          placeholder="123 School St, City, Country"
          className="w-full bg-gray-50 border-gray-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Parent Email</label>
        <input
          name="parentEmail"
          type="email"
          required
          value={formData.parentEmail}
          onChange={handleChange}
          placeholder="parent@example.com"
          className="w-full bg-gray-50 border-gray-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full bg-gray-50 border-gray-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all"
        >
          <option value="Active">Active</option>
          <option value="Alumni">Alumni</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
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
          className="px-8"
        >
          {studentId ? 'Update' : 'Register'} Student
        </Button>
      </div>
    </form>
  );
}
