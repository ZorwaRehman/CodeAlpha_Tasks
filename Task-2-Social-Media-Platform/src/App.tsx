import React, { useState } from 'react';
import { SocialProvider, useSocial } from './context/SocialContext';
import { Sidebar } from './components/Sidebar';
import { RightSidebar } from './components/RightSidebar';
import { CreatePostBox } from './components/CreatePostBox';
import { PostCard } from './components/PostCard';
import { UserProfileView } from './components/UserProfileView';
import { NotificationsView } from './components/NotificationsView';
import { ExploreView } from './components/ExploreView';
import { Toast } from './components/Toast';
import { Sparkles, Bookmark, Users, Flame, RefreshCw } from 'lucide-react';

const MainLayout: React.FC = () => {
  const {
    activeTab,
    feedFilter,
    setFeedFilter,
    posts,
    loading,
    refreshPosts,
    viewingUserId,
  } = useSocial();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refreshPosts();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex justify-center font-sans antialiased selection:bg-indigo-500 selection:text-white">
      <div className="w-full max-w-7xl flex">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Central Content Column */}
        <main className="flex-1 min-w-0 border-r border-zinc-200 dark:border-zinc-800 min-h-screen max-w-3xl">
          {/* Feed View */}
          {activeTab === 'feed' && (
            <div>
              {/* Top Sticky Feed Header with For You / Following switcher */}
              <header className="sticky top-0 z-20 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <button
                    id="btn-feed-for-you"
                    onClick={() => setFeedFilter('all')}
                    className={`text-sm font-bold pb-1 transition-all relative ${
                      feedFilter === 'all'
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Flame className="w-4 h-4" /> For You
                    </span>
                    {feedFilter === 'all' && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
                    )}
                  </button>

                  <button
                    id="btn-feed-following"
                    onClick={() => setFeedFilter('following')}
                    className={`text-sm font-bold pb-1 transition-all relative ${
                      feedFilter === 'following'
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4" /> Following
                    </span>
                    {feedFilter === 'following' && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
                    )}
                  </button>
                </div>

                <button
                  id="btn-refresh-feed"
                  onClick={handleManualRefresh}
                  className={`p-2 rounded-xl text-zinc-500 hover:text-indigo-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ${
                    isRefreshing ? 'animate-spin text-indigo-600' : ''
                  }`}
                  title="Refresh feed"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </header>

              {/* Feed Body */}
              <div className="p-4 md:p-6">
                {/* Create Post Widget */}
                <CreatePostBox />

                {/* Posts Stream */}
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-3" />
                    <p className="text-xs font-medium">Loading posts...</p>
                  </div>
                ) : posts.length === 0 ? (
                  <div className="text-center py-16 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8">
                    <Sparkles className="w-8 h-8 text-indigo-500 mx-auto mb-2 opacity-60" />
                    <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-200">
                      {feedFilter === 'following'
                        ? 'No posts from people you follow yet'
                        : 'Your feed is clean and ready'}
                    </h3>
                    <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                      {feedFilter === 'following'
                        ? 'Follow some creators in the right sidebar or switch to the For You tab to discover content.'
                        : 'Be the first to share an update, architecture tip, or interactive poll!'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {posts.map(post => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Explore View */}
          {activeTab === 'explore' && <ExploreView />}

          {/* Notifications View */}
          {activeTab === 'notifications' && <NotificationsView />}

          {/* Bookmarks / Saved Posts View */}
          {activeTab === 'bookmarks' && (
            <div className="p-4 md:p-6 max-w-3xl mx-auto">
              <div className="mb-6">
                <h1 className="text-xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-indigo-600 fill-indigo-600" />
                  <span>Saved Bookmarks</span>
                </h1>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Your private collection of saved code snippets, threads, and insights
                </p>
              </div>

              {posts.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8">
                  <Bookmark className="w-8 h-8 text-zinc-400 mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    No saved posts yet
                  </p>
                  <p className="text-xs text-zinc-400 mt-1">
                    Click the bookmark icon on any post to save it for quick reference later.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {posts.map(post => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* User Profile View */}
          {activeTab === 'profile' && <UserProfileView userId={viewingUserId} />}
        </main>

        {/* Right Sidebar */}
        <RightSidebar />
      </div>

      {/* Global Toast Alert */}
      <Toast />
    </div>
  );
};

export function App() {
  return (
    <SocialProvider>
      <MainLayout />
    </SocialProvider>
  );
}

export default App;
