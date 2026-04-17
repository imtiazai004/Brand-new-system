import React, { useState, useEffect } from 'react';
import { Megaphone, Plus, Trash2, Tag } from 'lucide-react';
import { socialService } from '../social.service';
import { Announcement, AnnouncementCategory } from '../social.types';
import { useAuth } from '../../auth/auth.hooks';
import { motion, AnimatePresence } from 'motion/react';

const CATEGORIES: AnnouncementCategory[] = ['Holiday', 'Urgent', 'Achievement', 'Event', 'General'];

const categoryColors: Record<AnnouncementCategory, string> = {
  Urgent: 'bg-red-100 text-red-700',
  Holiday: 'bg-blue-100 text-blue-700',
  Achievement: 'bg-green-100 text-green-700',
  Event: 'bg-purple-100 text-purple-700',
  General: 'bg-gray-100 text-gray-700',
};

export const NoticeBoard = ({ schoolId }: { schoolId: string }) => {
  const { user, profile } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'General' as AnnouncementCategory
  });

  useEffect(() => {
    if (!schoolId) return;
    return socialService.subscribeToAnnouncements(schoolId, setAnnouncements);
  }, [schoolId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    await socialService.createAnnouncement(schoolId, {
      ...formData,
      authorId: user.uid,
      authorName: profile?.displayName || 'Admin',
      schoolId
    });
    
    setFormData({ title: '', content: '', category: 'General' });
    setIsAdding(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this announcement?')) {
      await socialService.deleteAnnouncement(schoolId, id);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Megaphone className="w-5 h-5 text-indigo-600" />
          </div>
          <h2 className="text-lg font-semibold text-slate-800 tracking-tight">Notice Board</h2>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Post Update
        </button>
      </div>

      <div className="p-6">
        <AnimatePresence>
          {isAdding && (
            <motion.form
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              onSubmit={handleSubmit}
              className="mb-8 p-4 bg-slate-50 rounded-xl border border-slate-200 overflow-hidden"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Title</label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition outline-none"
                    placeholder="E.g., Winter Break Schedule"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value as AnnouncementCategory })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Content</label>
                  <textarea
                    required
                    value={formData.content}
                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 min-h-[100px] outline-none"
                    placeholder="Details about the update..."
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
                  >
                    Post Now
                  </button>
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="space-y-4">
          {announcements.map((ann) => (
            <div key={ann.id} className="group p-4 border border-slate-100 rounded-xl hover:border-indigo-100 hover:bg-indigo-50/10 transition-all duration-200">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${categoryColors[ann.category]}`}>
                      {ann.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium italic">
                      {ann.createdAt?.toDate?.().toLocaleDateString() || 'Just now'}
                    </span>
                  </div>
                  <h3 className="text-md font-semibold text-slate-800 mb-1">{ann.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{ann.content}</p>
                  <div className="mt-3 text-[11px] text-slate-400">
                    Posted by <span className="font-semibold text-slate-500">{ann.authorName}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(ann.id)}
                  className="p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          
          {announcements.length === 0 && !isAdding && (
            <div className="text-center py-12">
              <div className="p-3 bg-slate-50 rounded-full w-fit mx-auto mb-3">
                <Tag className="w-6 h-6 text-slate-300" />
              </div>
              <p className="text-slate-400 text-sm italic">No announcements yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
