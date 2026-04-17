import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Plus, Trash2, Video, Grid, UploadCloud, Loader2 } from 'lucide-react';
import { socialService } from '../social.service';
import { MediaItem } from '../social.types';

export const MediaLibrary = ({ schoolId }: { schoolId: string }) => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!schoolId) return;
    return socialService.subscribeToMedia(schoolId, setMedia);
  }, [schoolId]);

  const handleMockUpload = async () => {
    setIsUploading(true);
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Random stock image
    const keywords = ['school', 'children', 'classroom', 'sports', 'graduation'];
    const random = keywords[Math.floor(Math.random() * keywords.length)];
    const id = Math.floor(Math.random() * 1000);
    
    await socialService.addMedia(schoolId, {
      url: `https://picsum.photos/seed/${random}-${id}/800/600`,
      type: 'image',
      caption: `Un-captioned ${random} photo`,
      schoolId
    });
    
    setIsUploading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Permanently delete this media from gallery?')) {
      await socialService.deleteMedia(schoolId, id);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 rounded-lg">
            <ImageIcon className="w-5 h-5 text-amber-600" />
          </div>
          <h2 className="text-lg font-semibold text-slate-800 tracking-tight">Media Library</h2>
        </div>
        <button
          onClick={handleMockUpload}
          disabled={isUploading}
          className="flex items-center gap-2 px-3 py-1.5 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition shadow-sm disabled:opacity-50"
        >
          {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Add Photo
        </button>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {/* Upload Placeholder */}
          <button
            onClick={handleMockUpload}
            disabled={isUploading}
            className="aspect-square border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-amber-300 hover:bg-amber-50/50 transition-all group"
          >
            <div className="p-2 bg-slate-50 rounded-full group-hover:bg-white transition shadow-sm">
              <UploadCloud className="w-5 h-5 text-slate-400 group-hover:text-amber-500" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-amber-600">Upload</span>
          </button>

          {media.map((item) => (
            <div key={item.id} className="relative aspect-square rounded-2xl overflow-hidden group border border-slate-100">
              <img
                src={item.url}
                alt={item.caption}
                className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center gap-2">
                <div className="absolute top-2 left-2 p-1 bg-white/20 backdrop-blur-md rounded-lg">
                  {item.type === 'video' ? <Video className="w-3 h-3 text-white" /> : <ImageIcon className="w-3 h-3 text-white" />}
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 bg-red-500/20 hover:bg-red-500 backdrop-blur-md rounded-full text-white transition transform hover:scale-110"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {media.length === 0 && !isUploading && (
          <div className="text-center py-12 col-span-full">
            <div className="p-3 bg-slate-50 rounded-full w-fit mx-auto mb-3">
              <Grid className="w-6 h-6 text-slate-300" />
            </div>
            <p className="text-slate-400 text-sm italic">Gallery is empty.</p>
          </div>
        )}
      </div>
    </div>
  );
};
