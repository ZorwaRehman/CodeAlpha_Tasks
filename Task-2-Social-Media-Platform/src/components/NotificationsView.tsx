import React, { useEffect, useState } from 'react';
import { useSocial } from '../context/SocialContext';
import { Heart, MessageCircle, UserPlus, Repeat2, Bell, Check, Sparkles } from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const { notifications, markNotificationsAsRead, setViewingUserId, setActiveTab } = useSocial();
  const [filter, setFilter] = useState<'all' | 'likes' | 'comments' | 'follows'>('all');

  useEffect(() => {
    markNotificationsAsRead();
  }, []);

  const filtered = notifications.filter(n => {
    if (filter === 'likes') return n.type === 'like';
    if (filter === 'comments') return n.type === 'comment';
    if (filter === 'follows') return n.type === 'follow';
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />;
      case 'comment':
        return <MessageCircle className="w-4 h-4 text-indigo-500 fill-indigo-500" />;
      case 'follow':
        return <UserPlus className="w-4 h-4 text-emerald-500" />;
      case 'repost':
        return <Repeat2 className="w-4 h-4 text-violet-500" />;
      default:
        return <Bell className="w-4 h-4 text-indigo-500" />;
    }
  };

  const formatTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / (1000 * 60));
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div id="notifications-view" className="p-4 md:p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-600" />
            <span>Activity & Notifications</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Stay updated with your likes, comments, and new followers
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-zinc-200 dark:border-zinc-800 pb-3">
        {(['all', 'likes', 'comments', 'follows'] as const).map(tab => (
          <button
            key={tab}
            id={`filter-notif-${tab}`}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold capitalize transition-all ${
              filter === tab
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8">
            <Sparkles className="w-8 h-8 text-indigo-500 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              No notifications yet in this filter
            </p>
            <p className="text-xs text-zinc-400 mt-1">
              When other community members interact with your posts, you will see it here.
            </p>
          </div>
        ) : (
          filtered.map(item => (
            <div
              key={item.id}
              onClick={() => {
                setViewingUserId(item.actor.id);
                setActiveTab('profile');
              }}
              className={`flex items-start gap-4 p-4 rounded-3xl border transition-all cursor-pointer ${
                item.isRead
                  ? 'bg-white dark:bg-zinc-900/70 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                  : 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900/50'
              }`}
            >
              <div className="p-2.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex-shrink-0">
                {getIcon(item.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <img
                    src={item.actor.avatar}
                    alt={item.actor.name}
                    referrerPolicy="no-referrer"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="font-bold text-xs text-zinc-900 dark:text-white">
                    {item.actor.name}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {item.type === 'like' && 'liked your post'}
                    {item.type === 'comment' && 'commented on your post'}
                    {item.type === 'follow' && 'started following you'}
                    {item.type === 'repost' && 'reposted your thought'}
                  </span>
                  <span className="text-[10px] text-zinc-400 ml-auto">
                    {formatTime(item.createdAt)}
                  </span>
                </div>

                {item.commentSnippet && (
                  <p className="mt-1.5 text-xs text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800/80 p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-700/60 font-medium">
                    "{item.commentSnippet}"
                  </p>
                )}

                {item.postSnippet && !item.commentSnippet && (
                  <p className="mt-1 text-xs text-zinc-400 italic line-clamp-1">
                    "{item.postSnippet}"
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
