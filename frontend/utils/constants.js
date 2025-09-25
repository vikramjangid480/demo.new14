export const DEFAULT_IMAGES = {
  BLOG_BANNER: '/assets/images/default-blog-banner.jpg',
  HERO_BANNER: '/assets/images/fantasy-books.jpg',
  ARTICLE_THUMBNAIL: '/assets/images/ancient-library.jpg'
};

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

// Helper function to get image URL
export const getImageUrl = (imagePath, defaultImage = DEFAULT_IMAGES.ARTICLE_THUMBNAIL) => {
  if (!imagePath) return defaultImage;
  if (imagePath.startsWith('http')) return imagePath;
  if (imagePath.startsWith('/')) return imagePath;
  return `${API_BASE_URL}/uploads/${imagePath.split('/').pop()}`;
};