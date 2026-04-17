import React, { useState } from 'react';
import { Plus, Search, UserPlus, GraduationCap, LayoutGrid, List, AlertCircle, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTeachers } from '../teacher.hooks';
import { teacherService } from '../teacher.service';
import { Teacher } from '../teacher.types';
import { TeacherCard } from '../components/TeacherCard';
import { TeacherForm } from '../components/TeacherForm';
import { Navbar } from '../../../shared/components/Navbar';
import { Button } from '../../../shared/components/Button';
import { useAuth } from '../../auth/auth.hooks';

export default function TeachersPage() {
  const { profile, schoolId, loading: authLoading, permissions } = useAuth();
  const { teachers, loading: dataLoading } = useTeachers(schoolId || undefined);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredTeachers = teachers.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.subjectSpecialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isLoading = authLoading || dataLoading;
  const isSetupIncomplete = !authLoading && !schoolId;

  const handleEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!schoolId) return;
    if (confirm('Are you sure you want to remove this faculty member?')) {
      await teacherService.deleteTeacher(schoolId, id);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingTeacher(null);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFC]">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="size-16 rounded-[2rem] bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-100">
               <GraduationCap className="size-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Faculty Directory</h1>
              <p className="text-gray-500 mt-1">Manage and organize your institution's teaching staff.</p>
            </div>
          </div>
          {permissions.canManageTeachers && (
            <Button 
              onClick={() => setIsFormOpen(true)}
              disabled={isSetupIncomplete}
              className="gap-2 h-12 px-8 text-base shadow-xl shadow-indigo-100 transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
            >
              <UserPlus className="size-5" /> Add Faculty Member
            </Button>
          )}
        </div>

        {/* Filters & Search - Technical Dashboard Recipe Inspired */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-10">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search faculty by name or subject..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-white border-gray-200 rounded-[1.25rem] focus:ring-2 focus:ring-indigo-600 h-12 shadow-sm text-sm border hover:border-indigo-200 transition-all font-sans"
            />
          </div>
          <div className="flex items-center gap-2 bg-gray-100/40 p-1.5 rounded-2xl border border-gray-100">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-sm border border-gray-100' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <LayoutGrid className="size-5" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white text-indigo-600 shadow-sm border border-gray-100' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <List className="size-5" />
            </button>
          </div>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="text-sm font-medium text-gray-400 animate-pulse">Syncing faculty directory...</p>
          </div>
        ) : isSetupIncomplete ? (
          <div className="text-center py-24 bg-red-50/50 rounded-[3rem] border border-red-100">
             <div className="size-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mx-auto mb-6 border border-red-50">
               <AlertCircle className="size-10 text-red-500" />
             </div>
             <h3 className="text-xl font-bold text-gray-900">Institutional Access Required</h3>
             <p className="text-gray-500 mt-2 max-w-sm mx-auto font-medium leading-relaxed">
               Your account is not yet associated with any registered institution. Please contact your administrator or complete your school setup.
             </p>
          </div>
        ) : filteredTeachers.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredTeachers.map((teacher) => (
                <motion.div
                  key={teacher.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                  layout
                >
                  <TeacherCard 
                    teacher={teacher} 
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-24 bg-indigo-50/30 rounded-[3rem] border-2 border-dashed border-indigo-100">
            <div className="size-20 bg-white rounded-3xl shadow-lg flex items-center justify-center mx-auto mb-6 border border-indigo-50">
              <Users className="size-10 text-indigo-200" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">No faculty records found</h3>
            <p className="text-gray-500 mt-2 max-w-sm mx-auto font-medium">
              {searchTerm ? 'No results match your current search query.' : 'Begin building your academic team by adding your first faculty member.'}
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsFormOpen(true)} variant="outline" className="mt-8 border-indigo-200 text-indigo-600">
                Register First Teacher
              </Button>
            )}
          </div>
        )}
      </main>

      {/* Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={handleFormClose}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100"
            >
              <div className="px-10 pt-10 pb-8 border-b border-gray-50 flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingTeacher ? 'Update Faculty Profile' : 'New Faculty Registration'}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1.5 font-medium leading-relaxed">
                    {editingTeacher 
                      ? `Updating details for ${editingTeacher.name}. All changes are synced real-time.` 
                      : 'Create a new faculty record. Ensure the email is for professional institutional use.'}
                  </p>
                </div>
                <button 
                  onClick={handleFormClose}
                  className="size-10 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                >
                  <Plus className="size-6 rotate-45" />
                </button>
              </div>
              <div className="p-10">
                <TeacherForm 
                  schoolId={schoolId!} 
                  initialData={editingTeacher || undefined}
                  teacherId={editingTeacher?.id}
                  onSuccess={handleFormClose} 
                  onCancel={handleFormClose}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
