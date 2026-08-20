import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Post, Comment, Notification, TrendingTopic } from '../types';

interface SocialContextType {
  currentUser: User | null;
  allUsers: User[];
  posts: Post[];
  trending: TrendingTopic[];
  notifications: Notification[];
  unreadCount: number;
  activeTab: 'feed' | 'explore' | 'notifications' | 'bookmarks' | 'profile';
  setActiveTab: (tab: 'feed' | 'explore' | 'notifications' | 'bookmarks' | 'profile') => void;
  feedFilter: 'all' | 'following';
  setFeedFilter: (filter: 'all' | 'following') => void;
  viewingUserId: string | null;
  setViewingUserId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
  loading: boolean;
  
  // Actions
  refreshPosts: () => Promise<void>;
  createPost: (content: string, mediaUrl?: string, poll?: { question: string; options: string[] }) => Promise<boolean>;
  deletePost: (postId: string) => Promise<boolean>;
  toggleLikePost: (postId: string) => Promise<void>;
  toggleBookmarkPost: (postId: string) => Promise<void>;
  votePoll: (postId: string, optionId: string) => Promise<void>;
  addComment: (postId: string, content: string, parentId?: string | null) => Promise<Comment | null>;
  toggleLikeComment: (commentId: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<boolean>;
  toggleFollowUser: (targetUserId: string) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
  switchUser: (userId: string) => void;
  markNotificationsAsRead: () => Promise<void>;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const SocialContext = createContext<SocialContextType | undefined>(undefined);

export const SocialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [trending, setTrending] = useState<TrendingTopic[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<'feed' | 'explore' | 'notifications' | 'bookmarks' | 'profile'>('feed');
  const [feedFilter, setFeedFilter] = useState<'all' | 'following'>('all');
  const [viewingUserId, setViewingUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch Users
  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const users: User[] = await res.json();
        setAllUsers(users);
        if (!currentUser && users.length > 0) {
          setCurrentUser(users[0]); // Default to Zorwa Rehman
        } else if (currentUser) {
          const updated = users.find(u => u.id === currentUser.id);
          if (updated) setCurrentUser(updated);
        }
      }
    } catch (e) {
      console.error('Error fetching users:', e);
    }
  }, [currentUser]);

  // Fetch Trending
  const fetchTrending = useCallback(async () => {
    try {
      const res = await fetch('/api/trending');
      if (res.ok) {
        const data = await res.json();
        setTrending(data);
      }
    } catch (e) {
      console.error('Error fetching trending:', e);
    }
  }, []);

  // Fetch Notifications
  const fetchNotifications = useCallback(async () => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/notifications?userId=${currentUser.id}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (e) {
      console.error('Error fetching notifications:', e);
    }
  }, [currentUser]);

  // Fetch Posts based on current active view/filters
  const refreshPosts = useCallback(async () => {
    if (!currentUser) return;
    try {
      setLoading(true);
      let url = '/api/posts?';
      const params = new URLSearchParams();

      if (activeTab === 'feed') {
        params.append('feedType', feedFilter);
        params.append('currentUserId', currentUser.id);
      } else if (activeTab === 'bookmarks') {
        params.append('feedType', 'saved');
        params.append('currentUserId', currentUser.id);
      } else if (activeTab === 'profile') {
        params.append('feedType', 'user');
        params.append('targetUserId', viewingUserId || currentUser.id);
      } else if (activeTab === 'explore') {
        if (selectedTag) {
          params.append('tag', selectedTag);
        }
        if (searchQuery) {
          params.append('search', searchQuery);
        }
      }

      url += params.toString();
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (e) {
      console.error('Error loading posts:', e);
    } finally {
      setLoading(false);
    }
  }, [currentUser, activeTab, feedFilter, viewingUserId, selectedTag, searchQuery]);

  // Initial Load
  useEffect(() => {
    fetchUsers();
    fetchTrending();
  }, []);

  // Reload posts & notifications on state shifts
  useEffect(() => {
    if (currentUser) {
      refreshPosts();
      fetchNotifications();
    }
  }, [currentUser?.id, activeTab, feedFilter, viewingUserId, selectedTag, searchQuery]);

  // Post Actions
  const createPost = async (content: string, mediaUrl?: string, poll?: { question: string; options: string[] }) => {
    if (!currentUser) return false;
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          content,
          mediaUrl: mediaUrl || undefined,
          poll: poll || undefined,
        }),
      });
      if (res.ok) {
        await refreshPosts();
        await fetchTrending();
        showToast('✨ Post published to feed!');
        return true;
      }
    } catch (e) {
      console.error('Failed to create post', e);
    }
    return false;
  };

  const deletePost = async (postId: string) => {
    if (!currentUser) return false;
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id }),
      });
      if (res.ok) {
        setPosts(prev => prev.filter(p => p.id !== postId));
        showToast('🗑️ Post deleted');
        return true;
      }
    } catch (e) {
      console.error('Failed to delete post', e);
    }
    return false;
  };

  const toggleLikePost = async (postId: string) => {
    if (!currentUser) return;
    // Optimistic UI update
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const isLiked = p.likes.includes(currentUser.id);
          const newLikes = isLiked
            ? p.likes.filter(id => id !== currentUser.id)
            : [...p.likes, currentUser.id];
          return { ...p, likes: newLikes };
        }
        return p;
      })
    );

    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id }),
      });
      if (res.ok) {
        const { post, isLiked } = await res.json();
        setPosts(prev => prev.map(p => (p.id === postId ? { ...p, likes: post.likes } : p)));
        // Update user liked posts
        setCurrentUser(prev => {
          if (!prev) return null;
          const liked = prev.likedPosts || [];
          return {
            ...prev,
            likedPosts: isLiked ? [...liked, postId] : liked.filter(id => id !== postId),
          };
        });
      }
    } catch (e) {
      console.error('Failed to toggle like', e);
      refreshPosts();
    }
  };

  const toggleBookmarkPost = async (postId: string) => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/posts/${postId}/bookmark`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id }),
      });
      if (res.ok) {
        const { isSaved, user } = await res.json();
        setCurrentUser(user);
        showToast(isSaved ? '🔖 Post saved to Bookmarks' : 'Removed from Bookmarks');
        if (activeTab === 'bookmarks') {
          refreshPosts();
        }
      }
    } catch (e) {
      console.error('Failed to toggle bookmark', e);
    }
  };

  const votePoll = async (postId: string, optionId: string) => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/posts/${postId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optionId, userId: currentUser.id }),
      });
      if (res.ok) {
        const updated = await res.json();
        setPosts(prev => prev.map(p => (p.id === postId ? updated : p)));
        showToast('🗳️ Vote recorded!');
      }
    } catch (e) {
      console.error('Failed to vote', e);
    }
  };

  const addComment = async (postId: string, content: string, parentId?: string | null) => {
    if (!currentUser) return null;
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id, content, parentId }),
      });
      if (res.ok) {
        const comment: Comment = await res.json();
        setPosts(prev =>
          prev.map(p => {
            if (p.id === postId) {
              const currentComments = p.comments || [];
              return {
                ...p,
                commentCount: p.commentCount + 1,
                comments: [...currentComments, comment],
              };
            }
            return p;
          })
        );
        showToast('💬 Comment posted');
        return comment;
      }
    } catch (e) {
      console.error('Failed to post comment', e);
    }
    return null;
  };

  const toggleLikeComment = async (commentId: string) => {
    if (!currentUser) return;
    try {
      await fetch(`/api/comments/${commentId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id }),
      });
      refreshPosts();
    } catch (e) {
      console.error('Failed to like comment', e);
    }
  };

  const deleteComment = async (commentId: string) => {
    if (!currentUser) return false;
    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id }),
      });
      if (res.ok) {
        refreshPosts();
        showToast('Comment deleted');
        return true;
      }
    } catch (e) {
      console.error('Failed to delete comment', e);
    }
    return false;
  };

  const toggleFollowUser = async (targetUserId: string) => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/users/${targetUserId}/follow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentUserId: currentUser.id }),
      });
      if (res.ok) {
        const { isFollowing, targetUser, currentUser: updatedCurrent } = await res.json();
        setCurrentUser(updatedCurrent);
        setAllUsers(prev => prev.map(u => (u.id === targetUser.id ? targetUser : u.id === updatedCurrent.id ? updatedCurrent : u)));
        showToast(isFollowing ? `✨ Following @${targetUser.username}` : `Unfollowed @${targetUser.username}`);
        if (feedFilter === 'following') {
          refreshPosts();
        }
      }
    } catch (e) {
      console.error('Failed to follow/unfollow', e);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!currentUser) return false;
    try {
      const res = await fetch(`/api/users/${currentUser.id}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const updated = await res.json();
        setCurrentUser(updated);
        setAllUsers(prev => prev.map(u => (u.id === updated.id ? updated : u)));
        refreshPosts();
        showToast('✅ Profile updated successfully');
        return true;
      }
    } catch (e) {
      console.error('Failed to update profile', e);
    }
    return false;
  };

  const switchUser = (userId: string) => {
    const target = allUsers.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
      showToast(`Switched active profile to @${target.username}`);
    }
  };

  const markNotificationsAsRead = async () => {
    if (!currentUser) return;
    try {
      await fetch('/api/notifications/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id }),
      });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (e) {
      console.error('Failed to mark notifications read', e);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <SocialContext.Provider
      value={{
        currentUser,
        allUsers,
        posts,
        trending,
        notifications,
        unreadCount,
        activeTab,
        setActiveTab,
        feedFilter,
        setFeedFilter,
        viewingUserId,
        setViewingUserId,
        searchQuery,
        setSearchQuery,
        selectedTag,
        setSelectedTag,
        loading,
        refreshPosts,
        createPost,
        deletePost,
        toggleLikePost,
        toggleBookmarkPost,
        votePoll,
        addComment,
        toggleLikeComment,
        deleteComment,
        toggleFollowUser,
        updateProfile,
        switchUser,
        markNotificationsAsRead,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </SocialContext.Provider>
  );
};

export const useSocial = () => {
  const context = useContext(SocialContext);
  if (!context) {
    throw new Error('useSocial must be used within a SocialProvider');
  }
  return context;
};
