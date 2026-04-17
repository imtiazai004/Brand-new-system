import { UserProfile } from '../features/auth/auth.service';

export type Role = UserProfile['role'];

export interface Permissions {
  canManageAcademics: boolean;
  canManageStudents: boolean;
  canManageTeachers: boolean;
  canEditRecords: boolean;
  canDeleteRecords: boolean;
  canGenerateReports: boolean;
  canPostAnnouncements: boolean;
  isReadOnly: boolean;
}

export const getPermissions = (role?: Role): Permissions => {
  const defaultPermissions: Permissions = {
    canManageAcademics: false,
    canManageStudents: false,
    canManageTeachers: false,
    canEditRecords: false,
    canDeleteRecords: false,
    canGenerateReports: false,
    canPostAnnouncements: false,
    isReadOnly: true,
  };

  if (!role) return defaultPermissions;

  switch (role) {
    case 'admin':
    case 'management':
      return {
        canManageAcademics: true,
        canManageStudents: true,
        canManageTeachers: true,
        canEditRecords: true,
        canDeleteRecords: true,
        canGenerateReports: true,
        canPostAnnouncements: true,
        isReadOnly: false,
      };
    case 'teacher':
      return {
        canManageAcademics: true,
        canManageStudents: true,
        canManageTeachers: false, // Teachers can view but maybe not add/remove colleagues
        canEditRecords: true,
        canDeleteRecords: false,
        canGenerateReports: true,
        canPostAnnouncements: true,
        isReadOnly: false,
      };
    case 'student':
    case 'guardian':
      return {
        ...defaultPermissions,
        isReadOnly: true,
      };
    default:
      return defaultPermissions;
  }
};
