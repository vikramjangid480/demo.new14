// Centralized image utility functions for the blog application
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export const DEFAULT_IMAGES = {
  BLOG_BANNER: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  HERO_BANNER: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  ARTICLE_THUMBNAIL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  BUILDING_LIBRARY: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
};

/**
 * Get the full URL for an image
 * @param {string} imagePath - The image path (can be relative or full URL)
 * @param {string} defaultImage - Default image to use if imagePath is invalid
 * @returns {string} Full image URL
 */
export const getImageUrl = (imagePath, defaultImage = DEFAULT_IMAGES.ARTICLE_THUMBNAIL) => {
  // Return default if no image path provided
  if (!imagePath) return defaultImage;
  
  // If it's already a full URL, return as-is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it starts with /assets/, it's a static frontend asset
  if (imagePath.startsWith('/assets/')) {
    return imagePath;
  }
  
  // If it starts with /uploads/, it should be served from backend
  if (imagePath.startsWith('/uploads/')) {
    return `${API_BASE_URL}${imagePath}`;
  }
  
  // If it's just a filename, assume it's in uploads directory
  if (imagePath && !imagePath.includes('/')) {
    return `${API_BASE_URL}/uploads/${imagePath}`;
  }
  
  // For any other relative paths, return as-is
  return imagePath;
};

/**
 * Get the optimized image URL with size parameters (for future use)
 * @param {string} imagePath - The image path
 * @param {Object} options - Size and optimization options
 * @returns {string} Optimized image URL
 */
export const getOptimizedImageUrl = (imagePath, options = {}) => {
  const { width, height, quality = 80 } = options;
  const baseUrl = getImageUrl(imagePath);
  
  // For now, just return the base URL
  // In the future, we can add image optimization parameters
  return baseUrl;
};

/**
 * Handle image load errors by providing fallback
 * @param {Event} event - The error event
 * @param {string} fallbackImage - Fallback image URL
 */
export const handleImageError = (event, fallbackImage = DEFAULT_IMAGES.ARTICLE_THUMBNAIL) => {
  event.target.src = fallbackImage;
  event.target.onerror = null; // Prevent infinite error loops
};

/**
 * Check if an image URL is valid and accessible
 * @param {string} imageUrl - The image URL to check
 * @returns {Promise<boolean>} Promise that resolves to true if image is accessible
 */
export const isImageAccessible = (imageUrl) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = imageUrl;
  });
};

/**
 * Get the best available image from multiple options
 * @param {Array<string>} imageUrls - Array of image URLs to try
 * @param {string} defaultImage - Default image if none are accessible
 * @returns {Promise<string>} Promise that resolves to the best available image URL
 */
export const getBestAvailableImage = async (imageUrls = [], defaultImage = DEFAULT_IMAGES.ARTICLE_THUMBNAIL) => {
  for (const imageUrl of imageUrls) {
    if (imageUrl && await isImageAccessible(getImageUrl(imageUrl))) {
      return getImageUrl(imageUrl);
    }
  }
  return defaultImage;
};