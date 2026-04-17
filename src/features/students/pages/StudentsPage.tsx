import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, GraduationCap, LayoutGrid, List, Sparkles, X, FileText, Send, AlertCircle, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useStudents } from '../student.hooks';
import { studentService } from '../student.service';
import { Student } from '../student.types';
import { StudentCard } from '../components/StudentCard';
import { StudentForm } from '../components/StudentForm';
import { StudentProfile } from '../components/StudentProfile';
import { Navbar } from '../../../shared/components/Navbar';
import { Button } from '../../../shared/components/Button';
import { useAuth } from '../../auth/auth.hooks';
import { generateStudentReport, StudentReport } from '../../../lib/ai';

export default function StudentsPage() {
  const { profile, schoolId, loading: authLoading, permissions } = useAuth();
  const { students, loading: dataLoading } = useStudents(schoolId || undefined);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // AI Report State
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [currentReport, setCurrentReport] = useState<StudentReport | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isLoading = authLoading || dataLoading;
  const isSetupIncomplete = !authLoading && !schoolId;

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!schoolId) return;
    if (confirm('Are you sure you want to delete this student record?')) {
      await studentService.deleteStudent(schoolId, id);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingStudent(null);
  };

  const handleGenerateReport = async (student: Student) => {
    setSelectedStudent(student);
    setIsReportOpen(true);
    setIsGenerating(true);
    setCurrentReport(null);
    try {
      const report = await generateStudentReport({
        ...student,
        schoolName: profile?.schoolId || 'Nexus Academy',
        generatedAt: new Date().toISOString()
      });
      setCurrentReport(report);
    } catch (error) {
      console.error("AI Report Generation Failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFC]">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Student Roster</h1>
            <p className="text-gray-500 mt-1">Manage and track all students in your institution.</p>
          </div>
          {permissions.canEditRecords && (
            <Button 
              onClick={() => setIsFormOpen(true)}
              disabled={isSetupIncomplete}
              className="gap-2 h-11 px-6 text-base shadow-sm disabled:opacity-50"
            >
              <Plus className="size-5" /> Enroll New Student
            </Button>
          )}
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name or enrollment ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border-gray-200 rounded-2xl focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-sm"
            />
          </div>
          <div className="flex items-center gap-2 bg-gray-100/50 p-1.5 rounded-2xl border border-gray-200">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500'}`}
            >
              <LayoutGrid className="size-4" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500'}`}
            >
              <List className="size-4" />
            </button>
          </div>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : isSetupIncomplete ? (
          <div className="text-center py-24 bg-red-50/50 rounded-[3rem] border border-red-100 mb-10">
             <div className="size-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mx-auto mb-6 border border-red-50">
               <AlertCircle className="size-10 text-red-500" />
             </div>
             <h3 className="text-xl font-bold text-gray-900">Institutional Access Required</h3>
             <p className="text-gray-500 mt-2 max-w-sm mx-auto font-medium leading-relaxed">
               Your account is not yet associated with any registered institution. Please contact your administrator or complete your school setup.
             </p>
          </div>
        ) : filteredStudents.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredStudents.map((student) => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  layout
                >
                  <StudentCard 
                    student={student} 
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onGenerateReport={handleGenerateReport}
                    onView={(s) => setViewingStudent(s)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-[2.5rem] border border-dashed border-gray-200">
            <div className="size-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 border border-gray-100">
              <GraduationCap className="size-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No students found</h3>
            <p className="text-gray-500 mt-1 max-w-sm mx-auto">
              {searchTerm ? 'Try adjusting your search filters' : 'Start by enrolling your first student to the system.'}
            </p>
          </div>
        )}
      </main>

      {/* AI Report Modal */}
      <AnimatePresence>
        {isReportOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => !isGenerating && setIsReportOpen(false)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]"
            >
              <div className="px-10 py-8 bg-indigo-600 text-white flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                    <Sparkles className="size-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">AI Academic Insights</h2>
                    <p className="text-indigo-100 text-xs font-medium">Generated for {selectedStudent?.name}</p>
                  </div>
                </div>
                {!isGenerating && (
                  <button 
                    onClick={() => setIsReportOpen(false)}
                    className="size-10 rounded-2xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                  >
                    <X className="size-5" />
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-8">
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center py-20 space-y-6">
                    <div className="relative">
                      <div className="size-16 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin"></div>
                      <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-6 text-indigo-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-900">Analyzing Academic Profile...</p>
                      <p className="text-sm text-gray-500 mt-1">NEXUS AI is synthesizing performance data and behavioral metrics.</p>
                    </div>
                  </div>
                ) : currentReport ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                    <section>
                      <div className="flex items-center gap-2 mb-4">
                        <FileText className="size-5 text-indigo-600" />
                        <h3 className="font-bold text-gray-900 border-b-2 border-indigo-100 pb-1">Performance Summary</h3>
                      </div>
                      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 italic text-gray-700 leading-relaxed text-sm">
                        "{currentReport.performanceSummary}"
                      </div>
                    </section>

                    <section>
                      <div className="flex items-center gap-2 mb-4">
                        <Send className="size-5 text-indigo-600" />
                        <h3 className="font-bold text-gray-900 border-b-2 border-indigo-100 pb-1">Parent Feedback</h3>
                      </div>
                      <div className="bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100/50 text-indigo-900 leading-relaxed text-sm">
                        {currentReport.parentFeedback}
                      </div>
                    </section>

                    <div className="pt-4 flex items-center justify-end gap-3">
                      <Button variant="outline" onClick={() => setIsReportOpen(false)} className="rounded-xl px-8 border-gray-200">
                        Dismiss
                      </Button>
                      <Button className="rounded-xl px-8 shadow-lg shadow-indigo-100 flex items-center gap-2">
                        <Send className="size-4" /> Send to Parent
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-center py-20">
                    <p className="text-gray-500 font-medium">Something went wrong while generating the report.</p>
                    <Button onClick={() => handleGenerateReport(selectedStudent!)} className="mt-4">
                      Try Again
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={handleFormClose}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100"
            >
              <div className="px-10 pt-10 pb-6 border-b border-gray-50 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingStudent ? 'Edit Student Profile' : 'Student Enrollment'}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {editingStudent ? 'Update details for the selected student.' : 'Enter student details to add them to your roster.'}
                  </p>
                </div>
                <button 
                  onClick={handleFormClose}
                  className="size-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
                >
                  ×
                </button>
              </div>
              <div className="p-10">
                <StudentForm 
                  schoolId={schoolId!} 
                  initialData={editingStudent || undefined}
                  studentId={editingStudent?.id}
                  onSuccess={handleFormClose} 
                  onCancel={handleFormClose}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Student Profile Modal */}
      <AnimatePresence>
        {viewingStudent && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setViewingStudent(null)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto no-scrollbar"
            >
              <StudentProfile 
                student={viewingStudent} 
                onBack={() => setViewingStudent(null)}
                onEdit={(s) => {
                  setViewingStudent(null);
                  handleEdit(s);
                }}
                onGenerateReport={handleGenerateReport}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
