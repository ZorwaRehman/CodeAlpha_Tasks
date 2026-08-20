import fs from 'fs';
import path from 'path';
import { User, Post, Comment, Notification, TrendingTopic } from '../src/types';

interface SocialDatabaseData {
  users: User[];
  posts: Post[];
  comments: Comment[];
  notifications: Notification[];
  trending: TrendingTopic[];
}

const DB_FILE = path.join(process.cwd(), 'data', 'social_db.json');

const INITIAL_USERS: User[] = [
  {
    id: 'u-zorwa',
    username: 'zorwarehman',
    name: 'Zorwa Rehman',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    bio: 'Full-Stack Developer & UI Craftsman. Building modern web experiences with React, TypeScript, Express, and Tailwind CSS. 💻✨',
    location: 'Lahore, Pakistan',
    website: 'https://github.com/ZorwaRehman',
    joinedDate: 'Joined August 2024',
    isVerified: true,
    following: ['u-alex', 'u-sarah', 'u-marcus'],
    followers: ['u-alex', 'u-elena', 'u-sarah', 'u-david', 'u-maya'],
    savedPosts: ['p-2'],
    likedPosts: ['p-1', 'p-2', 'p-3'],
  },
  {
    id: 'u-alex',
    username: 'alexdev',
    name: 'Alex Rivera',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
    bio: 'Senior Frontend Architect @ TechPulse. Exploring distributed systems, React Server Components & WebGL shaders.',
    location: 'San Francisco, CA',
    website: 'https://alexrivera.codes',
    joinedDate: 'Joined March 2023',
    isVerified: true,
    following: ['u-zorwa', 'u-sarah'],
    followers: ['u-zorwa', 'u-marcus', 'u-david'],
    savedPosts: ['p-1'],
    likedPosts: ['p-1', 'p-4'],
  },
  {
    id: 'u-sarah',
    username: 'sarahdesigns',
    name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=80',
    bio: 'Product Designer & Design Systems advocate. Obsessed with micro-interactions, accessibility, and high-fidelity prototypes. 🎨',
    location: 'London, UK',
    website: 'https://sarahchen.design',
    joinedDate: 'Joined January 2024',
    isVerified: true,
    following: ['u-zorwa', 'u-alex', 'u-elena'],
    followers: ['u-zorwa', 'u-alex', 'u-marcus'],
    savedPosts: ['p-3'],
    likedPosts: ['p-1', 'p-2'],
  },
  {
    id: 'u-elena',
    username: 'elenarostova',
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
    bio: 'AI Engineer & Researcher. Building autonomous agents, LLM pipelines, and multimodal creative tools. 🤖',
    location: 'Berlin, Germany',
    website: 'https://elena-ai.dev',
    joinedDate: 'Joined May 2024',
    isVerified: false,
    following: ['u-zorwa', 'u-alex'],
    followers: ['u-zorwa', 'u-sarah'],
    savedPosts: [],
    likedPosts: ['p-2'],
  },
  {
    id: 'u-marcus',
    username: 'marcustech',
    name: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&auto=format&fit=crop&q=80',
    bio: 'Full-Stack Node.js hacker. Coffee enthusiast ☕ and open-source contributor.',
    location: 'Toronto, Canada',
    website: 'https://marcus.sh',
    joinedDate: 'Joined July 2024',
    isVerified: false,
    following: ['u-zorwa'],
    followers: ['u-zorwa'],
    savedPosts: [],
    likedPosts: ['p-3'],
  }
];

