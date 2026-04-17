import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Book, 
  Users, 
  School, 
  GraduationCap, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Search, 
  Bell,
  TrendingUp,
  UserCheck,
  ClipboardList
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { auth, db } from '../../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useStudents } from '../students/student.hooks';
import { useTeachers } from '../teachers/teacher.hooks';
import { useClasses } from '../academics/class.hooks';
import { useAuth } from '../auth/auth.hooks';
import { useDashboardStats } from './dashboard.hooks';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { motion } from 'motion/react';

const MOCK_CHART_DATA = [
  { name: 'Jan', students: 400, teachers: 24 },
  { name: 'Feb', students: 450, teachers: 26 },
  { name: 'Mar', students: 520, teachers: 28 },
  { name: 'Apr', students: 610, teachers: 32 },
  { name: 'May', students: 680, teachers: 35 },
  { name: 'Jun', students: 750, teachers: 42 },
];

export default function DashboardPage() {
  const { profile, schoolId, loading: authLoading, permissions } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const { stats: dashboardStats, school, loading: statsLoading } = useDashboardStats(schoolId || undefined);

  useEffect(() => {
    if (!authLoading && !profile) {
      navigate('/auth');
    }
    // Remove individual redirect logic as ProtectedRoute handles it now
  }, [profile, authLoading, navigate]);

  const handleSignOut = async () => {
    await signOut(auth);
    navigate('/');
  };

  if (authLoading) return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  const navigation = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', show: true },
    { name: 'Academics', icon: School, href: '/academics', show: permissions.canManageAcademics },
    { name: 'Students', icon: Users, href: '/students', show: permissions.canManageStudents },
    { name: 'Teachers', icon: GraduationCap, href: '/teachers', show: permissions.canManageTeachers },
    { name: 'Social Hub', icon: MessageSquare, href: '/social', show: permissions.canPostAnnouncements },
    { name: 'My Courses', icon: Book, href: '/courses', show: profile?.role === 'student' || profile?.role === 'teacher' },
    { name: 'Guardian Portal', icon: UserCheck, href: '/guardian', show: profile?.role === 'guardian' || profile?.role === 'admin' },
  ].filter(item => item.show);

  const stats = [
    { 
      label: 'Total Students', 
      value: dashboardStats?.students || 0, 
      icon: Users, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50',
      loading: statsLoading,
      show: permissions.canManageStudents
    },
    { 
      label: 'Total Teachers', 
      value: dashboardStats?.teachers || 0, 
      icon: GraduationCap, 
      color: 'text-indigo-600', 
      bg: 'bg-indigo-50',
      loading: statsLoading,
      show: permissions.canManageTeachers
    },
    { 
      label: 'Active Classes', 
      value: dashboardStats?.classes || 0, 
      icon: School, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50',
      loading: statsLoading,
      show: permissions.canManageAcademics
    },
  ].filter(stat => stat.show);

  return (
    <div className="flex h-screen bg-[#FDFDFC]">
      {/* Sidebar - Minimal Utility Aesthetic */}
      <aside className="w-64 border-r border-gray-100 bg-white hidden md:flex flex-col">
        <div className="flex h-16 items-center px-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="size-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <GraduationCap className="size-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">Nexus</span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
                }`}
              >
                <item.icon className="size-4.5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-50">
          <button 
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut className="size-4.5" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-50 bg-white/80 backdrop-blur-md px-8">
          <div className="flex flex-1 items-center">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full rounded-xl border border-gray-100 bg-gray-50/50 py-1.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-5">
            <button className="relative rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
              <Bell className="size-5" />
              <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900">{profile?.displayName}</p>
                <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">{profile?.role}</p>
              </div>
              <div className="size-9 overflow-hidden rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-indigo-100">
                {profile?.photoURL ? (
                  <img src={profile.photoURL} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  profile?.displayName?.charAt(0) || 'U'
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Institutional Dashboard</h1>
            <p className="text-gray-500 mt-1">Gaining insights into {school?.name || 'your institution'}'s growth and performance.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mb-10">
            {stats.map((stat, idx) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
              >
                <div className={`absolute top-0 right-0 size-32 opacity-10 -mr-8 -mt-8 rounded-full ${stat.bg} group-hover:scale-110 transition-transform duration-500`}></div>
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                    <p className="mt-2 text-4xl font-bold text-gray-900">
                      {stat.loading ? '...' : stat.value}
                    </p>
                  </div>
                  <div className={`size-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center shadow-inner`}>
                    <stat.icon className="size-7" />
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-2 text-xs text-emerald-600 font-bold bg-emerald-50 w-fit px-2 py-1 rounded-lg">
                  <TrendingUp className="size-3.5" />
                  <span>+4.2% from last month</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Chart Section */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-sm flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Enrollment Growth</h2>
                  <p className="text-xs text-gray-500 mt-1 font-medium">Monthly new registrations vs faculty growth.</p>
                </div>
                <select className="text-xs font-bold bg-gray-50 border-gray-100 rounded-xl px-3 py-2 outline-none">
                  <option>Last 6 Months</option>
                  <option>Yearly</option>
                </select>
              </div>
              <div className="flex-1 min-h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MOCK_CHART_DATA}>
                    <defs>
                      <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 'bold' }} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 'bold' }} 
                    />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '16px', 
                        border: 'none', 
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                        fontSize: '12px'
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="students" 
                      stroke="#4F46E5" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorStudents)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Sidebar Stats / Recent Activity */}
            <div className="space-y-8">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-[2.5rem] border border-gray-100 bg-indigo-600 p-8 shadow-xl shadow-indigo-100 text-white relative overflow-hidden"
              >
                <div className="absolute -right-4 -bottom-4 opacity-20 transform rotate-12">
                   <GraduationCap className="size-48" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-lg font-bold mb-1">Academic Status</h3>
                  <p className="text-indigo-100 text-xs font-medium mb-8">Semester 1 • Final Term</p>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-2">
                        <span>Attendance Performance</span>
                        <span>92%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '92%' }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className="h-full bg-white shadow-[0_0_10px_white]" 
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-2">
                        <span>Teacher Satisfaction</span>
                        <span>88%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '88%' }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className="h-full bg-emerald-400" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Staff Distribution</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Science Dept', members: 12, color: 'bg-blue-500' },
                    { label: 'Humanities', members: 8, color: 'bg-indigo-500' },
                    { label: 'Mathematics', members: 10, color: 'bg-emerald-500' },
                    { label: 'Administration', members: 5, color: 'bg-amber-500' },
                  ].map((dept) => (
                    <div key={dept.label} className="flex items-center gap-4 group cursor-default">
                      <div className={`size-3 rounded-full ${dept.color} group-hover:scale-150 transition-transform`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900">{dept.label}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{dept.members} Faculty</p>
                      </div>
                      <div className="text-xs font-bold text-gray-500">
                        {Math.round((dept.members / 35) * 100)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
