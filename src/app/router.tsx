import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import LandingPage from '../features/landing/LandingPage';
import AuthPage from '../features/auth/AuthPage';
import LoginPage from '../features/auth/LoginPage';
import RegisterPage from '../features/auth/RegisterPage';
import DashboardPage from '../features/dashboard/DashboardPage';
import CoursesPage from '../features/courses/CoursesPage';
import AcademicsPage from '../features/academics/AcademicsPage';
import StudentsPage from '../features/students/pages/StudentsPage';
import TeachersPage from '../features/teachers/pages/TeachersPage';
import GuardianDashboard from '../features/guardian/pages/GuardianDashboard';
import { SocialHub } from '../features/social/pages/SocialHub';
import OnboardingPage from '../features/onboarding/OnboardingPage';
import CreateSchoolPage from '../features/onboarding/CreateSchoolPage';
import JoinSchoolPage from '../features/onboarding/JoinSchoolPage';
import { ProtectedRoute } from '../shared/components/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/auth',
    element: <AuthPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/onboarding',
    element: (
      <ProtectedRoute requireSchool={false}>
        <OnboardingPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/onboarding/create',
    element: (
      <ProtectedRoute requireSchool={false}>
        <CreateSchoolPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/onboarding/join',
    element: (
      <ProtectedRoute requireSchool={false}>
        <JoinSchoolPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/courses',
    element: (
      <ProtectedRoute allowedRoles={['admin', 'teacher', 'management', 'student']}>
        <CoursesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/academics',
    element: (
      <ProtectedRoute allowedRoles={['admin', 'teacher', 'management']}>
        <AcademicsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/students',
    element: (
      <ProtectedRoute allowedRoles={['admin', 'teacher', 'management']}>
        <StudentsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/teachers',
    element: (
      <ProtectedRoute allowedRoles={['admin', 'management']}>
        <TeachersPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/guardian',
    element: (
      <ProtectedRoute allowedRoles={['guardian', 'admin']}>
        <GuardianDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/social',
    element: (
      <ProtectedRoute allowedRoles={['admin', 'management']}>
        <SocialHub />
      </ProtectedRoute>
    ),
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
