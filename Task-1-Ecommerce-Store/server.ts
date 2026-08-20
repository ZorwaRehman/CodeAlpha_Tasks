import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Auth helper middleware
  const getUserFromReq = (req: express.Request) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    const token = authHeader.split(' ')[1];
    return db.getUserByToken(token);
  };

  // --- API Endpoints ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Categories
  app.get('/api/categories', (req, res) => {
    try {
      const categories = db.getCategories();
      res.json(categories);
    } catch (e: any) {
      res.status(500).json({ error: e.message || 'Failed to fetch categories' });
    }
  });

  // Products List & Filtering
  app.get('/api/products', (req, res) => {
    try {
      const { search, category, minPrice, maxPrice, sort, featured, inStockOnly } = req.query;
      const products = db.getProducts({
        search: typeof search === 'string' ? search : undefined,
        category: typeof category === 'string' ? category : undefined,
        minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
        sort: typeof sort === 'string' ? sort : undefined,
        featured: featured === 'true',
        inStockOnly: inStockOnly === 'true',
      });
      res.json(products);
    } catch (e: any) {
      res.status(500).json({ error: e.message || 'Failed to fetch products' });
    }
  });

  // Single Product
  app.get('/api/products/:id', (req, res) => {
    try {
      const product = db.getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
    } catch (e: any) {
      res.status(500).json({ error: e.message || 'Failed to fetch product' });
    }
  });

  // Create Product (Admin or public store manager)
  app.post('/api/products', (req, res) => {
    try {
      const { name, description, price, category, brand, image, countInStock } = req.body;
      if (!name || !price || !category) {
        return res.status(400).json({ error: 'Name, price, and category are required' });
      }
      const newProduct = db.addProduct({
        name,
        description: description || '',
        price: parseFloat(price),
        originalPrice: req.body.originalPrice ? parseFloat(req.body.originalPrice) : undefined,
        rating: 5.0,
        numReviews: 0,
        category,
        brand: brand || 'Generic',
        image: image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
        additionalImages: req.body.additionalImages || [],
        inStock: (countInStock || 10) > 0,
        countInStock: parseInt(countInStock || '10', 10),
        featured: Boolean(req.body.featured),
        badge: req.body.badge || '',
        specs: req.body.specs || {},
      });
      res.status(201).json(newProduct);
    } catch (e: any) {
      res.status(500).json({ error: e.message || 'Failed to create product' });
    }
  });

  // Update Product
  app.put('/api/products/:id', (req, res) => {
    try {
      const updated = db.updateProduct(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(updated);
    } catch (e: any) {
      res.status(500).json({ error: e.message || 'Failed to update product' });
    }
  });

  // Delete Product
  app.delete('/api/products/:id', (req, res) => {
    try {
      const deleted = db.deleteProduct(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json({ success: true, message: 'Product deleted' });
    } catch (e: any) {
      res.status(500).json({ error: e.message || 'Failed to delete product' });
    }
  });

  // Add Product Review
  app.post('/api/products/:id/reviews', (req, res) => {
    try {
      const { rating, comment, userName, userId } = req.body;
      if (!rating || !comment) {
        return res.status(400).json({ error: 'Rating and comment are required' });
      }

      const updated = db.addProductReview(req.params.id, {
        userId: userId || 'anon',
        userName: userName || 'Verified Customer',
        rating: Number(rating),
        comment,
      });

      if (!updated) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(updated);
    } catch (e: any) {
      res.status(500).json({ error: e.message || 'Failed to add review' });
    }
  });

  // --- Auth Endpoints ---

  // Register
  app.post('/api/auth/register', (req, res) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required' });
      }
      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }
      const result = db.registerUser(name, email, password);
      res.status(201).json(result);
    } catch (e: any) {
      res.status(400).json({ error: e.message || 'Registration failed' });
    }
  });

  // Login
  app.post('/api/auth/login', (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }
      const result = db.loginUser(email, password);
      res.json(result);
    } catch (e: any) {
      res.status(401).json({ error: e.message || 'Invalid credentials' });
    }
  });

  // Current User
  app.get('/api/auth/me', (req, res) => {
    try {
      const user = getUserFromReq(req);
      if (!user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
      res.json(user);
    } catch (e: any) {
      res.status(500).json({ error: e.message || 'Authentication check failed' });
    }
  });

  // --- Orders Endpoints ---

  // Create Order
  app.post('/api/orders', (req, res) => {
    try {
      const {
        items,
        shippingAddress,
        shippingMethod,
        paymentMethod,
        itemsPrice,
        discountPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      } = req.body;

      if (!items || items.length === 0) {
        return res.status(400).json({ error: 'Cart is empty' });
      }

      if (!shippingAddress || !shippingAddress.street || !shippingAddress.city) {
        return res.status(400).json({ error: 'Shipping address is incomplete' });
      }

      const user = getUserFromReq(req);

      const order = db.createOrder({
        userId: user ? user.id : req.body.userId || 'guest',
        userName: user ? user.name : shippingAddress.fullName || 'Guest Customer',
        userEmail: user ? user.email : shippingAddress.email || 'guest@example.com',
        items,
        shippingAddress,
        shippingMethod: shippingMethod || {
          id: 'ship-std',
          name: 'Standard Insured Shipping',
          price: 0,
          estimatedDays: '3-5 Business Days',
        },
        paymentMethod: paymentMethod || 'Credit Card',
        itemsPrice: Number(itemsPrice || 0),
        discountPrice: Number(discountPrice || 0),
        taxPrice: Number(taxPrice || 0),
        shippingPrice: Number(shippingPrice || 0),
        totalPrice: Number(totalPrice || 0),
      });

      res.status(201).json(order);
    } catch (e: any) {
      res.status(500).json({ error: e.message || 'Order creation failed' });
    }
  });

  // Get Orders
  app.get('/api/orders', (req, res) => {
    try {
      const user = getUserFromReq(req);
      const userIdParam = req.query.userId as string;

      // If admin, can view all. If customer, view own.
      if (user && user.role === 'admin' && !userIdParam) {
        return res.json(db.getOrders());
      }

      const targetId = userIdParam || (user ? user.id : undefined);
      if (!targetId && (!user || user.role !== 'admin')) {
        return res.json(db.getOrders()); // Return all for demo or public view
      }

      res.json(db.getOrders(targetId));
    } catch (e: any) {
      res.status(500).json({ error: e.message || 'Failed to fetch orders' });
    }
  });

  // Get Order By ID
  app.get('/api/orders/:id', (req, res) => {
    try {
      const order = db.getOrderById(req.params.id);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      res.json(order);
    } catch (e: any) {
      res.status(500).json({ error: e.message || 'Failed to fetch order' });
    }
  });

  // Update Order Status (Admin)
  app.patch('/api/orders/:id/status', (req, res) => {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ error: 'Status is required' });
      }
      const updated = db.updateOrderStatus(req.params.id, status);
      if (!updated) {
        return res.status(404).json({ error: 'Order not found' });
      }
      res.json(updated);
    } catch (e: any) {
      res.status(500).json({ error: e.message || 'Failed to update order status' });
    }
  });

  // Analytics & Stats
  app.get('/api/stats', (req, res) => {
    try {
      res.json(db.getStats());
    } catch (e: any) {
      res.status(500).json({ error: e.message || 'Failed to fetch stats' });
    }
  });

  // --- Vite / Static Handling ---
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
    console.log(`E-Commerce Server running on http://localhost:${PORT}`);
  });
}

startServer();
