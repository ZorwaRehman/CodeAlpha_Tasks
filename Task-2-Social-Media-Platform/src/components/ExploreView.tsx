import React, { useState } from 'react';
import { useSocial } from '../context/SocialContext';
import { PostCard } from './PostCard';
import { Search, Hash, TrendingUp, X, Sparkles, UserPlus, CheckCircle2 } from 'lucide-react';

export const ExploreView: React.FC = () => {
  const {
    posts,
    trending,
    allUsers,
    selectedTag,
    setSelectedTag,
    searchQuery,
    setSearchQuery,
    toggleFollowUser,
    currentUser,
    setViewingUserId,
    setActiveTab,
    loading,
  } = useSocial();

  const [activeTab, setActiveExploreTab] = useState<'posts' | 'creators'>('posts');

  const filteredUsers = allUsers.filter(u => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.username.toLowerCase().includes(q) || u.bio.toLowerCase().includes(q);
  });

  return (
    <div id="explore-view" className="p-4 md:p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <span>Explore & Discover</span>
        </h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          Find trending code snippets, architectural discussions, and developers
        </p>
      </div>

      {/* Search Input */}
      <div className="relative mb-5">
        <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search by keywords, #hashtags, or usernames..."
          className="w-full pl-10 pr-10 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-3.5 text-zinc-400 hover:text-zinc-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Active Filter Tags */}
      {selectedTag && (
        <div className="flex items-center gap-2 mb-5 p-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 rounded-2xl">
          <Hash className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
            Filtering by topic: #{selectedTag}
          </span>
          <button
            onClick={() => setSelectedTag(null)}
            className="ml-auto text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" /> Clear Filter
          </button>
        </div>
      )}

      {/* Popular Trending Tags Pill Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        <button
          onClick={() => setSelectedTag(null)}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            !selectedTag
              ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-sm'
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
          }`}
        >
          All Topics
        </button>
        {trending.map(t => (
          <button
            key={t.id}
            onClick={() => setSelectedTag(t.tag === selectedTag ? null : t.tag)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
              selectedTag === t.tag
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
            }`}
          >
            <span>#{t.tag}</span>
            <span className="text-[10px] opacity-75">({t.postCount})</span>
          </button>
        ))}
      </div>

      {/* Explore Tabs: Posts | Creators */}
      <div className="flex items-center gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-6">
        <button
          onClick={() => setActiveExploreTab('posts')}
          className={`text-xs font-bold transition-colors ${
            activeTab === 'posts'
              ? 'text-indigo-600 dark:text-indigo-400'
              : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          Top Posts ({posts.length})
        </button>
        <button
          onClick={() => setActiveExploreTab('creators')}
          className={`text-xs font-bold transition-colors ${
            activeTab === 'creators'
              ? 'text-indigo-600 dark:text-indigo-400'
              : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          Developers & Creators ({filteredUsers.length})
        </button>
      </div>

      {/* Content Rendering */}
      {activeTab === 'posts' ? (
        loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-14 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8">
            <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              No matching posts found
            </p>
            <p className="text-xs text-zinc-400 mt-1">Try another search query or select another topic tag.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )
      ) : (
        /* Creators List */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredUsers.map(user => {
            const isFollowing = currentUser ? currentUser.following.includes(user.id) : false;
            const isSelf = currentUser?.id === user.id;

            return (
              <div
                key={user.id}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-4 flex flex-col justify-between shadow-sm"
              >
                <div
                  onClick={() => {
                    setViewingUserId(user.id);
                    setActiveTab('profile');
                  }}
                  className="cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-zinc-100 dark:ring-zinc-800"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-zinc-900 dark:text-white truncate group-hover:underline flex items-center gap-1">
                        {user.name}
                        {user.isVerified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 fill-indigo-500 text-white" />
                        )}
                      </p>
                      <p className="text-xs text-zinc-500 truncate">@{user.username}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-zinc-600 dark:text-zinc-300 line-clamp-2 leading-relaxed">
                    {user.bio}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
                  <span className="text-[11px] text-zinc-500 font-medium">
                    {user.followers.length} followers
                  </span>
                  {!isSelf && (
                    <button
                      onClick={() => toggleFollowUser(user.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        isFollowing
                          ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-rose-50 hover:text-rose-600'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                      }`}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
