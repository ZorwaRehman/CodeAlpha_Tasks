export interface User {
  id: string;
  username: string;
  name: string;
  avatar: string;
  coverImage?: string;
  bio: string;
  location?: string;
  website?: string;
  joinedDate: string;
  isVerified?: boolean;
  following: string[]; // User IDs that this user follows
  followers: string[]; // User IDs following this user
  savedPosts: string[]; // Post IDs bookmarked by this user
  likedPosts: string[]; // Post IDs liked by this user
}

export interface PollOption {
  id: string;
  text: string;
  votes: string[]; // User IDs who voted for this option
}

export interface Poll {
  question: string;
  options: PollOption[];
  totalVotes: number;
  expiresAt?: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  user: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    isVerified?: boolean;
  };
  content: string;
  createdAt: string;
  likes: string[]; // User IDs
  parentId?: string | null; // For nested replies
  replies?: Comment[];
}

export interface Post {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    isVerified?: boolean;
  };
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'code';
  tags: string[];
  likes: string[]; // User IDs who liked
  reposts: string[]; // User IDs who reposted
  commentCount: number;
  comments?: Comment[];
  poll?: Poll;
  isPinned?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Notification {
  id: string;
  recipientId: string;
  actor: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
  type: 'like' | 'comment' | 'follow' | 'repost' | 'mention';
  postId?: string;
  postSnippet?: string;
  commentSnippet?: string;
  isRead: boolean;
  createdAt: string;
}

export interface TrendingTopic {
  id: string;
  tag: string;
  category: string;
  postCount: number;
}
