import React from 'react';
import { useSocial } from '../context/SocialContext';
import { Search, TrendingUp, UserPlus, UserCheck, Sparkles, CheckCircle2, RefreshCw } from 'lucide-react';

export const RightSidebar: React.FC = () => {
  const {
    currentUser,
    allUsers,
    trending,
    toggleFollowUser,
    setViewingUserId,
    setActiveTab,
    setSelectedTag,
    selectedTag,
    searchQuery,
    setSearchQuery,
    switchUser,
  } = useSocial();

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
    setActiveTab('explore');
  };

  const handleUserClick = (userId: string) => {
    setViewingUserId(userId);
    setActiveTab('profile');
  };

  // Recommended users to follow (excluding current user and already followed)
  const recommendedUsers = allUsers.filter(
    u => u.id !== currentUser?.id && !(currentUser?.following || []).includes(u.id)
  );

  return (
    <aside
      id="right-sidebar"
      className="hidden lg:block w-80 flex-shrink-0 border-l border-zinc-200 dark:border-zinc-800 h-screen sticky top-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md px-5 py-6 overflow-y-auto space-y-6 z-20"
    >
      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
        <input
          id="input-global-search"
          type="text"
          value={searchQuery}
          onChange={e => {
            setSearchQuery(e.target.value);
            if (e.target.value.trim().length > 0) {
              setActiveTab('explore');
            }
          }}
          placeholder="Search posts, tags, people..."
          className="w-full pl-10 pr-4 py-2.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        />
      </div>

      {/* Interactive Switch Profile Card (For review / testing) */}
      <div className="bg-gradient-to-br from-indigo-50/70 to-purple-50/70 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-100 dark:border-indigo-900/40 rounded-3xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" /> Demo User Switcher
          </span>
          <span className="text-[10px] bg-indigo-200/60 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-200 px-2 py-0.5 rounded-full font-bold">
            Live Testing
          </span>
        </div>
        <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mb-2.5 leading-relaxed">
          Switch active accounts instantly to test multi-user follows, comments & live notifications:
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          {allUsers.slice(0, 4).map(u => (
            <button
              key={u.id}
              onClick={() => switchUser(u.id)}
              className={`p-2 rounded-xl text-left border text-[11px] font-semibold transition-all flex items-center gap-2 ${
                u.id === currentUser?.id
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-indigo-300'
              }`}
            >
              <img
                src={u.avatar}
                alt={u.name}
                referrerPolicy="no-referrer"
                className="w-5 h-5 rounded-full object-cover flex-shrink-0"
              />
              <span className="truncate">{u.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Who to follow Widget */}
      <div className="bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-4">
        <h3 className="font-bold text-sm text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <span>Who to follow</span>
        </h3>
        <div className="space-y-3">
          {recommendedUsers.length === 0 ? (
            <p className="text-xs text-zinc-400">You're following everyone on Pulse! 🌟</p>
          ) : (
            recommendedUsers.slice(0, 3).map(user => (
              <div key={user.id} className="flex items-center justify-between gap-2">
                <div
                  onClick={() => handleUserClick(user.id)}
                  className="flex items-center gap-2.5 min-w-0 cursor-pointer group"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-zinc-900 dark:text-white truncate group-hover:underline flex items-center gap-1">
                      {user.name}
                      {user.isVerified && (
                        <CheckCircle2 className="w-3 h-3 text-indigo-500 fill-indigo-500 text-white" />
                      )}
                    </p>
                    <p className="text-[11px] text-zinc-500 truncate">@{user.username}</p>
                  </div>
                </div>

                <button
                  id={`btn-sidebar-follow-${user.id}`}
                  onClick={() => toggleFollowUser(user.id)}
                  className="px-3 py-1.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Follow</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Trending Topics & Hashtags */}
      <div className="bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-4">
        <h3 className="font-bold text-sm text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-indigo-500" />
          <span>Trending in Tech</span>
        </h3>
        <div className="space-y-3">
          {trending.map(item => (
            <div
              key={item.id}
              onClick={() => handleTagClick(item.tag)}
              className={`p-2 rounded-2xl cursor-pointer transition-colors ${
                selectedTag === item.tag
                  ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                  : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <span className="text-[10px] text-zinc-400 block font-medium">
                {item.category}
              </span>
              <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">
                #{item.tag}
              </p>
              <span className="text-[11px] text-zinc-500">
                {item.postCount.toLocaleString()} posts
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Meta */}
      <div className="text-[11px] text-zinc-400 px-2 space-y-1">
        <p>© 2026 Pulse Platform · CodeAlpha Task 2</p>
        <p>Built with React 19, Tailwind CSS, Express.js & TypeScript</p>
      </div>
    </aside>
  );
};
