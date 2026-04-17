import { 
  collection, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  query, 
  orderBy, 
  deleteDoc, 
  doc, 
  updateDoc 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { Announcement, SchoolEvent, MediaItem } from './social.types';

export const socialService = {
  // Announcements
  subscribeToAnnouncements(schoolId: string, callback: (announcements: Announcement[]) => void) {
    const q = query(
      collection(db, 'schools', schoolId, 'announcements'),
      orderBy('createdAt', 'desc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Announcement));
      callback(data);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `schools/${schoolId}/announcements`);
    });
  },

  async createAnnouncement(schoolId: string, data: Omit<Announcement, 'id' | 'createdAt'>) {
    try {
      await addDoc(collection(db, 'schools', schoolId, 'announcements'), {
        ...data,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `schools/${schoolId}/announcements`);
    }
  },

  async deleteAnnouncement(schoolId: string, id: string) {
    try {
      await deleteDoc(doc(db, 'schools', schoolId, 'announcements', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `schools/${schoolId}/announcements/${id}`);
    }
  },

  // Events
  subscribeToEvents(schoolId: string, callback: (events: SchoolEvent[]) => void) {
    const q = query(
      collection(db, 'schools', schoolId, 'events'),
      orderBy('date', 'asc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SchoolEvent));
      callback(data);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `schools/${schoolId}/events`);
    });
  },

  async createEvent(schoolId: string, data: Omit<SchoolEvent, 'id'>) {
    try {
      await addDoc(collection(db, 'schools', schoolId, 'events'), data);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `schools/${schoolId}/events`);
    }
  },

  async deleteEvent(schoolId: string, id: string) {
    try {
      await deleteDoc(doc(db, 'schools', schoolId, 'events', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `schools/${schoolId}/events/${id}`);
    }
  },

  // Media
  subscribeToMedia(schoolId: string, callback: (media: MediaItem[]) => void) {
    const q = query(collection(db, 'schools', schoolId, 'media'));
    
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MediaItem));
      callback(data);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `schools/${schoolId}/media`);
    });
  },

  async addMedia(schoolId: string, data: Omit<MediaItem, 'id'>) {
    try {
      await addDoc(collection(db, 'schools', schoolId, 'media'), data);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `schools/${schoolId}/media`);
    }
  },

  async deleteMedia(schoolId: string, id: string) {
    try {
      await deleteDoc(doc(db, 'schools', schoolId, 'media', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `schools/${schoolId}/media/${id}`);
    }
  }
};
