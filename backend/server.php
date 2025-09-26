<?php
// Simple PHP development server script
// This script provides a basic routing mechanism for the API endpoints

$requestUri = $_SERVER['REQUEST_URI'];
$requestMethod = $_SERVER['REQUEST_METHOD'];

// Log request details
error_log("Received {$requestMethod} request for: {$requestUri}");

// Remove query string from URI
$uri = parse_url($requestUri, PHP_URL_PATH);
error_log("Parsed URI: {$uri}");

// Handle CORS for all requests
// Allow specific origin for credentials support
$allowed_origins = [
    'http://localhost:5173', 
    'http://localhost:3000',
];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    header("Access-Control-Allow-Origin: http://localhost:5173");
}
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// Handle preflight OPTIONS request
if ($requestMethod === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Route handling
if ($uri === '/api/blogs' || 
    preg_match('/\/api\/blogs\/(\d+)/', $uri) || 
    preg_match('/\/api\/blogs\/slug\/([^\/]+)/', $uri)) {
    // Parse the request to set proper parameters
    if (preg_match('/\/api\/blogs\/(\d+)/', $uri, $matches)) {
        $_GET['id'] = $matches[1];
    } elseif (preg_match('/\/api\/blogs\/slug\/([^\/]+)/', $uri, $matches)) {
        $_GET['slug'] = urldecode($matches[1]);
    }
    
    // Use test version when database is not available
    if (file_exists('getBlogs_test.php')) {
        require_once 'getBlogs_test.php';
    } else {
        require_once 'getBlogs.php';
    }
} else {
    switch ($uri) {
    
    case '/api/categories':
        // Use test version when database is not available
        if (file_exists('getCategories_test.php')) {
            require_once 'getCategories_test.php';
        } else {
            require_once 'getCategories.php';
        }
        break;
    
    case '/api/banner':
        require_once 'getBanner.php';
        break;
    
    case '/api/admin/blogs':
        // Use test version when database is not available
        if (file_exists('addBlog_test.php')) {
            require_once 'addBlog_test.php';
        } else {
            require_once 'addBlog.php';
        }
        break;
    
    case '/api/auth/login':
        // Use test version when database is not available
        if (file_exists('login_test.php')) {
            require_once 'login_test.php';
        } else {
            require_once 'login.php';
        }
        break;
    
    default:
        // Check if it's a static file request from uploads directory
        if (preg_match('/\/uploads\/(.+)/', $uri, $matches)) {
            $filePath = __DIR__ . '/../uploads/' . $matches[1];
            if (file_exists($filePath)) {
                $mimeType = mime_content_type($filePath);
                
                // Set proper headers for images
                header("Content-Type: $mimeType");
                header("Cache-Control: public, max-age=31536000");
                header("Access-Control-Allow-Origin: *");
                header("Access-Control-Allow-Methods: GET, OPTIONS");
                header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
                
                // Handle OPTIONS request for CORS preflight
                if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
                    http_response_code(200);
                    exit();
                }
                
                readfile($filePath);
                exit();
            } else {
                // File not found in uploads
                http_response_code(404);
                header('Content-Type: application/json');
                echo json_encode(['error' => 'Image not found: ' . $matches[1]]);
                exit();
            }
        }
        
        // Check if it's an assets file request
        if (preg_match('/\/assets\/(.+)/', $uri, $matches)) {
            $filePath = __DIR__ . '/../frontend/public/assets/' . $matches[1];
            if (file_exists($filePath)) {
                $mimeType = mime_content_type($filePath);
                header("Content-Type: $mimeType");
                header("Cache-Control: public, max-age=31536000");
                readfile($filePath);
                exit();
            } else {
                // Serve specific placeholder images for common assets
                $filename = $matches[1];
                $placeholderUrl = 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                
                // Map specific assets to appropriate placeholder images
                if (strpos($filename, 'building-library') !== false) {
                    $placeholderUrl = 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                } elseif (strpos($filename, 'fantasy-books') !== false) {
                    $placeholderUrl = 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                } elseif (strpos($filename, 'ancient-library') !== false) {
                    $placeholderUrl = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                }
                
                header("Content-Type: image/jpeg");
                header("Cache-Control: public, max-age=3600");
                header("Location: $placeholderUrl");
                exit();
            }
        }
        
        // 404 for unknown routes
        http_response_code(404);
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Route not found: ' . $uri]);
        break;
    }
}
?>