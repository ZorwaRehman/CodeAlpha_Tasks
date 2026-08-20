import React from 'react';
import { useSocial } from '../context/SocialContext';
import { Sparkles } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useSocial();

  if (!toastMessage) return null;

  return (
    <div
      id="toast-notification"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-zinc-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-zinc-800 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="w-8 h-8 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
        <Sparkles className="w-4 h-4" />
      </div>
      <span className="text-sm font-medium tracking-wide">{toastMessage}</span>
    </div>
  );
};
