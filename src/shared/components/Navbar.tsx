import { Link } from 'react-router-dom';
import { Button } from './Button';
import { GraduationCap } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
                <GraduationCap className="size-6" />
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900">Nexus</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center gap-8">
              <Link to="/courses" className="text-sm font-medium text-gray-600 hover:text-indigo-600">Courses</Link>
              <Link to="/students" className="text-sm font-medium text-gray-600 hover:text-indigo-600">Students</Link>
              <Link to="/teachers" className="text-sm font-medium text-gray-600 hover:text-indigo-600">Teachers</Link>
              <Link to="/academics" className="text-sm font-medium text-gray-600 hover:text-indigo-600">Academics</Link>
              <Link to="/mentors" className="text-sm font-medium text-gray-600 hover:text-indigo-600">Mentors</Link>
              <Link to="/pricing" className="text-sm font-medium text-gray-600 hover:text-indigo-600">Pricing</Link>
              <div className="flex items-center gap-4 border-l border-gray-200 pl-8">
                <Link to="/auth">
                  <Button variant="ghost" size="sm">Sign in</Button>
                </Link>
                <Link to="/auth">
                  <Button size="sm">Get Started</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
