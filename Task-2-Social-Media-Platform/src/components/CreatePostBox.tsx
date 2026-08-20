import React, { useState } from 'react';
import { useSocial } from '../context/SocialContext';
import { Image, BarChart2, Hash, X, Sparkles, Send } from 'lucide-react';

export const CreatePostBox: React.FC = () => {
  const { currentUser, createPost } = useSocial();
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [showMediaInput, setShowMediaInput] = useState(false);
  const [showPollInput, setShowPollInput] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [submitting, setSubmitting] = useState(false);

  if (!currentUser) return null;

  const handleAddPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, '']);
    }
  };

  const handlePollOptionChange = (idx: number, val: string) => {
    const updated = [...pollOptions];
    updated[idx] = val;
    setPollOptions(updated);
  };

  const handleRemovePollOption = (idx: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== idx));
    }
  };

  const handleInsertTag = (tag: string) => {
    if (!content.includes(`#${tag}`)) {
      setContent(prev => `${prev.trim()} #${tag} `);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !mediaUrl) return;

    setSubmitting(true);
    let pollPayload = undefined;
    if (showPollInput && pollQuestion.trim() && pollOptions.filter(o => o.trim()).length >= 2) {
      pollPayload = {
        question: pollQuestion.trim(),
        options: pollOptions.filter(o => o.trim()),
      };
    }

    const success = await createPost(content, mediaUrl || undefined, pollPayload);
    if (success) {
      setContent('');
      setMediaUrl('');
      setShowMediaInput(false);
      setShowPollInput(false);
      setPollQuestion('');
      setPollOptions(['', '']);
    }
    setSubmitting(false);
  };

  const popularTags = ['codealpha', 'fullstack', 'react', 'webdev', 'uiux'];

  return (
    <div
      id="create-post-box"
      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-sm mb-6 transition-all"
    >
      <form onSubmit={handleSubmit}>
        <div className="flex gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            referrerPolicy="no-referrer"
            className="w-11 h-11 rounded-full object-cover ring-2 ring-indigo-500/20 flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <textarea
              id="input-post-content"
              rows={3}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="What's happening in your tech sphere? Share code, ideas, or questions..."
              className="w-full bg-transparent border-none resize-none focus:outline-none text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 text-base leading-relaxed"
            />

            {/* Media URL Input & Preview */}
            {showMediaInput && (
              <div className="mt-3 p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-2xl border border-zinc-200 dark:border-zinc-700/60">
                <div className="flex items-center gap-2">
                  <input
                    id="input-media-url"
                    type="url"
                    value={mediaUrl}
                    onChange={e => setMediaUrl(e.target.value)}
                    placeholder="Paste image URL (https://images.unsplash.com/...)"
                    className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setShowMediaInput(false);
                      setMediaUrl('');
                    }}
                    className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {mediaUrl && (
                  <div className="mt-2 relative rounded-xl overflow-hidden max-h-56 bg-zinc-950">
                    <img
                      src={mediaUrl}
                      alt="Upload Preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={() => {}}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Poll Creator */}
            {showPollInput && (
              <div className="mt-3 p-4 bg-zinc-50 dark:bg-zinc-800/60 rounded-2xl border border-zinc-200 dark:border-zinc-700/60 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                    <BarChart2 className="w-3.5 h-3.5" /> Create an Interactive Poll
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPollInput(false)}
                    className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <input
                  type="text"
                  value={pollQuestion}
                  onChange={e => setPollQuestion(e.target.value)}
                  placeholder="Ask a question for your poll..."
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-sm font-medium text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <div className="space-y-2 mt-1">
                  {pollOptions.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={opt}
                        onChange={e => handlePollOptionChange(idx, e.target.value)}
                        placeholder={`Option ${idx + 1}`}
                        className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      {pollOptions.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePollOption(idx)}
                          className="text-zinc-400 hover:text-rose-500 p-1"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {pollOptions.length < 4 && (
                  <button
                    type="button"
                    onClick={handleAddPollOption}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline self-start mt-1"
                  >
                    + Add Option ({4 - pollOptions.length} remaining)
                  </button>
                )}
              </div>
            )}

            {/* Quick Hashtag suggestions */}
            <div className="flex items-center gap-1.5 flex-wrap mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mr-1">
                Topics:
              </span>
              {popularTags.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleInsertTag(tag)}
                  className="px-2.5 py-1 text-xs rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-zinc-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors"
                >
                  #{tag}
                </button>
              ))}
            </div>

            {/* Bottom Actions Toolbar */}
            <div className="flex items-center justify-between mt-3 pt-2">
              <div className="flex items-center gap-1 text-zinc-500">
                <button
                  type="button"
                  id="btn-attach-image"
                  onClick={() => setShowMediaInput(!showMediaInput)}
                  className={`p-2 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 transition-colors ${
                    showMediaInput ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40' : ''
                  }`}
                  title="Attach Image"
                >
                  <Image className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  id="btn-create-poll"
                  onClick={() => setShowPollInput(!showPollInput)}
                  className={`p-2 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 transition-colors ${
                    showPollInput ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40' : ''
                  }`}
                  title="Create Poll"
                >
                  <BarChart2 className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span className={`text-xs ${content.length > 250 ? 'text-rose-500 font-bold' : 'text-zinc-400'}`}>
                  {content.length}/280
                </span>
                <button
                  type="submit"
                  id="btn-submit-post"
                  disabled={submitting || (!content.trim() && !mediaUrl)}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl shadow-md shadow-indigo-600/20 flex items-center gap-2 transition-all"
                >
                  {submitting ? (
                    <span className="animate-spin text-xs">🌀</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Post</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
