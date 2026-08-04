/**
 * DEBUGGING GUIDE - Documents Upload Issues
 * 
 * This file contains steps to debug document upload problems
 */

// ============================================
// STEP 1: Check if Token is Available
// ============================================

// In browser console (F12), run:
console.log('Auth Token:', localStorage.getItem('auth_token'));
console.log('User:', localStorage.getItem('user'));

// If these are empty, you're not logged in!


// ============================================
// STEP 2: Test API Endpoint Directly
// ============================================

// Get your token from localStorage
const token = localStorage.getItem('auth_token');

// Test if documents endpoint works
fetch('/api/v2/creator/documents', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
  .then(res => res.json())
  .then(data => console.log('API Response:', data))
  .catch(err => console.error('API Error:', err));


// ============================================
// STEP 3: Test File Upload Directly
// ============================================

// Create a test file
const testFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' });

// Create FormData
const formData = new FormData();
formData.append('file', testFile);
formData.append('document_type', 'tech_pack');

// Upload
const token = localStorage.getItem('auth_token');

fetch('/api/v2/creator/documents/upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
    // Do NOT set Content-Type for FormData - browser will set it
  },
  body: formData
})
  .then(res => res.json())
  .then(data => {
    console.log('Upload Response:', data);
    if (data.status) {
      console.log('SUCCESS! Document uploaded:', data.document);
    } else {
      console.error('Upload failed:', data.message, data.errors);
    }
  })
  .catch(err => console.error('Upload Error:', err));


// ============================================
// STEP 4: Check Network Tab
// ============================================

// In browser DevTools:
// 1. Go to Network tab (F12 → Network)
// 2. Try uploading a document
// 3. Look for POST request to /api/v2/creator/documents/upload
// 4. Check the response - what does the server say?
// 5. Check the request headers - is Authorization header present?


// ============================================
// STEP 5: Check Browser Console
// ============================================

// Open F12 → Console tab
// Look for any error messages
// Should show upload attempts and results


// ============================================
// STEP 6: Check Component State (React DevTools)
// ============================================

// Install React DevTools extension
// In Components tab, find DocumentsSection
// Check if 'token' is available in useAuth()
// Check if 'documents' state is being updated
// Check if 'error' is being set


// ============================================
// COMMON ISSUES & SOLUTIONS
// ============================================

/*
ISSUE 1: Token is null/undefined
SOLUTION:
  - Make sure you're logged in
  - Check localStorage for 'auth_token'
  - If empty, login again
  - Clear localStorage and login fresh

ISSUE 2: API returns 401 Unauthorized
SOLUTION:
  - Token is invalid or expired
  - Login again
  - Make sure token is being sent in Authorization header
  - Check if header is: "Bearer YOUR_TOKEN"

ISSUE 3: API returns 404 Not Found
SOLUTION:
  - Route doesn't exist
  - Routes might not be registered
  - Run: php artisan route:cache (clear cache)
  - Or restart PHP server

ISSUE 4: API returns 422 Validation Failed
SOLUTION:
  - File is too large (max 10MB)
  - Wrong file type (must be PDF/JPG/PNG/GIF)
  - Check error message for details

ISSUE 5: Network error / CORS issue
SOLUTION:
  - Backend server not running
  - API URL is wrong
  - CORS headers misconfigured
  - Check if backend is on http://localhost:8000

ISSUE 6: File uploads but doesn't persist
SOLUTION:
  - Storage directory doesn't exist
  - Directory permissions issue
  - Storage symlink broken
  - Check storage/app/public/creator-documents/ exists
  - Check Laravel logs: storage/logs/laravel.log
*/


// ============================================
// BACKEND DEBUGGING
// ============================================

// Check Laravel logs
// tail -f storage/logs/laravel.log

// Check if storage directory exists
// ls -la storage/app/public/creator-documents/

// Check if symlink exists
// ls -la public/storage

// Check database migration
// php artisan migrate:status | grep creator_documents

// Check uploaded files in database
// SELECT * FROM creator_documents;

// Check file storage
// ls storage/app/public/creator-documents/

// Clear Laravel cache
// php artisan config:cache
// php artisan cache:clear
// php artisan route:cache


// ============================================
// QUICK CHECKLIST
// ============================================

/*
☐ Backend server running (php artisan serve)
☐ Frontend server running (npm run dev)
☐ Logged in as creator
☐ Token exists in localStorage
☐ Storage directory created: storage/app/public/creator-documents/
☐ Migration applied: 2025_01_27_create_creator_documents_table
☐ Routes in api.php include DocumentController
☐ DocumentController.php file exists
☐ No PHP syntax errors in DocumentController
☐ CreatorDocument model exists
☐ auth-context.tsx exports token
☐ DocumentsSection imports { token } from useAuth()
☐ Network requests show Authorization header
☐ API returns correct status codes
☐ Database has creator_documents table
*/