const INITIAL_POSTS: Post[] = [
  {
    id: 'p-1',
    userId: 'u-zorwa',
    user: {
      id: 'u-zorwa',
      name: 'Zorwa Rehman',
      username: 'zorwarehman',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      isVerified: true,
    },
    content: '🚀 Super excited to showcase Task 2 of the CodeAlpha Internship: Pulse Social Media Platform! Built with a high-performance Express backend, dynamic post interactions, live follower management, and sleek responsive design. What do you think of this clean UI architecture?',
    mediaUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1000&auto=format&fit=crop&q=80',
    mediaType: 'image',
    tags: ['codealpha', 'webdev', 'fullstack', 'react'],
    likes: ['u-alex', 'u-sarah', 'u-zorwa'],
    reposts: ['u-alex'],
    commentCount: 3,
    isPinned: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
  },
  {
    id: 'p-2',
    userId: 'u-sarah',
    user: {
      id: 'u-sarah',
      name: 'Sarah Chen',
      username: 'sarahdesigns',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
      isVerified: true,
    },
    content: 'Quick poll for frontend engineers: When building a modern web application, which CSS paradigm do you prefer the most in 2025/2026?',
    tags: ['design', 'css', 'frontend', 'uiux'],
    likes: ['u-zorwa', 'u-elena'],
    reposts: ['u-zorwa'],
    commentCount: 2,
    poll: {
      question: 'Preferred Styling Architecture:',
      options: [
        { id: 'opt-1', text: 'Tailwind CSS v4 Utility-First', votes: ['u-zorwa', 'u-alex', 'u-marcus'] },
        { id: 'opt-2', text: 'CSS Modules / Vanilla CSS', votes: ['u-elena'] },
        { id: 'opt-3', text: 'Styled Components / Emotion', votes: [] },
        { id: 'opt-4', text: 'shadcn/ui + Radix UI Primitives', votes: ['u-sarah'] },
      ],
      totalVotes: 5,
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
  },
  {
    id: 'p-3',
    userId: 'u-alex',
    user: {
      id: 'u-alex',
      name: 'Alex Rivera',
      username: 'alexdev',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
      isVerified: true,
    },
    content: 'Just deployed our new microservices pipeline with zero downtime. Clean separation of concerns between API ingestion, database persistence, and websocket streaming is unmatched. 💡',
    mediaUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1000&auto=format&fit=crop&q=80',
    mediaType: 'image',
    tags: ['backend', 'nodejs', 'devops', 'scalability'],
    likes: ['u-zorwa', 'u-marcus'],
    reposts: [],
    commentCount: 1,
    createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(), // 6 hours ago
  },
  {
    id: 'p-4',
    userId: 'u-elena',
    user: {
      id: 'u-elena',
      name: 'Elena Rostova',
      username: 'elenarostova',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
      isVerified: false,
    },
    content: 'Experimenting with generative embeddings for real-time recommendation feeds. Combining vector distance and social graph clustering yields surprisingly accurate content discovery!',
    tags: ['ai', 'machinelearning', 'datascience'],
    likes: ['u-alex'],
    reposts: [],
    commentCount: 0,
    createdAt: new Date(Date.now() - 1000 * 60 * 720).toISOString(), // 12 hours ago
  }
];

const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'c-1',
    postId: 'p-1',
    userId: 'u-alex',
    user: {
      id: 'u-alex',
      name: 'Alex Rivera',
      username: 'alexdev',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
      isVerified: true,
    },
    content: 'This looks incredibly clean Zorwa! The dark-mode contrast and smooth micro-interactions make it feel like a production-grade social platform.',
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    likes: ['u-zorwa', 'u-sarah'],
  },
  {
    id: 'c-2',
    postId: 'p-1',
    userId: 'u-sarah',
    user: {
      id: 'u-sarah',
      name: 'Sarah Chen',
      username: 'sarahdesigns',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
      isVerified: true,
    },
    content: 'The typography pairing and spacing rhythm are top notch. Great job on the user profile layout!',
    createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    likes: ['u-zorwa'],
  },
  {
    id: 'c-3',
    postId: 'p-1',
    userId: 'u-zorwa',
    user: {
      id: 'u-zorwa',
      name: 'Zorwa Rehman',
      username: 'zorwarehman',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      isVerified: true,
    },
    content: 'Thank you Alex & Sarah! Appreciate the feedback! 🚀',
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    likes: ['u-alex'],
    parentId: 'c-1',
  },
  {
    id: 'c-4',
    postId: 'p-2',
    userId: 'u-zorwa',
    user: {
      id: 'u-zorwa',
      name: 'Zorwa Rehman',
      username: 'zorwarehman',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      isVerified: true,
    },
    content: 'Tailwind v4 is blazing fast with zero-config Vite integration. Total game changer!',
    createdAt: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
    likes: ['u-sarah'],
  },
  {
    id: 'c-5',
    postId: 'p-3',
    userId: 'u-marcus',
    user: {
      id: 'u-marcus',
      name: 'Marcus Vance',
      username: 'marcustech',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&auto=format&fit=crop&q=80',
      isVerified: false,
    },
    content: 'Solid work Alex. Are you guys running on Docker containers or native serverless?',
    createdAt: new Date(Date.now() - 1000 * 60 * 200).toISOString(),
    likes: ['u-alex'],
  }
];

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'n-1',
    recipientId: 'u-zorwa',
    actor: {
      id: 'u-alex',
      name: 'Alex Rivera',
      username: 'alexdev',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
    },
    type: 'like',
    postId: 'p-1',
    postSnippet: '🚀 Super excited to showcase Task 2 of the CodeAlpha Internship...',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'n-2',
    recipientId: 'u-zorwa',
    actor: {
      id: 'u-sarah',
      name: 'Sarah Chen',
      username: 'sarahdesigns',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    },
    type: 'comment',
    postId: 'p-1',
    commentSnippet: 'The typography pairing and spacing rhythm are top notch...',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
  },
  {
    id: 'n-3',
    recipientId: 'u-zorwa',
    actor: {
      id: 'u-elena',
      name: 'Elena Rostova',
      username: 'elenarostova',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    },
    type: 'follow',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  }
];

