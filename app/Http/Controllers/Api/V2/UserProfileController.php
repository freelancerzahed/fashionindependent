<?php

namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Image;

class UserProfileController extends Controller
{
    /**
     * Upload user profile image
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function uploadProfileImage(Request $request)
    {
        try {
            $request->validate([
                'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120', // 5MB max
            ]);

            $user = auth()->user();
            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'Unauthorized'
                ], 401);
            }

            // Store the image using the same method as campaign uploads
            $file = $request->file('image');
            
            // Get file extension safely
            $extension = $file->getClientOriginalExtension();
            if (empty($extension)) {
                // Fallback to guessing extension from MIME type
                $mimeToExt = [
                    'image/jpeg' => 'jpg',
                    'image/png' => 'png',
                    'image/gif' => 'gif',
                    'image/webp' => 'webp',
                ];
                $extension = $mimeToExt[$file->getClientMimeType()] ?? 'jpg';
            }
            
            // Create directory path
            $directory = 'uploads/profiles';
            $fullDirectory = storage_path('app' . DIRECTORY_SEPARATOR . 'public' . DIRECTORY_SEPARATOR . $directory);
            
            // Create directory if it doesn't exist
            if (!is_dir($fullDirectory)) {
                mkdir($fullDirectory, 0755, true);
            }
            
            // Create unique filename
            $fileName = 'profile_' . $user->id . '_' . time() . '_' . Str::random(8) . '.' . $extension;
            $fullPath = $fullDirectory . DIRECTORY_SEPARATOR . $fileName;
            
            // Copy the uploaded file
            $tempPath = $file->getPathname();
            if (!file_exists($tempPath) || !is_readable($tempPath)) {
                throw new \Exception('Uploaded file temp path not accessible: ' . $tempPath);
            }
            
            if (!copy($tempPath, $fullPath)) {
                throw new \Exception('Failed to copy uploaded file from: ' . $tempPath . ' to: ' . $fullPath);
            }
            
            chmod($fullPath, 0644);
            
            // Verify file was created
            if (!file_exists($fullPath)) {
                throw new \Exception('File does not exist after upload: ' . $fullPath);
            }
            
            // Delete old avatar if it exists
            if ($user->avatar_original) {
                $oldFullPath = storage_path('app' . DIRECTORY_SEPARATOR . 'public' . DIRECTORY_SEPARATOR . $user->avatar_original);
                if (file_exists($oldFullPath)) {
                    unlink($oldFullPath);
                }
            }
            
            // Store relative path for database - normalize to forward slashes
            $path = str_replace(storage_path('app' . DIRECTORY_SEPARATOR . 'public' . DIRECTORY_SEPARATOR), '', $fullPath);
            $path = str_replace(DIRECTORY_SEPARATOR, '/', $path);  // Normalize to forward slashes
            
            // Update user with new avatar path
            $user->avatar_original = $path;
            $user->save();

            return response()->json([
                'status' => true,
                'message' => 'Profile image uploaded successfully',
                'data' => [
                    'image_path' => $path,
                ]
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('[ProfileUpload] Validation error', ['errors' => $e->errors()]);
            return response()->json([
                'status' => false,
                'message' => 'Validation error',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('[ProfileUpload] Upload failed', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
            return response()->json([
                'status' => false,
                'message' => 'Failed to upload image: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user profile information
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function getProfile()
    {
        try {
            $user = auth()->user();
            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'Unauthorized'
                ], 401);
            }

            return response()->json([
                'status' => true,
                'data' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'avatar' => $user->avatar_original ? str_replace(DIRECTORY_SEPARATOR, '/', $user->avatar_original) : null,
                    'avatar_path' => $user->avatar_original ? str_replace(DIRECTORY_SEPARATOR, '/', $user->avatar_original) : null,
                    'user_type' => $user->user_type,
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch profile: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update user profile information
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateProfile(Request $request)
    {
        try {
            $request->validate([
                'name' => 'sometimes|string|max:255',
                'email' => 'sometimes|email|unique:users,email,' . auth()->id(),
                'bio' => 'sometimes|string|max:500',
            ]);

            $user = auth()->user();
            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'Unauthorized'
                ], 401);
            }

            // Update allowed fields
            if ($request->has('name')) {
                $user->name = $request->name;
            }
            if ($request->has('email')) {
                $user->email = $request->email;
            }
            if ($request->has('bio')) {
                $user->bio = $request->bio;
            }

            $user->save();

            return response()->json([
                'status' => true,
                'message' => 'Profile updated successfully',
                'data' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ]
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Validation error',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to update profile: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove user profile image
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function removeProfileImage()
    {
        try {
            $user = auth()->user();
            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'Unauthorized'
                ], 401);
            }

            // Delete old avatar if it exists
            if ($user->avatar_original) {
                Storage::disk('public')->delete($user->avatar_original);
                $user->avatar_original = null;
                $user->save();
            }

            return response()->json([
                'status' => true,
                'message' => 'Profile image removed successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to remove image: ' . $e->getMessage()
            ], 500);
        }
    }
}
