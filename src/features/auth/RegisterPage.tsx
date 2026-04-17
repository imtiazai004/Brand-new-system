import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from './auth.service';
import { Button } from '../../shared/components/Button';
import { motion } from 'motion/react';
import { GraduationCap, Mail, Lock, User, School, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    role: 'student' as const
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await authService.register(formData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FDFDFC] px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg space-y-6 bg-white p-10 rounded-3xl shadow-xl border border-gray-100"
      >
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg">
            <GraduationCap className="h-8 w-8" />
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-900">Create Account</h2>
          <p className="mt-1 text-sm text-gray-500">Join Nexus Academy multi-tenant platform</p>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleRegister}>
          {error && (
            <div className="flex items-center gap-2 p-4 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                required
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                className="block w-full rounded-xl border-gray-200 py-3 pl-9 text-gray-900 placeholder:text-gray-300 focus:ring-2 focus:ring-indigo-600 text-sm"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="block w-full rounded-xl border-gray-200 py-3 pl-9 text-gray-900 placeholder:text-gray-300 focus:ring-2 focus:ring-indigo-600 text-sm"
                placeholder="name@nexus.edu"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Account Role</label>
            <div className="grid grid-cols-3 gap-2">
              {['student', 'teacher', 'management'].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setFormData({ ...formData, role: role as any })}
                  className={`py-2 px-1 text-[10px] font-bold uppercase rounded-lg border transition-all ${
                    formData.role === role 
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100' 
                      : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="block w-full rounded-xl border-gray-200 py-3 pl-9 text-gray-900 placeholder:text-gray-300 focus:ring-2 focus:ring-indigo-600 text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button type="submit" className="w-full py-4 rounded-xl text-md shadow-lg shadow-indigo-100" isLoading={loading}>
            Create Account
          </Button>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">Sign in</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