const INITIAL_TRENDING: TrendingTopic[] = [
  { id: 'tr-1', tag: 'codealpha', category: 'Technology · Trending', postCount: 1420 },
  { id: 'tr-2', tag: 'fullstack', category: 'Web Development', postCount: 3890 },
  { id: 'tr-3', tag: 'react19', category: 'Frontend Ecosystem', postCount: 8940 },
  { id: 'tr-4', tag: 'typescript', category: 'Software Engineering', postCount: 12400 },
  { id: 'tr-5', tag: 'ai_agents', category: 'Artificial Intelligence', postCount: 24500 },
];

class SocialDatabase {
  private data: SocialDatabaseData;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): SocialDatabaseData {
    try {
      if (!fs.existsSync(path.dirname(DB_FILE))) {
        fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('Failed to load social_db.json, using defaults', e);
    }
    const initial: SocialDatabaseData = {
      users: INITIAL_USERS,
      posts: INITIAL_POSTS,
      comments: INITIAL_COMMENTS,
      notifications: INITIAL_NOTIFICATIONS,
      trending: INITIAL_TRENDING,
    };
    this.saveData(initial);
    return initial;
  }

  private saveData(data: SocialDatabaseData) {
    try {
      if (!fs.existsSync(path.dirname(DB_FILE))) {
        fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to save social_db.json', e);
    }
  }

  // --- Users ---
  getUsers(): User[] {
    return this.data.users;
  }

  getUserById(id: string): User | undefined {
    return this.data.users.find(u => u.id === id || u.username.toLowerCase() === id.toLowerCase());
  }

  updateUserProfile(id: string, updates: Partial<User>): User | undefined {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx === -1) return undefined;
    this.data.users[idx] = { ...this.data.users[idx], ...updates };
    
    // Also update embedded user info in posts & comments
    const updatedUser = this.data.users[idx];
    this.data.posts.forEach(p => {
      if (p.userId === id) {
        p.user.name = updatedUser.name;
        p.user.username = updatedUser.username;
        p.user.avatar = updatedUser.avatar;
      }
    });
    this.data.comments.forEach(c => {
      if (c.userId === id) {
        c.user.name = updatedUser.name;
        c.user.username = updatedUser.username;
        c.user.avatar = updatedUser.avatar;
      }
    });

    this.saveData(this.data);
    return this.data.users[idx];
  }

  toggleFollowUser(currentUserId: string, targetUserId: string): { isFollowing: boolean; targetUser: User; currentUser: User } {
    const currentUser = this.data.users.find(u => u.id === currentUserId);
    const targetUser = this.data.users.find(u => u.id === targetUserId);
    if (!currentUser || !targetUser || currentUserId === targetUserId) {
      throw new Error('Invalid users for follow operation');
    }

    const isFollowing = currentUser.following.includes(targetUserId);
    if (isFollowing) {
      currentUser.following = currentUser.following.filter(id => id !== targetUserId);
      targetUser.followers = targetUser.followers.filter(id => id !== currentUserId);
    } else {
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUserId);

      // Create notification
      this.createNotification({
        recipientId: targetUserId,
        actor: {
          id: currentUser.id,
          name: currentUser.name,
          username: currentUser.username,
          avatar: currentUser.avatar,
        },
        type: 'follow',
      });
    }

    this.saveData(this.data);
    return { isFollowing: !isFollowing, targetUser, currentUser };
  }

  // --- Posts ---
  getPosts(options?: {
    feedType?: 'all' | 'following' | 'user' | 'saved' | 'liked';
    currentUserId?: string;
    targetUserId?: string;
    tag?: string;
    search?: string;
  }): Post[] {
    let posts = [...this.data.posts];

    if (options?.tag) {
      const targetTag = options.tag.toLowerCase().replace(/^#/, '');
      posts = posts.filter(p => p.tags.some(t => t.toLowerCase() === targetTag));
    }

    if (options?.search) {
      const q = options.search.toLowerCase();
      posts = posts.filter(p =>
        p.content.toLowerCase().includes(q) ||
        p.user.name.toLowerCase().includes(q) ||
        p.user.username.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    if (options?.feedType === 'following' && options.currentUserId) {
      const currentUser = this.getUserById(options.currentUserId);
      if (currentUser) {
        posts = posts.filter(p => p.userId === options.currentUserId || currentUser.following.includes(p.userId));
      }
    } else if (options?.feedType === 'user' && options.targetUserId) {
      posts = posts.filter(p => p.userId === options.targetUserId);
    } else if (options?.feedType === 'saved' && options.currentUserId) {
      const currentUser = this.getUserById(options.currentUserId);
      const savedIds = currentUser?.savedPosts || [];
      posts = posts.filter(p => savedIds.includes(p.id));
    } else if (options?.feedType === 'liked' && options.targetUserId) {
      posts = posts.filter(p => p.likes.includes(options.targetUserId!));
    }

    // Sort: Pinned first (if user feed), then newest
    return posts.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  getPostById(id: string): Post | undefined {
    const post = this.data.posts.find(p => p.id === id);
    if (!post) return undefined;
    const comments = this.getCommentsByPostId(id);
    return { ...post, comments, commentCount: comments.length };
  }

  createPost(payload: {
    userId: string;
    content: string;
    mediaUrl?: string;
    mediaType?: 'image' | 'video' | 'code';
    tags?: string[];
    poll?: { question: string; options: string[] };
  }): Post {
    const user = this.getUserById(payload.userId);
    if (!user) throw new Error('User not found');

    const newPostId = `p-${Date.now()}`;
    const tags = payload.tags || this.extractHashtags(payload.content);

    let pollData = undefined;
    if (payload.poll && payload.poll.options.length >= 2) {
      pollData = {
        question: payload.poll.question,
        options: payload.poll.options.filter(Boolean).map((opt, i) => ({
          id: `opt-${i + 1}`,
          text: opt,
          votes: [],
        })),
        totalVotes: 0,
      };
    }

    const newPost: Post = {
      id: newPostId,
      userId: user.id,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        isVerified: user.isVerified,
      },
      content: payload.content,
      mediaUrl: payload.mediaUrl,
      mediaType: payload.mediaType || (payload.mediaUrl ? 'image' : undefined),
      tags,
      likes: [],
      reposts: [],
      commentCount: 0,
      poll: pollData,
      createdAt: new Date().toISOString(),
    };

    this.data.posts.unshift(newPost);
    this.updateTrendingCounts(tags);
    this.saveData(this.data);
    return newPost;
  }

  deletePost(postId: string, userId: string): boolean {
    const idx = this.data.posts.findIndex(p => p.id === postId);
    if (idx === -1) return false;
    // Only author can delete
    if (this.data.posts[idx].userId !== userId) {
      throw new Error('Unauthorized to delete this post');
    }
    this.data.posts.splice(idx, 1);
    this.data.comments = this.data.comments.filter(c => c.postId !== postId);
    this.saveData(this.data);
    return true;
  }

  toggleLikePost(postId: string, userId: string): { post: Post; isLiked: boolean } {
    const post = this.data.posts.find(p => p.id === postId);
    const user = this.getUserById(userId);
    if (!post || !user) throw new Error('Post or user not found');

    const isLiked = post.likes.includes(userId);
    if (isLiked) {
      post.likes = post.likes.filter(id => id !== userId);
      user.likedPosts = (user.likedPosts || []).filter(id => id !== postId);
    } else {
      post.likes.push(userId);
      if (!user.likedPosts) user.likedPosts = [];
      user.likedPosts.push(postId);

      // Notify post author if not self
      if (post.userId !== userId) {
        this.createNotification({
          recipientId: post.userId,
          actor: {
            id: user.id,
            name: user.name,
            username: user.username,
            avatar: user.avatar,
          },
          type: 'like',
          postId: post.id,
          postSnippet: post.content.substring(0, 60),
        });
      }
    }

    this.saveData(this.data);
    return { post, isLiked: !isLiked };
  }

  toggleBookmarkPost(postId: string, userId: string): { isSaved: boolean; user: User } {
    const user = this.getUserById(userId);
    if (!user) throw new Error('User not found');

    if (!user.savedPosts) user.savedPosts = [];
    const isSaved = user.savedPosts.includes(postId);

    if (isSaved) {
      user.savedPosts = user.savedPosts.filter(id => id !== postId);
    } else {
      user.savedPosts.push(postId);
    }

    this.saveData(this.data);
    return { isSaved: !isSaved, user };
  }

  votePoll(postId: string, optionId: string, userId: string): Post {
    const post = this.data.posts.find(p => p.id === postId);
    if (!post || !post.poll) throw new Error('Poll not found');

    // Remove any previous vote by this user on this poll
    post.poll.options.forEach(opt => {
      opt.votes = opt.votes.filter(uId => uId !== userId);
    });

    const targetOpt = post.poll.options.find(o => o.id === optionId);
    if (targetOpt) {
      targetOpt.votes.push(userId);
    }

    post.poll.totalVotes = post.poll.options.reduce((acc, opt) => acc + opt.votes.length, 0);
    this.saveData(this.data);
    return post;
  }

  // --- Comments ---
  getCommentsByPostId(postId: string): Comment[] {
    const postComments = this.data.comments.filter(c => c.postId === postId);
    // Build nested structure
    const roots: Comment[] = [];
    const map = new Map<string, Comment>();

    postComments.forEach(c => {
      map.set(c.id, { ...c, replies: [] });
    });

    postComments.forEach(c => {
      const item = map.get(c.id)!;
      if (c.parentId && map.has(c.parentId)) {
        map.get(c.parentId)!.replies!.push(item);
      } else {
        roots.push(item);
      }
    });

    return roots.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  addComment(payload: { postId: string; userId: string; content: string; parentId?: string | null }): Comment {
    const post = this.data.posts.find(p => p.id === payload.postId);
    const user = this.getUserById(payload.userId);
    if (!post || !user) throw new Error('Post or user not found');

    const newComment: Comment = {
      id: `c-${Date.now()}`,
      postId: payload.postId,
      userId: user.id,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        isVerified: user.isVerified,
      },
      content: payload.content,
      createdAt: new Date().toISOString(),
      likes: [],
      parentId: payload.parentId || null,
      replies: [],
    };

    this.data.comments.push(newComment);
    post.commentCount = (post.commentCount || 0) + 1;

    // Notification to post owner
    if (post.userId !== user.id) {
      this.createNotification({
        recipientId: post.userId,
        actor: {
          id: user.id,
          name: user.name,
          username: user.username,
          avatar: user.avatar,
        },
        type: 'comment',
        postId: post.id,
        postSnippet: post.content.substring(0, 60),
        commentSnippet: payload.content.substring(0, 60),
      });
    }

    this.saveData(this.data);
    return newComment;
  }

  toggleLikeComment(commentId: string, userId: string): { comment: Comment; isLiked: boolean } {
    const comment = this.data.comments.find(c => c.id === commentId);
    if (!comment) throw new Error('Comment not found');

    const isLiked = comment.likes.includes(userId);
    if (isLiked) {
      comment.likes = comment.likes.filter(id => id !== userId);
    } else {
      comment.likes.push(userId);
    }

    this.saveData(this.data);
    return { comment, isLiked: !isLiked };
  }

  deleteComment(commentId: string, userId: string): boolean {
    const idx = this.data.comments.findIndex(c => c.id === commentId);
    if (idx === -1) return false;
    const comment = this.data.comments[idx];
    if (comment.userId !== userId) throw new Error('Unauthorized');

    const postId = comment.postId;
    this.data.comments.splice(idx, 1);

    const post = this.data.posts.find(p => p.id === postId);
    if (post && post.commentCount > 0) {
      post.commentCount -= 1;
    }

    this.saveData(this.data);
    return true;
  }

  // --- Notifications ---
  getNotifications(userId: string): Notification[] {
    return this.data.notifications
      .filter(n => n.recipientId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  markNotificationsAsRead(userId: string): boolean {
    this.data.notifications.forEach(n => {
      if (n.recipientId === userId) n.isRead = true;
    });
    this.saveData(this.data);
    return true;
  }

  private createNotification(payload: Omit<Notification, 'id' | 'isRead' | 'createdAt'>) {
    const notif: Notification = {
      id: `n-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      ...payload,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    this.data.notifications.unshift(notif);
  }

  // --- Trending ---
  getTrendingTopics(): TrendingTopic[] {
    return this.data.trending.sort((a, b) => b.postCount - a.postCount);
  }

  private extractHashtags(text: string): string[] {
    const matches = text.match(/#([a-zA-Z0-9_]+)/g);
    if (!matches) return [];
    return Array.from(new Set(matches.map(m => m.replace('#', '').toLowerCase())));
  }

  private updateTrendingCounts(tags: string[]) {
    tags.forEach(tag => {
      const existing = this.data.trending.find(t => t.tag.toLowerCase() === tag.toLowerCase());
      if (existing) {
        existing.postCount += 1;
      } else {
        this.data.trending.push({
          id: `tr-${Date.now()}-${tag}`,
          tag,
          category: 'Technology',
          postCount: 1,
        });
      }
    });
  }
}

export const socialDb = new SocialDatabase();
