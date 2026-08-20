import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { socialDb } from './server/socialDb';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Endpoints ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', app: 'Pulse Social Media', time: new Date().toISOString() });
  });

  // 1. Users Endpoints
  app.get('/api/users', (req, res) => {
    try {
      res.json(socialDb.getUsers());
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get('/api/users/recommended', (req, res) => {
    try {
      const currentUserId = req.query.currentUserId as string;
      const allUsers = socialDb.getUsers();
      const currentUser = socialDb.getUserById(currentUserId);
      
      const filtered = allUsers.filter(u => {
        if (u.id === currentUserId) return false;
        if (currentUser && currentUser.following.includes(u.id)) return false;
        return true;
      });

      res.json(filtered.slice(0, 4));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get('/api/users/:id', (req, res) => {
    try {
      const user = socialDb.getUserById(req.params.id);
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.put('/api/users/:id/profile', (req, res) => {
    try {
      const updated = socialDb.updateUserProfile(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: 'User not found' });
      res.json(updated);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/users/:id/follow', (req, res) => {
    try {
      const { currentUserId } = req.body;
      if (!currentUserId) return res.status(400).json({ error: 'currentUserId is required' });
      const result = socialDb.toggleFollowUser(currentUserId, req.params.id);
      res.json(result);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // 2. Posts Endpoints
  app.get('/api/posts', (req, res) => {
    try {
      const { feedType, currentUserId, targetUserId, tag, search } = req.query;
      const posts = socialDb.getPosts({
        feedType: feedType as any,
        currentUserId: currentUserId as string,
        targetUserId: targetUserId as string,
        tag: tag as string,
        search: search as string,
      });
      res.json(posts);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get('/api/posts/:id', (req, res) => {
    try {
      const post = socialDb.getPostById(req.params.id);
      if (!post) return res.status(404).json({ error: 'Post not found' });
      res.json(post);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/posts', (req, res) => {
    try {
      const { userId, content, mediaUrl, mediaType, tags, poll } = req.body;
      if (!userId || !content) {
        return res.status(400).json({ error: 'userId and content are required' });
      }
      const post = socialDb.createPost({ userId, content, mediaUrl, mediaType, tags, poll });
      res.status(201).json(post);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete('/api/posts/:id', (req, res) => {
    try {
      const { userId } = req.body;
      if (!userId) return res.status(400).json({ error: 'userId is required' });
      const success = socialDb.deletePost(req.params.id, userId);
      if (!success) return res.status(404).json({ error: 'Post not found' });
      res.json({ success: true, message: 'Post deleted successfully' });
    } catch (e: any) {
      res.status(403).json({ error: e.message });
    }
  });

  app.post('/api/posts/:id/like', (req, res) => {
    try {
      const { userId } = req.body;
      if (!userId) return res.status(400).json({ error: 'userId is required' });
      const result = socialDb.toggleLikePost(req.params.id, userId);
      res.json(result);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.post('/api/posts/:id/bookmark', (req, res) => {
    try {
      const { userId } = req.body;
      if (!userId) return res.status(400).json({ error: 'userId is required' });
      const result = socialDb.toggleBookmarkPost(req.params.id, userId);
      res.json(result);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.post('/api/posts/:id/vote', (req, res) => {
    try {
      const { optionId, userId } = req.body;
      if (!optionId || !userId) return res.status(400).json({ error: 'optionId and userId are required' });
      const updatedPost = socialDb.votePoll(req.params.id, optionId, userId);
      res.json(updatedPost);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // 3. Comments Endpoints
  app.get('/api/posts/:id/comments', (req, res) => {
    try {
      const comments = socialDb.getCommentsByPostId(req.params.id);
      res.json(comments);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/posts/:id/comments', (req, res) => {
    try {
      const { userId, content, parentId } = req.body;
      if (!userId || !content) return res.status(400).json({ error: 'userId and content are required' });
      const comment = socialDb.addComment({
        postId: req.params.id,
        userId,
        content,
        parentId,
      });
      res.status(201).json(comment);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/comments/:id/like', (req, res) => {
    try {
      const { userId } = req.body;
      if (!userId) return res.status(400).json({ error: 'userId is required' });
      const result = socialDb.toggleLikeComment(req.params.id, userId);
      res.json(result);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.delete('/api/comments/:id', (req, res) => {
    try {
      const { userId } = req.body;
      if (!userId) return res.status(400).json({ error: 'userId is required' });
      const success = socialDb.deleteComment(req.params.id, userId);
      if (!success) return res.status(404).json({ error: 'Comment not found' });
      res.json({ success: true });
    } catch (e: any) {
      res.status(403).json({ error: e.message });
    }
  });

  // 4. Notifications Endpoints
  app.get('/api/notifications', (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) return res.status(400).json({ error: 'userId is required' });
      res.json(socialDb.getNotifications(userId));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/notifications/read', (req, res) => {
    try {
      const { userId } = req.body;
      if (!userId) return res.status(400).json({ error: 'userId is required' });
      socialDb.markNotificationsAsRead(userId);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // 5. Trending Topics
  app.get('/api/trending', (req, res) => {
    try {
      res.json(socialDb.getTrendingTopics());
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // --- Vite / Static Serving ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Pulse Social Media Server running on http://localhost:${PORT}`);
  });
}

startServer();
