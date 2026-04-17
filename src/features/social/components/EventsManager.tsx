import React, { useState, useEffect } from 'react';
import { CalendarDays, Plus, MapPin, Trash2, Calendar } from 'lucide-react';
import { socialService } from '../social.service';
import { SchoolEvent } from '../social.types';
import { motion, AnimatePresence } from 'motion/react';

export const EventsManager = ({ schoolId }: { schoolId: string }) => {
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    description: '',
    location: ''
  });

  useEffect(() => {
    if (!schoolId) return;
    return socialService.subscribeToEvents(schoolId, setEvents);
  }, [schoolId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await socialService.createEvent(schoolId, {
      ...formData,
      schoolId
    });
    setFormData({ title: '', date: '', description: '', location: '' });
    setIsAdding(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Remove this event from calendar?')) {
      await socialService.deleteEvent(schoolId, id);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-100 rounded-lg">
            <CalendarDays className="w-5 h-5 text-rose-600" />
          </div>
          <h2 className="text-lg font-semibold text-slate-800 tracking-tight">Events Calendar</h2>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-3 py-1.5 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Event
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
              className="mb-8 p-4 bg-slate-50 rounded-xl border border-slate-200 overflow-hidden space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Event Title</label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                    placeholder="Annual Science Fair"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Date</label>
                  <input
                    required
                    type="date"
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Location</label>
                <input
                  required
                  type="text"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="School Main Hall"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Description</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-rose-500 min-h-[80px]"
                  placeholder="Details about the event..."
                />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700">Save Event</button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="space-y-3">
          {events.map((event) => (
            <div key={event.id} className="group flex flex-col md:flex-row md:items-center gap-4 p-4 border border-slate-100 rounded-xl hover:bg-rose-50/10 hover:border-rose-100 transition">
              <div className="flex flex-col items-center justify-center p-3 bg-rose-50 rounded-lg min-w-[80px]">
                <span className="text-[10px] uppercase font-bold text-rose-400">
                  {new Date(event.date).toLocaleDateString('default', { month: 'short' })}
                </span>
                <span className="text-xl font-black text-rose-600">
                  {new Date(event.date).getDate()}
                </span>
              </div>
              
              <div className="flex-1">
                <h3 className="font-bold text-slate-800">{event.title}</h3>
                <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 rounded-md">
                   <Calendar className="w-3.5 h-3.5" />
                   {new Date(event.date).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {event.location}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-600">{event.description}</p>
              </div>

              <button
                onClick={() => handleDelete(event.id)}
                className="self-end md:self-auto p-2 text-slate-300 hover:text-red-500 md:opacity-0 md:group-hover:opacity-100 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {events.length === 0 && !isAdding && (
            <div className="text-center py-12">
              <div className="p-3 bg-slate-50 rounded-full w-fit mx-auto mb-3">
                <CalendarDays className="w-6 h-6 text-slate-300" />
              </div>
              <p className="text-slate-400 text-sm italic">No upcoming events.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
