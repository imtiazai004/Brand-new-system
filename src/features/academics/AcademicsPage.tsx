import React, { useState, useEffect } from 'react';
import { 
  School, 
  Users, 
  GraduationCap, 
  FileCheck, 
  Plus, 
  Search, 
  Filter,
  ArrowRight,
  MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../../shared/components/Button';
import { Navbar } from '../../shared/components/Navbar';
import { auth, db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  getDoc,
  doc,
  serverTimestamp 
} from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/auth.hooks';

type PortalTab = 'classes' | 'students' | 'teachers' | 'exams';

export default function AcademicsPage() {
  const [activeTab, setActiveTab] = useState<PortalTab>('classes');
  const { profile, schoolId, permissions, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const currentSchoolId = profile?.schoolId || schoolId || '';

  if (!currentSchoolId && !loading) {
    return (
      <div className="min-h-screen bg-[#FDFDFC] flex flex-col items-center justify-center p-6 text-center">
        <School className="size-16 text-indigo-200 mb-6" />
        <h2 className="text-2xl font-bold text-gray-900">Institutional Access Required</h2>
        <p className="text-gray-500 mt-2 max-w-sm">
          To access the academics module, you must be associated with a school. 
          Please complete onboarding or contact your administrator.
        </p>
        <Button onClick={() => navigate('/onboarding')} className="mt-8">
          Go to Onboarding
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFC]">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Academics Module</h1>
            <p className="text-gray-500 mt-1">Manage classes, students, faculty and academic performance.</p>
          </div>
          <Link to="/students" className="hidden sm:flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-4 py-2 rounded-xl transition-all h-fit">
            <Users className="size-4" /> Open Full Student Roster
          </Link>
        </header>

        {/* Tabbed Navigation */}
        <div className="flex overflow-x-auto gap-1 bg-gray-100/50 p-1 rounded-xl mb-8 border border-gray-200 w-fit">
          <TabButton 
            active={activeTab === 'classes'} 
            onClick={() => setActiveTab('classes')}
            icon={<School className="size-4" />}
            label="Classes"
          />
          <TabButton 
            active={activeTab === 'students'} 
            onClick={() => setActiveTab('students')}
            icon={<Users className="size-4" />}
            label="Students"
          />
          <TabButton 
            active={activeTab === 'teachers'} 
            onClick={() => setActiveTab('teachers')}
            icon={<GraduationCap className="size-4" />}
            label="Teachers"
          />
          <TabButton 
            active={activeTab === 'exams'} 
            onClick={() => setActiveTab('exams')}
            icon={<FileCheck className="size-4" />}
            label="Exams"
          />
        </div>

        {/* Portals Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'classes' && (
            <ClassesPortal schoolId={currentSchoolId} />
          )}
          {activeTab === 'students' && (
            <StudentsPortal schoolId={currentSchoolId} />
          )}
          {activeTab === 'teachers' && (
            <TeachersPortal schoolId={currentSchoolId} />
          )}
          {activeTab === 'exams' && (
            <ExamsPortal schoolId={currentSchoolId} />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all
        ${active ? 'bg-white text-indigo-600 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}
      `}
    >
      {icon}
      {label}
    </button>
  );
}

// --- PORTALS ---

function ClassesPortal({ schoolId }: { schoolId: string }) {
  const { permissions } = useAuth();
  const [classes, setClasses] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'schools', schoolId, 'classes'));
    return onSnapshot(q, (snapshot) => {
      setClasses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, [schoolId]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Classes Management</h2>
        {permissions.canManageAcademics && !permissions.isReadOnly && (
          <Button onClick={() => setIsAdding(true)} className="gap-2">
            <Plus className="size-4" /> Add Class
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map((cls) => (
          <div key={cls.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-indigo-200 transition-all">
            <h3 className="text-lg font-bold text-gray-900">{cls.name}</h3>
            <p className="text-sm text-gray-500">Section: {cls.section}</p>
            <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
              <div className="text-xs font-medium text-gray-400">
                {cls.studentCount || 0} Students
              </div>
              <Button variant="ghost" size="sm" className="text-indigo-600">
                View Details
              </Button>
            </div>
          </div>
        ))}
      </div>

      {isAdding && (
        <Modal onClose={() => setIsAdding(false)} title="Create New Class">
          <ClassForm schoolId={schoolId} onSuccess={() => setIsAdding(false)} />
        </Modal>
      )}
    </motion.div>
  );
}

function StudentsPortal({ schoolId }: { schoolId: string }) {
  const [students, setStudents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'schools', schoolId, 'students'));
    return onSnapshot(q, (snapshot) => {
      setStudents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, [schoolId]);

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         s.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Student Roster</h2>
        <Button onClick={() => setIsAdding(true)} className="gap-2">
          <Plus className="size-4" /> Register Student
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name or ID..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="rounded-lg border-gray-200 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Alumni">Alumni</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-medium uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-6 py-3">Student</th>
                <th className="px-6 py-3">Student ID</th>
                <th className="px-6 py-3">Grade</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{student.name}</div>
                    <div className="text-xs text-gray-400">{student.parentEmail}</div>
                  </td>
                  <td className="px-6 py-4 font-mono text-gray-500 text-xs">{student.studentId}</td>
                  <td className="px-6 py-4">{student.grade}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      student.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredStudents.length === 0 && (
            <div className="p-8 text-center text-gray-400 italic">No students found matching your criteria.</div>
          )}
        </div>
      </div>

      {isAdding && (
        <Modal onClose={() => setIsAdding(false)} title="Register New Student">
          <StudentForm schoolId={schoolId} onSuccess={() => setIsAdding(false)} />
        </Modal>
      )}
    </motion.div>
  );
}

function TeachersPortal({ schoolId }: { schoolId: string }) {
  const [teachers, setTeachers] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'schools', schoolId, 'teachers'));
    return onSnapshot(q, (snapshot) => {
      setTeachers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, [schoolId]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Faculty Directory</h2>
        <Button className="gap-2">
          <Plus className="size-4" /> Add Teacher
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers.map((teacher) => (
          <div key={teacher.id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col items-center text-center">
            <div className="size-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center font-bold text-xl mb-4">
              {teacher.name[0]}
            </div>
            <h3 className="text-lg font-bold text-gray-900">{teacher.name}</h3>
            <p className="text-sm text-indigo-600 font-medium mb-2">{teacher.subjectSpecialty}</p>
            <p className="text-xs text-gray-500 mb-4">{teacher.email}</p>
            
            <div className="w-full text-left space-y-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Assigned Classes</p>
              <div className="flex flex-wrap gap-1">
                {(teacher.assignedClasses || []).map((cls: string) => (
                  <span key={cls} className="px-2 py-1 bg-gray-100 rounded-md text-[10px] text-gray-600 font-medium">
                    {cls}
                  </span>
                ))}
              </div>
            </div>

            <Button variant="outline" size="sm" className="mt-6 w-full gap-2">
              View Profile <ArrowRight className="size-4" />
            </Button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function ExamsPortal({ schoolId }: { schoolId: string }) {
  const [classes, setClasses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [subject, setSubject] = useState('');
  const [term, setTerm] = useState('Term 1');
  const [scores, setScores] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const qCls = query(collection(db, 'schools', schoolId, 'classes'));
    onSnapshot(qCls, (snap) => setClasses(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, [schoolId]);

  useEffect(() => {
    if (!selectedClass) {
      setStudents([]);
      return;
    }
    const qStu = query(collection(db, 'schools', schoolId, 'students'), where('classId', '==', selectedClass));
    return onSnapshot(qStu, (snap) => setStudents(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, [selectedClass, schoolId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const promises = Object.entries(scores).map(([studentId, score]) => {
        return addDoc(collection(db, 'schools', schoolId, 'examResults'), {
          studentId,
          subject,
          score,
          term,
          classId: selectedClass,
          schoolId,
          grade: calculateGrade(score as number),
          createdAt: serverTimestamp()
        });
      });
      await Promise.all(promises);
      alert("Results saved successfully!");
      setScores({});
    } catch (error) {
       handleFirestoreError(error, OperationType.CREATE, `schools/${schoolId}/examResults`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateGrade = (score: number) => {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'F';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Results Entry</h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Class</label>
            <select 
              className="w-full rounded-lg border-gray-200 focus:ring-indigo-600 focus:border-indigo-600"
              required
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="">Select a class</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}-{c.section}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Subject</label>
            <input 
              type="text" 
              placeholder="e.g. Mathematics"
              required
              className="w-full rounded-lg border-gray-200 focus:ring-indigo-600 focus:border-indigo-600"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Term</label>
            <select 
              className="w-full rounded-lg border-gray-200 focus:ring-indigo-600 focus:border-indigo-600"
              required
              value={term}
              onChange={(e) => setTerm(e.target.value)}
            >
              <option>Term 1</option>
              <option>Term 2</option>
              <option>Final Exam</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">Student List</h3>
          {students.length > 0 ? (
            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
              {students.map((stu) => (
                <div key={stu.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">{stu.name}</span>
                    <span className="text-[10px] text-gray-400 font-mono uppercase">{stu.studentId}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input 
                      type="number" 
                      min="0" 
                      max="100" 
                      placeholder="Marks"
                      required
                      className="w-24 rounded-lg border-gray-200 text-center focus:ring-indigo-600 focus:border-indigo-600"
                      value={scores[stu.id] || ''}
                      onChange={(e) => setScores({ ...scores, [stu.id]: parseInt(e.target.value) })}
                    />
                    <div className="w-8 text-center font-bold text-indigo-600 text-xs">
                       {scores[stu.id] !== undefined ? calculateGrade(scores[stu.id]) : '-'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400 italic bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
              {selectedClass ? 'No students enrolled in this class.' : 'Select a class to view the student list.'}
            </div>
          )}
        </div>

        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <Button type="submit" isLoading={isSubmitting} disabled={students.length === 0}>
             Save All Results
          </Button>
        </div>
      </form>
    </motion.div>
  );
}

// --- FORMS & MODAL ---

function Modal({ children, onClose, title }: { children: React.ReactNode, onClose: () => void, title: string }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">×</button>
        </div>
        <div className="p-8">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

function ClassForm({ schoolId, onSuccess }: { schoolId: string, onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await addDoc(collection(db, 'schools', schoolId, 'classes'), {
        name: formData.get('name'),
        section: formData.get('section'),
        teacherId: formData.get('teacherId'),
        studentCount: 0,
        schoolId,
        createdAt: serverTimestamp()
      });
      onSuccess();
    } catch (e: any) {
      handleFirestoreError(e, OperationType.CREATE, `schools/${schoolId}/classes`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-500 uppercase">Class Name</label>
        <input name="name" required placeholder="e.g. Grade 10" className="w-full rounded-xl border-gray-200" />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-500 uppercase">Section</label>
        <input name="section" required placeholder="e.g. A" className="w-full rounded-xl border-gray-200" />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-500 uppercase">Teacher ID</label>
        <input name="teacherId" required placeholder="Enter Teacher UID" className="w-full rounded-xl border-gray-200" />
      </div>
      <Button type="submit" className="w-full" isLoading={loading}>Create Class</Button>
    </form>
  );
}

function StudentForm({ schoolId, onSuccess }: { schoolId: string, onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'schools', schoolId, 'classes'));
    return onSnapshot(q, (snap) => setClasses(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, [schoolId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await addDoc(collection(db, 'schools', schoolId, 'students'), {
        name: formData.get('name'),
        grade: formData.get('grade'),
        parentEmail: formData.get('parentEmail'),
        studentId: formData.get('studentId'),
        classId: formData.get('classId'),
        status: 'Active',
        enrollmentDate: new Date().toISOString().split('T')[0],
        schoolId,
        createdAt: serverTimestamp()
      });
      onSuccess();
    } catch (e: any) {
       handleFirestoreError(e, OperationType.CREATE, `schools/${schoolId}/students`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
        <input name="name" required className="w-full rounded-xl border-gray-200" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase">Grade</label>
          <input name="grade" required className="w-full rounded-xl border-gray-200" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase">Student Reg ID</label>
          <input name="studentId" required className="w-full rounded-xl border-gray-200" />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-500 uppercase">Class Assignment</label>
        <select name="classId" required className="w-full rounded-xl border-gray-200 font-sans text-sm">
          <option value="">Select a class</option>
          {classes.map(c => <option key={c.id} value={c.id}>{c.name}-{c.section}</option>)}
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-500 uppercase">Parent Email</label>
        <input name="parentEmail" type="email" required className="w-full rounded-xl border-gray-200" />
      </div>
      <Button type="submit" className="w-full" isLoading={loading}>Register Student</Button>
    </form>
  );
}
