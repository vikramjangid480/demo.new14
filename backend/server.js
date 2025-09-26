const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 8000;

// Enable CORS
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mock data for testing
const mockBlogs = [
  {
    id: 1,
    title: 'Building Your Personal Library: A Complete Guide',
    slug: 'building-personal-library-complete-guide',
    content: '<h2>Introduction</h2><p>Building a personal library is more than just collecting books...</p>',
    excerpt: 'Essential tips for curating a collection that reflects your personality and interests',
    featured_image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured_image_2: null,
    category_id: 1,
    category_name: 'Fiction',
    category_slug: 'fiction',
    category: {
      id: 1,
      name: 'Fiction',
      slug: 'fiction'
    },
    tags: ['library', 'books', 'reading', 'collection', 'personal development'],
    meta_title: '',
    meta_description: '',
    is_featured: true,
    status: 'published',
    view_count: 125,
    created_at: '2024-09-20T10:00:00Z',
    updated_at: '2024-09-20T10:00:00Z',
    related_books: []
  },
  {
    id: 2,
    title: 'Sakamoto Days Vol. 1',
    slug: 'sakamoto-days-vol-1',
    content: '<h2>Plot Summary</h2><p>Taro Sakamoto was once a legendary hit man considered the greatest of all time...</p>',
    excerpt: 'The legendary hitman turned family man faces his past in this action-packed manga',
    featured_image: 'http://localhost:8000/uploads/1758533654_naruto.webp',
    featured_image_2: null,
    category_id: 1,
    category_name: 'Fiction',
    category_slug: 'fiction',
    category: {
      id: 1,
      name: 'Fiction',
      slug: 'fiction'
    },
    tags: ['manga', 'action', 'comedy', 'sakamoto'],
    meta_title: '',
    meta_description: '',
    is_featured: false,
    status: 'published',
    view_count: 89,
    created_at: '2024-09-18T15:30:00Z',
    updated_at: '2024-09-18T15:30:00Z',
    related_books: []
  }
];

// Serve uploaded files
app.get('/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../uploads', filename);
  
  console.log('Serving upload:', filePath);
  
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});

// Serve assets
app.get('/assets/*', (req, res) => {
  const assetPath = req.params[0];
  const filePath = path.join(__dirname, '../frontend/public/assets', assetPath);
  
  console.log('Serving asset:', filePath);
  
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    // Redirect to appropriate placeholder
    let placeholderUrl = 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    
    if (assetPath.includes('building-library')) {
      placeholderUrl = 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    } else if (assetPath.includes('fantasy-books')) {
      placeholderUrl = 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    } else if (assetPath.includes('ancient-library')) {
      placeholderUrl = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    }
    
    res.redirect(placeholderUrl);
  }
});

// API Routes
app.get('/api/blogs', (req, res) => {
  console.log('GET /api/blogs');
  res.json({
    blogs: mockBlogs,
    total: mockBlogs.length,
    page: 1,
    limit: mockBlogs.length,
    total_pages: 1
  });
});

app.get('/api/blogs/:id', (req, res) => {
  const id = parseInt(req.params.id);
  console.log('GET /api/blogs/' + id);
  
  const blog = mockBlogs.find(b => b.id === id);
  if (blog) {
    res.json({ blog });
  } else {
    res.status(404).json({ error: 'Blog not found' });
  }
});

app.get('/api/blogs/slug/:slug', (req, res) => {
  const slug = req.params.slug;
  console.log('GET /api/blogs/slug/' + slug);
  
  const blog = mockBlogs.find(b => b.slug === slug);
  if (blog) {
    res.json({ blog });
  } else {
    res.status(404).json({ error: 'Blog not found' });
  }
});

app.get('/api/categories', (req, res) => {
  console.log('GET /api/categories');
  res.json({
    categories: [
      { id: 1, name: 'Fiction', slug: 'fiction', count: 5 },
      { id: 2, name: 'History', slug: 'history', count: 3 },
      { id: 3, name: 'Science', slug: 'science', count: 2 }
    ]
  });
});

app.get('/api/banner', (req, res) => {
  console.log('GET /api/banner');
  res.json({
    banners: [
      {
        id: 1,
        title: 'Building Your Personal Library',
        subtitle: 'Essential tips for curating a collection',
        image_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
        link_url: '/blog/building-personal-library-complete-guide'
      }
    ]
  });
});

// Handle 404
app.use((req, res) => {
  console.log('404 - Route not found:', req.url);
  res.status(404).json({ error: 'Route not found: ' + req.url });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});