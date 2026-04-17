import { Timestamp } from 'firebase/firestore';

export type AnnouncementCategory = 'Holiday' | 'Urgent' | 'Achievement' | 'Event' | 'General';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: AnnouncementCategory;
  authorId: string;
  authorName?: string;
  createdAt: any;
  schoolId: string;
}

export interface SchoolEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  location: string;
  schoolId: string;
}

export interface MediaItem {
  id: string;
  url: string;
  thumbnailUrl?: string;
  type: 'image' | 'video';
  caption: string;
  schoolId: string;
}
