import React, { useState } from 'react';
import { Sparkles, Send, Loader2, Copy, Check, RefreshCw } from 'lucide-react';
import { generateSocialPost } from '../../../lib/ai';
import { socialService } from '../social.service';
import { useAuth } from '../../auth/auth.hooks';
import { motion, AnimatePresence } from 'motion/react';

export const SmartPostGenerator = ({ schoolId }: { schoolId: string }) => {
  const { user, profile } = useAuth();
  const [notes, setNotes] = useState('');
  const [generatedPost, setGeneratedPost] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!notes.trim()) return;
    setIsGenerating(true);
    try {
      const post = await generateSocialPost(notes);
      setGeneratedPost(post);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = async () => {
    if (!generatedPost || !user) return;
    setIsPublishing(true);
    try {
      await socialService.createAnnouncement(schoolId, {
        title: 'Social Update',
        content: generatedPost,
        category: 'General',
        authorId: user.uid,
        authorName: profile?.displayName || 'AI Assistant',
        schoolId
      });
      setGeneratedPost('');
      setNotes('');
    } catch (error) {
      console.error(error);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPost);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-gradient-to-r from-indigo-50/50 to-white">
        <div className="p-2 bg-indigo-600 rounded-lg">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-800 tracking-tight">Smart Post Generator</h2>
          <p className="text-xs text-slate-500">Transform notes into professional updates</p>
        </div>
      </div>

      <div className="p-6 flex flex-col gap-6 flex-1">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Raw Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="E.g., Grade 10 won the regional football trophy today. Coach Smith is very proud."
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition outline-none min-h-[120px] text-sm resize-none"
          />
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !notes.trim()}
            className="mt-2 flex items-center justify-center gap-2 w-full py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            {isGenerating ? 'Generating...' : 'Generate AI Post'}
          </button>
        </div>

        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">AI Generated Content</label>
            {generatedPost && (
              <button
                onClick={handleCopy}
                className="text-xs text-indigo-600 font-semibold flex items-center gap-1 hover:text-indigo-700"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            )}
          </div>
          
          <div className="relative flex-1 bg-slate-50 border border-dashed border-slate-200 rounded-xl p-4 min-h-[150px]">
            <AnimatePresence mode="wait">
              {generatedPost ? (
                <motion.div
                  key="content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap"
                >
                  {generatedPost}
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm italic p-6 text-center"
                >
                   AI generated content will appear here...
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={handlePublish}
            disabled={!generatedPost || isPublishing}
            className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-black transition disabled:opacity-50"
          >
            {isPublishing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Publish to Feed
          </button>
        </div>
      </div>
    </div>
  );
};
