<?php

namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use App\Models\Creator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class CampaignController extends Controller
{
    /**
     * Create a new campaign
     */
    public function store(Request $request)
    {
        try {
            // Debug logging - log the raw request
            Log::info('Campaign store() called - Raw Request Data', [
                'content_type' => $request->header('Content-Type'),
                'request_keys' => array_keys($request->all()),
                'has_files' => $request->hasFile('product_images') || $request->hasFile('tech_pack_file'),
                'file_keys' => array_keys($request->allFiles()),
            ]);

            // Debug logging
            $authHeader = $request->header('Authorization');
            $user = $request->user();

            Log::info('Campaign store() called with details', [
                'method' => $request->method(),
                'path' => $request->path(),
                'has_auth_header' => !empty($authHeader),
                'auth_header_preview' => $authHeader ? substr($authHeader, 0, 30) . '...' : null,
                'user_id' => $user?->id,
                'user_email' => $user?->email,
                'is_authenticated' => $user !== null,
            ]);

            if (!$user) {
                Log::warning('Campaign creation rejected - not authenticated', [
                    'auth_header' => !empty($authHeader),
                    'timestamp' => now()
                ]);
                return response()->json([
                    'status' => false,
                    'message' => 'Authentication required. Please log in.',
                    'error' => 'Unauthenticated'
                ], 401);
            }

            // Check if user is a creator
            $creator = Creator::where('user_id', $user->id)->first();
            if (!$creator) {
                Log::warning('Campaign creation rejected - user is not a creator', ['user_id' => $user->id]);
                return response()->json([
                    'status' => false,
                    'message' => 'You must be a registered creator to launch campaigns. Please complete your creator profile first.',
                    'error' => 'creator_not_found'
                ], 403);
            }

            // Validation rules
            $rules = [
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'funding_goal' => 'required|numeric|min:0.01',
                'product_name' => 'required|string|max:255',
                'product_description' => 'nullable|string',
                'materials' => 'nullable|array',
                'colors' => 'nullable|array',
                'sizes' => 'nullable|array',
                'projectDuration' => 'nullable|integer|min:30|max:60',
            ];

            $validator = Validator::make($request->all(), $rules);
            if ($validator->fails()) {
                Log::warning('Campaign creation failed: Validation error', [
                    'user_id' => $user->id,
                    'errors' => $validator->errors()->toArray()
                ]);
                return response()->json([
                    'status' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Create campaign
            $campaign = Campaign::create([
                'creator_id' => $creator->id,
                'user_id' => $user->id,
                'status' => 'draft',
                'title' => $request->title,
                'description' => $request->description,
                'funding_goal' => $request->funding_goal,
                'product_name' => $request->product_name,
                'product_description' => $request->product_description,
                'materials' => $request->materials ?? null,
                'colors' => $request->colors ?? null,
                'sizes' => $request->sizes ?? null,
                'days_active' => $request->projectDuration ?? 90,
            ]);

            Log::info('Campaign created successfully', [
                'campaign_id' => $campaign->id,
                'creator_id' => $creator->id,
                'user_id' => $user->id,
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Campaign created successfully',
                'campaign' => $campaign
            ], 201);
        } catch (\Throwable $e) {
            Log::error('Campaign creation failed', [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'status' => false,
                'message' => 'Campaign creation failed',
                'error' => config('app.debug') ? $e->getMessage() : 'An error occurred'
            ], 500);
        }
    }

    /**
     * Upload files for a campaign (images and tech pack)
     */
    public function uploadFiles(Request $request, $campaignId)
    {
        Log::info('uploadFiles() method called', [
            'campaign_id' => $campaignId,
            'method' => $request->method(),
            'content_type' => $request->header('Content-Type'),
        ]);
        
        try {
            $user = $request->user();
            
            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'Authentication required'
                ], 401);
            }

            // Get the campaign
            $campaign = Campaign::findOrFail($campaignId);
            
            // Verify user owns this campaign
            if ($campaign->user_id !== $user->id) {
                Log::warning('Unauthorized file upload attempt', [
                    'campaign_id' => $campaignId,
                    'user_id' => $user->id,
                    'campaign_owner_id' => $campaign->user_id
                ]);
                return response()->json([
                    'status' => false,
                    'message' => 'Unauthorized'
                ], 403);
            }

            // Log incoming file data for debugging
            Log::info('File upload request received', [
                'campaign_id' => $campaignId,
                'has_product_images' => $request->hasFile('product_images'),
                'has_tech_pack' => $request->hasFile('tech_pack_file'),
                'request_keys' => array_keys($request->allFiles()),
                'product_images_type' => is_array($request->file('product_images')) ? 'array' : 'single',
                'all_files_info' => collect($request->allFiles())->map(function($file, $key) {
                    if (is_array($file)) {
                        return [
                            'key' => $key,
                            'count' => count($file),
                            'type' => 'array',
                            'first_item' => get_class($file[0] ?? null)
                        ];
                    }
                    return [
                        'key' => $key,
                        'type' => get_class($file),
                        'valid' => $file instanceof \Illuminate\Http\UploadedFile ? $file->isValid() : false,
                        'real_path' => $file instanceof \Illuminate\Http\UploadedFile ? $file->getRealPath() : 'N/A'
                    ];
                })->toArray(),
            ]);

            // For validation, we don't need to validate files separately since we'll handle them directly
            // This avoids issues with FormData array handling

            $uploadedImages = [];
            $techPackPath = null;

            try {
                // Handle product images
                $images = [];
                $imageMetadata = [];
                $uploadedImages = [];
                $imageErrors = [];
                
                // When FormData is sent with multiple appends of the same key,
                // Laravel's request->file() only returns the first one
                // We need to manually parse the raw request input
                
                $allInput = $request->all();
                $allFiles = $request->allFiles();
                
                Log::info('Checking all input and files', [
                    'campaign_id' => $campaignId,
                    'input_keys' => array_keys($allInput),
                    'file_keys' => array_keys($allFiles),
                    'all_files_count' => count($allFiles),
                ]);
                
                // Log detailed file information
                if (isset($allFiles['product_images'])) {
                    $productImages = $allFiles['product_images'];
                    Log::info('Product images received', [
                        'campaign_id' => $campaignId,
                        'is_array' => is_array($productImages),
                        'count' => is_array($productImages) ? count($productImages) : 1,
                        'first_item_type' => is_array($productImages) ? get_class($productImages[0] ?? null) : get_class($productImages),
                    ]);
                }
                
                // Parse image metadata from JSON
                if (isset($allInput['image_metadata'])) {
                    try {
                        $imageMetadata = json_decode($allInput['image_metadata'], true);
                        if (!is_array($imageMetadata)) {
                            $imageMetadata = [];
                        }
                        Log::info('Parsed image metadata', [
                            'campaign_id' => $campaignId,
                            'metadata_count' => count($imageMetadata),
                            'metadata' => $imageMetadata
                        ]);
                    } catch (\Exception $e) {
                        Log::warning('Failed to parse image metadata', [
                            'campaign_id' => $campaignId,
                            'error' => $e->getMessage()
                        ]);
                    }
                }
                
                // Method 1: Check for product_images[] (array notation - most reliable)
                if (isset($allFiles['product_images[]'])) {
                    $productImages = $allFiles['product_images[]'];
                    if (is_array($productImages)) {
                        $images = $productImages;
                    } else {
                        $images = [$productImages];
                    }
                    Log::info('Found images using product_images[] notation', [
                        'campaign_id' => $campaignId,
                        'count' => count($images)
                    ]);
                } 
                // Method 2: Check if product_images exists in files (supports old style)
                else if (isset($allFiles['product_images'])) {
                    $productImages = $allFiles['product_images'];
                    if (is_array($productImages)) {
                        $images = $productImages;
                    } else {
                        $images = [$productImages];
                    }
                    Log::info('Found images using product_images notation', [
                        'campaign_id' => $campaignId,
                        'count' => count($images)
                    ]);
                } 
                // Method 3: Check for bracket notation with numeric indices (product_images[0], product_images[1], etc.)
                else {
                    $bracketImages = [];
                    $index = 0;
                    while ($request->hasFile("product_images[$index]")) {
                        $file = $request->file("product_images[$index]");
                        if ($file) {
                            $bracketImages[] = $file;
                        }
                        $index++;
                    }
                    if (!empty($bracketImages)) {
                        $images = $bracketImages;
                        Log::info('Found images using bracket notation', [
                            'campaign_id' => $campaignId,
                            'count' => count($images)
                        ]);
                    }
                }
                
                // Method 2: If still empty, try using hasFile/file
                if (empty($images) && $request->hasFile('product_images')) {
                    $files = $request->file('product_images');
                    if (is_array($files)) {
                        $images = $files;
                    } else {
                        $images = [$files];
                    }
                }

                Log::info('Processing product images', [
                    'campaign_id' => $campaignId,
                    'image_count' => count($images),
                    'metadata_count' => count($imageMetadata),
                    'files_found_in_allfiles' => isset($allFiles['product_images']),
                ]);
                
                // Log each image for debugging
                foreach ($images as $idx => $img) {
                    if ($img instanceof \Illuminate\Http\UploadedFile) {
                        Log::info('Image found in array', [
                            'campaign_id' => $campaignId,
                            'index' => $idx,
                            'name' => $img->getClientOriginalName(),
                            'size' => $img->getSize(),
                            'valid' => $img->isValid(),
                        ]);
                    }
                }

                foreach ($images as $fileIndex => $image) {
                    try {
                        // Skip null or invalid files
                        if (!$image) {
                            $errorMsg = "Null image at index $fileIndex";
                            Log::warning($errorMsg, ['campaign_id' => $campaignId]);
                            $imageErrors[] = ['index' => $fileIndex, 'error' => $errorMsg];
                            continue;
                        }

                        if (!($image instanceof \Illuminate\Http\UploadedFile)) {
                            $errorMsg = "File at index $fileIndex is not UploadedFile: " . get_class($image);
                            Log::warning($errorMsg, ['campaign_id' => $campaignId]);
                            $imageErrors[] = ['index' => $fileIndex, 'error' => $errorMsg];
                            continue;
                        }

                        if (!$image->isValid()) {
                            $errorMsg = "Invalid image file at index $fileIndex: " . $image->getErrorMessage();
                            Log::warning($errorMsg, [
                                'campaign_id' => $campaignId,
                                'name' => $image->getClientOriginalName(),
                                'error_code' => $image->getError()
                            ]);
                            $imageErrors[] = ['index' => $fileIndex, 'name' => $image->getClientOriginalName(), 'error' => $errorMsg];
                            continue;
                        }

                        // Get the image type from metadata using fileIndex
                        $imageType = 'additional';
                        $imageName = $image->getClientOriginalName();
                        
                        // Find metadata entry for this file index
                        foreach ($imageMetadata as $meta) {
                            if (isset($meta['fileIndex']) && $meta['fileIndex'] == $fileIndex) {
                                $imageType = $meta['type'] ?? 'additional';
                                $imageName = $meta['name'] ?? $imageName;
                                break;
                            }
                        }

                        Log::info('Processing image', [
                            'campaign_id' => $campaignId,
                            'file_index' => $fileIndex,
                            'type' => $imageType,
                            'name' => $imageName,
                            'original_name' => $image->getClientOriginalName(),
                            'size' => $image->getSize(),
                            'mime' => $image->getMimeType(),
                        ]);

                        // Get the original extension safely
                        $extension = $image->getClientOriginalExtension();
                        if (empty($extension)) {
                            // Try to determine from mime type
                            $mime = $image->getMimeType();
                            $mimeToExt = [
                                'image/jpeg' => 'jpg',
                                'image/png' => 'png',
                                'image/gif' => 'gif',
                                'image/webp' => 'webp',
                            ];
                            $extension = $mimeToExt[$mime] ?? 'jpg';
                        }

                        // Store image with a unique name
                        $filename = 'campaign_' . $campaignId . '_' . $imageType . '_' . time() . '_' . uniqid() . '.' . $extension;
                        $directory = 'campaigns/products';
                        
                        Log::info('About to store image file', [
                            'campaign_id' => $campaignId,
                            'type' => $imageType,
                            'filename' => $filename,
                            'directory' => $directory,
                            'original_name' => $image->getClientOriginalName(),
                            'size' => $image->getSize(),
                            'mime' => $image->getMimeType(),
                            'extension' => $extension,
                        ]);

                        try {
                            // Validate file before storing
                            if (!$image->isValid()) {
                                throw new \Exception('Invalid file: ' . $image->getErrorMessage());
                            }
                            
                            // Get file info
                            $originalName = $image->getClientOriginalName();
                            $fileSize = $image->getSize();
                            
                            Log::info('Starting file storage', [
                                'campaign_id' => $campaignId,
                                'original_name' => $originalName,
                                'size' => $fileSize,
                                'mime' => $image->getMimeType(),
                                'temp_path' => $image->getRealPath(),
                            ]);
                            
                            // Create the destination directory if it doesn't exist
                            // Use DIRECTORY_SEPARATOR for cross-platform compatibility
                            $fullDirectory = storage_path('app' . DIRECTORY_SEPARATOR . 'public' . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $directory));
                            if (!is_dir($fullDirectory)) {
                                mkdir($fullDirectory, 0755, true);
                                Log::info('Created directory', [
                                    'path' => $fullDirectory
                                ]);
                            }
                            
                            // Create unique filename
                            $uniqueFilename = 'campaign_' . $campaignId . '_' . $imageType . '_' . time() . '_' . uniqid() . '.' . $extension;
                            $fullPath = $fullDirectory . DIRECTORY_SEPARATOR . $uniqueFilename;
                            
                            Log::info('About to store file', [
                                'campaign_id' => $campaignId,
                                'destination' => $fullPath,
                                'file_size' => $image->getSize(),
                            ]);
                            
                            // Get the temp file path - getPathname() works for multipart uploads
                            $tempPath = $image->getPathname();
                            
                            Log::info('Temp file info', [
                                'temp_path' => $tempPath,
                                'exists' => file_exists($tempPath),
                                'readable' => is_readable($tempPath),
                                'size' => file_exists($tempPath) ? filesize($tempPath) : 'N/A'
                            ]);
                            
                            // Copy the file directly
                            if (!file_exists($tempPath) || !is_readable($tempPath)) {
                                throw new \Exception('Uploaded file temp path not accessible: ' . $tempPath);
                            }
                            
                            if (!copy($tempPath, $fullPath)) {
                                throw new \Exception('Failed to copy uploaded file from: ' . $tempPath . ' to: ' . $fullPath);
                            }
                            chmod($fullPath, 0644);
                            Log::info('File copied successfully', [
                                'campaign_id' => $campaignId,
                                'destination' => $fullPath,
                            ]);
                            
                            // Verify file was created
                            if (!file_exists($fullPath)) {
                                throw new \Exception('File does not exist after upload: ' . $fullPath);
                            }
                            
                            // Make sure it's readable and writable
                            chmod($fullPath, 0644);
                            
                            // Store relative path for database
                            $storagePath = $directory . '/' . $uniqueFilename;
                            
                            Log::info('File copied successfully', [
                                'campaign_id' => $campaignId,
                                'storage_path' => $storagePath,
                                'full_path' => $fullPath,
                                'file_exists' => file_exists($fullPath),
                                'file_size' => filesize($fullPath),
                            ]);
                            
                        } catch (\Exception $storeError) {
                            Log::error('Storage store failed', [
                                'campaign_id' => $campaignId,
                                'type' => $imageType,
                                'original_name' => $image->getClientOriginalName(),
                                'error' => $storeError->getMessage(),
                                'trace' => $storeError->getTraceAsString(),
                            ]);
                            $imageErrors[] = ['index' => $fileIndex, 'type' => $imageType, 'error' => $storeError->getMessage()];
                            continue;
                        }
                        
                        if (!$storagePath) {
                            $errorMsg = "File storage returned empty path";
                            Log::error($errorMsg, [
                                'campaign_id' => $campaignId,
                                'type' => $imageType,
                            ]);
                            $imageErrors[] = ['index' => $fileIndex, 'type' => $imageType, 'error' => $errorMsg];
                            continue;
                        }

                        $uploadedImages[] = [
                            'type' => $imageType,
                            'path' => $storagePath,
                            'url' => Storage::disk('public')->url($storagePath),
                            'name' => $image->getClientOriginalName(),
                            'size' => $image->getSize(),
                            'uploaded_at' => now()->toIso8601String()
                        ];

                    } catch (\Exception $e) {
                        $errorMsg = "Exception processing image at index $fileIndex: " . $e->getMessage();
                        Log::error($errorMsg, [
                            'campaign_id' => $campaignId,
                            'file_index' => $fileIndex,
                            'image_type' => $imageType ?? 'unknown',
                            'error_code' => $e->getCode(),
                            'trace' => $e->getTraceAsString()
                        ]);
                        $imageErrors[] = ['index' => $fileIndex, 'type' => $imageType ?? 'unknown', 'error' => $errorMsg];
                    }
                }

                if (empty($images)) {
                    Log::info('No product images in request', ['campaign_id' => $campaignId]);
                }

                // Handle tech pack PDF
                if ($request->hasFile('tech_pack_file')) {
                    $file = $request->file('tech_pack_file');
                    
                    if ($file && $file instanceof \Illuminate\Http\UploadedFile && $file->isValid()) {
                        try {
                            $directory = 'campaigns/tech-packs';
                            $filename = 'campaign_' . $campaignId . '_techpack_' . time() . '_' . uniqid() . '.pdf';
                            
                            Log::info('Storing tech pack', [
                                'campaign_id' => $campaignId,
                                'filename' => $filename,
                                'original_name' => $file->getClientOriginalName(),
                                'size' => $file->getSize(),
                                'mime' => $file->getMimeType(),
                            ]);
                            // Create the destination directory if it doesn't exist
                            // Use DIRECTORY_SEPARATOR for cross-platform compatibility
                            $fullDirectory = storage_path('app' . DIRECTORY_SEPARATOR . 'public' . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $directory));
                            if (!is_dir($fullDirectory)) {
                                mkdir($fullDirectory, 0755, true);
                                Log::info('Created tech pack directory', [
                                    'path' => $fullDirectory
                                ]);
                            }
                            
                            // Create full path
                            $fullPath = $fullDirectory . DIRECTORY_SEPARATOR . $filename;
                            
                            Log::info('About to store tech pack file', [
                                'campaign_id' => $campaignId,
                                'destination' => $fullPath,
                                'file_size' => $file->getSize(),
                            ]);
                            
                            // Get the temp file path - getPathname() works for multipart uploads
                            $tempPath = $file->getPathname();
                            
                            Log::info('Temp file info for tech pack', [
                                'temp_path' => $tempPath,
                                'exists' => file_exists($tempPath),
                                'readable' => is_readable($tempPath),
                                'size' => file_exists($tempPath) ? filesize($tempPath) : 'N/A'
                            ]);
                            
                            // Copy the file directly
                            if (!file_exists($tempPath) || !is_readable($tempPath)) {
                                throw new \Exception('Uploaded tech pack temp path not accessible: ' . $tempPath);
                            }
                            
                            if (!copy($tempPath, $fullPath)) {
                                throw new \Exception('Failed to copy tech pack file from: ' . $tempPath . ' to: ' . $fullPath);
                            }
                            chmod($fullPath, 0644);
                            Log::info('Tech pack copied successfully', [
                                'campaign_id' => $campaignId,
                                'destination' => $fullPath,
                            ]);
                            
                            // Verify file was created
                            if (!file_exists($fullPath)) {
                                throw new \Exception('Tech pack file does not exist after upload: ' . $fullPath);
                            }
                            
                            // Make sure it's readable and writable
                            chmod($fullPath, 0644);
                            
                            // Store relative path for database
                            $techPackPath = $directory . '/' . $filename;
                            
                            Log::info('Tech pack stored successfully', [
                                'campaign_id' => $campaignId,
                                'path' => $techPackPath,
                                'full_path' => $fullPath,
                                'file_exists' => file_exists($fullPath),
                                'file_size' => filesize($fullPath),
                            ]);
                            
                        } catch (\Exception $moveError) {
                            Log::error('Storage failed for tech pack', [
                                'campaign_id' => $campaignId,
                                'error' => $moveError->getMessage(),
                                'trace' => $moveError->getTraceAsString(),
                            ]);
                            $techPackPath = null;
                        }
                        
                        if ($techPackPath) {
                            Log::info('Tech pack uploaded successfully', [
                                'campaign_id' => $campaignId,
                                'path' => $techPackPath
                            ]);
                        }
                    } else {
                        Log::warning('Tech pack file is not valid', [
                            'campaign_id' => $campaignId,
                            'is_uploaded_file' => $file instanceof \Illuminate\Http\UploadedFile,
                            'is_valid' => $file?->isValid(),
                        ]);
                    }
                } else {
                    Log::info('No tech pack in request', ['campaign_id' => $campaignId]);
                }

                // Update campaign with file information
                $updateData = [];
                
                if (!empty($uploadedImages)) {
                    // Store as array directly - Laravel's 'array' cast will handle JSON encoding
                    $updateData['product_images'] = $uploadedImages;
                }
                
                if ($techPackPath) {
                    $updateData['tech_pack_file'] = $techPackPath;
                }

                if (!empty($updateData)) {
                    // For product_images, we need to merge with existing images instead of replacing
                    if (isset($updateData['product_images'])) {
                        $newImages = $updateData['product_images'];
                        $existingImages = $campaign->product_images ?? [];
                        
                        // Convert to array if it's a string
                        if (is_string($existingImages)) {
                            try {
                                $existingImages = json_decode($existingImages, true) ?? [];
                            } catch (\Exception $e) {
                                $existingImages = [];
                            }
                        }
                        
                        if (!is_array($existingImages)) {
                            $existingImages = [];
                        }
                        
                        // Merge: remove old images of the same type, add new ones
                        foreach ($newImages as $newImage) {
                            // Remove any existing images of the same type
                            $existingImages = array_filter($existingImages, function($img) use ($newImage) {
                                return ($img['type'] ?? null) !== ($newImage['type'] ?? null);
                            });
                        }
                        
                        // Add the new images
                        $updateData['product_images'] = array_merge($existingImages, $newImages);
                        
                        Log::info('Merged product images', [
                            'campaign_id' => $campaignId,
                            'existing_count' => count($existingImages),
                            'new_count' => count($newImages),
                            'merged_count' => count($updateData['product_images'])
                        ]);
                    }
                    
                    $campaign->update($updateData);
                }

                return response()->json([
                    'status' => true,
                    'message' => 'Files uploaded successfully',
                    'campaign_id' => $campaignId,
                    'uploaded_images' => $uploadedImages,
                    'uploaded_count' => count($uploadedImages),
                    'failed_count' => count($imageErrors),
                    'image_errors' => $imageErrors,
                    'tech_pack_uploaded' => !empty($techPackPath),
                ], 200);
            } catch (\Exception $e) {
                Log::error('File upload processing failed', [
                    'campaign_id' => $campaignId,
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
                throw $e;
            }
        } catch (\Throwable $e) {
            Log::error('Campaign file upload failed', [
                'campaign_id' => $campaignId,
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'status' => false,
                'message' => 'File upload failed',
                'error' => config('app.debug') ? $e->getMessage() : 'An error occurred'
            ], 500);
        }
    }

    /**
     * Get campaign by ID
     */
    public function show($campaignId)
    {
        $campaign = Campaign::with(['creator', 'pledges'])->find($campaignId);
        if (!$campaign) {
            return response()->json([
                'status' => false,
                'message' => 'Campaign not found'
            ], 404);
        }

        // Ensure product_images is an array, not null
        if (!$campaign->product_images) {
            $campaign->product_images = [];
        } elseif (is_string($campaign->product_images)) {
            // In case it's a string, try to decode it
            try {
                $decoded = json_decode($campaign->product_images, true);
                $campaign->product_images = is_array($decoded) ? $decoded : [];
            } catch (\Exception $e) {
                $campaign->product_images = [];
            }
        }

        return response()->json([
            'status' => true,
            'campaign' => $campaign,
            'funding_percentage' => $campaign->getFundingPercentage(),
            'days_remaining' => $campaign->getDaysRemaining(),
            'is_funded' => $campaign->isFunded(),
            'is_active' => $campaign->isActive(),
        ]);
    }

    /**
     * Get all campaigns by current user (creator)
     */
    public function getCampaigns(Request $request)
    {
        try {
            $user = $request->user();
            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'Authentication required'
                ], 401);
            }

            // Select specific columns including product_images
            $campaigns = Campaign::where('user_id', $user->id)
                ->select([
                    'id', 'creator_id', 'user_id', 'status', 'title', 'description',
                    'funding_goal', 'current_funding', 'backer_count', 'days_active',
                    'product_name', 'product_description', 'product_images', 'tech_pack_file',
                    'launch_date', 'end_date',
                    'created_at', 'updated_at'
                ])
                ->with(['creator'])
                ->orderBy('created_at', 'desc')
                ->paginate(10);

            // Ensure product_images is an array for each campaign
            $campaigns->getCollection()->transform(function ($campaign) {
                if (!$campaign->product_images) {
                    $campaign->product_images = [];
                } elseif (is_string($campaign->product_images)) {
                    try {
                        $decoded = json_decode($campaign->product_images, true);
                        $campaign->product_images = is_array($decoded) ? $decoded : [];
                    } catch (\Exception $e) {
                        $campaign->product_images = [];
                    }
                }
                return $campaign;
            });

            // Log campaign statuses
            Log::info('Returning campaigns for user', [
                'user_id' => $user->id,
                'campaign_count' => $campaigns->count(),
                'statuses' => $campaigns->pluck('status')->toArray()
            ]);

            return response()->json([
                'status' => true,
                'campaigns' => $campaigns
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching campaigns', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'status' => false,
                'message' => 'Error fetching campaigns',
                'error' => config('app.debug') ? $e->getMessage() : 'An error occurred'
            ], 500);
        }
    }

    /**
     * Get all campaigns by current user (creator)
     */
    public function creatorCampaigns(Request $request)
    {
        try {
            $user = $request->user();
            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'Authentication required'
                ], 401);
            }

            // Select specific columns including product_images
            $campaigns = Campaign::where('user_id', $user->id)
                ->select([
                    'id', 'creator_id', 'user_id', 'status', 'title', 'description',
                    'funding_goal', 'current_funding', 'backer_count', 'days_active',
                    'product_name', 'product_description', 'product_images', 'tech_pack_file',
                    'launch_date', 'end_date',
                    'created_at', 'updated_at'
                ])
                ->with(['creator'])
                ->orderBy('created_at', 'desc')
                ->paginate(10);

            // Ensure product_images is an array for each campaign
            $campaigns->getCollection()->transform(function ($campaign) {
                if (!$campaign->product_images) {
                    $campaign->product_images = [];
                } elseif (is_string($campaign->product_images)) {
                    try {
                        $decoded = json_decode($campaign->product_images, true);
                        $campaign->product_images = is_array($decoded) ? $decoded : [];
                    } catch (\Exception $e) {
                        $campaign->product_images = [];
                    }
                }
                return $campaign;
            });

            return response()->json([
                'status' => true,
                'campaigns' => $campaigns
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching creator campaigns', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'status' => false,
                'message' => 'Error fetching campaigns',
                'error' => config('app.debug') ? $e->getMessage() : 'An error occurred'
            ], 500);
        }
    }

    /**
     * Update a campaign
     */
    public function update(Request $request, $campaignId)
    {
        try {
            $user = $request->user();
            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'Authentication required'
                ], 401);
            }

            $campaign = Campaign::findOrFail($campaignId);

            Log::info('Campaign update attempt', [
                'campaign_id' => $campaignId,
                'user_id' => $user->id,
                'request_all' => $request->all(),
                'request_has_status' => $request->has('status'),
                'status_value' => $request->input('status'),
                'end_date_value' => $request->input('end_date')
            ]);

            // Verify user owns this campaign
            if ($campaign->user_id !== $user->id) {
                return response()->json([
                    'status' => false,
                    'message' => 'Unauthorized'
                ], 403);
            }

            // Update allowed fields
            $allowed = [
                'title', 'description', 'funding_goal', 'product_name',
                'product_description', 'materials', 'colors', 'sizes', 'days_active', 'status', 'end_date'
            ];

            $data = [];
            foreach ($allowed as $field) {
                if ($request->has($field)) {
                    // The model's array casts will handle JSON conversion automatically
                    $data[$field] = $request->input($field);
                }
            }

            Log::info('Campaign update data prepared', [
                'campaign_id' => $campaignId,
                'fields_to_update' => array_keys($data),
                'data' => $data,
                'current_status' => $campaign->status,
                'new_status' => $data['status'] ?? 'not provided'
            ]);

            $campaign->update($data);

            // Refresh to get updated data
            $campaign->refresh();

            Log::info('Campaign updated successfully', [
                'campaign_id' => $campaignId,
                'user_id' => $user->id,
                'updated_status' => $campaign->status
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Campaign updated successfully',
                'campaign' => $campaign
            ]);
        } catch (\Throwable $e) {
            Log::error('Campaign update failed', [
                'error' => $e->getMessage(),
                'campaign_id' => $campaignId,
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'status' => false,
                'message' => 'Campaign update failed',
                'error' => config('app.debug') ? $e->getMessage() : 'An error occurred'
            ], 500);
        }
    }

    /**
     * Submit campaign for review
     */
    public function submitForReview(Request $request, $campaignId)
    {
        try {
            $user = $request->user();
            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'Authentication required'
                ], 401);
            }

            $campaign = Campaign::findOrFail($campaignId);

            if ($campaign->user_id !== $user->id) {
                return response()->json([
                    'status' => false,
                    'message' => 'Unauthorized'
                ], 403);
            }

            if ($campaign->status !== 'draft') {
                return response()->json([
                    'status' => false,
                    'message' => 'Only draft campaigns can be submitted for review'
                ], 422);
            }

            $campaign->update(['status' => 'pending_review']);

            Log::info('Campaign submitted for review', [
                'campaign_id' => $campaignId,
                'user_id' => $user->id
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Campaign submitted for review',
                'campaign' => $campaign
            ]);
        } catch (\Throwable $e) {
            Log::error('Campaign submit for review failed', [
                'error' => $e->getMessage(),
                'campaign_id' => $campaignId
            ]);
            return response()->json([
                'status' => false,
                'message' => 'Failed to submit campaign for review',
                'error' => config('app.debug') ? $e->getMessage() : 'An error occurred'
            ], 500);
        }
    }

    /**
     * Launch a campaign
     */
    public function launch(Request $request, $campaignId)
    {
        try {
            $user = $request->user();
            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'Authentication required'
                ], 401);
            }

            $campaign = Campaign::findOrFail($campaignId);

            Log::info('Campaign launch attempt', [
                'campaign_id' => $campaignId,
                'current_status' => $campaign->status,
                'user_id' => $user->id
            ]);

            if ($campaign->user_id !== $user->id) {
                return response()->json([
                    'status' => false,
                    'message' => 'Unauthorized'
                ], 403);
            }

            if ($campaign->status !== 'pending_review' && $campaign->status !== 'draft') {
                Log::warning('Campaign cannot be launched', [
                    'campaign_id' => $campaignId,
                    'current_status' => $campaign->status
                ]);
                return response()->json([
                    'status' => false,
                    'message' => 'Campaign must be in draft or pending_review status to launch. Current status: ' . $campaign->status
                ], 422);
            }

            Log::info('Updating campaign status', [
                'campaign_id' => $campaignId,
                'from_status' => $campaign->status,
                'to_status' => 'live'
            ]);

            // Use raw DB query to update to ensure no Laravel magic interferes
            DB::table('campaigns')
                ->where('id', $campaignId)
                ->update([
                    'status' => 'live',
                    'launch_date' => now()
                ]);

            // Refresh campaign from database to ensure we have latest data
            $campaign->refresh();

            Log::info('Campaign launched successfully', [
                'campaign_id' => $campaignId,
                'status_after_update' => $campaign->status,
                'user_id' => $user->id
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Campaign launched successfully',
                'campaign' => $campaign
            ]);
        } catch (\Throwable $e) {
            Log::error('Campaign launch failed', [
                'error' => $e->getMessage(),
                'campaign_id' => $campaignId,
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'status' => false,
                'message' => 'Failed to launch campaign',
                'error' => config('app.debug') ? $e->getMessage() : 'An error occurred'
            ], 500);
        }
    }

    /**
     * Get all active/live campaigns (public endpoint for discover page)
     * Returns mock data if no live campaigns exist (for testing)
     */
    public function getActiveCampaigns(Request $request)
    {
        try {
            $perPage = (int) $request->get('per_page', 12);
            $perPage = min($perPage, 100);
            $page = (int) $request->get('page', 1);
            $category = $request->get('category');
            $search = $request->get('search');
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = strtolower($request->get('sort_order', 'desc'));
            $sortOrder = in_array($sortOrder, ['asc', 'desc']) ? $sortOrder : 'desc';

            $query = Campaign::where('status', 'live')
                ->where(function ($q) {
                    $q->whereNull('end_date')
                      ->orWhere('end_date', '>', now());
                })
                ->select([
                    'id', 'creator_id', 'user_id', 'title', 'description',
                    'funding_goal', 'current_funding', 'backer_count',
                    'product_name', 'product_images', 'launch_date', 'end_date',
                    'created_at', 'views', 'shares'
                ])
                ->with(['creator:id,brand_name,profile_image']);

            if ($category && !empty($category)) {
                $query->where('product_name', 'like', "%{$category}%")
                    ->orWhere('description', 'like', "%{$category}%");
            }

            if ($search && !empty($search)) {
                $searchTerm = "%{$search}%";
                $query->where(function ($q) use ($searchTerm) {
                    $q->where('title', 'like', $searchTerm)
                        ->orWhere('description', 'like', $searchTerm)
                        ->orWhereHas('creator', function ($creatorQuery) use ($searchTerm) {
                            $creatorQuery->where('brand_name', 'like', $searchTerm);
                        });
                });
            }

            switch ($sortBy) {
                case 'funding':
                    $query->orderBy('current_funding', $sortOrder);
                    break;
                case 'trending':
                    $query->orderByRaw('(views * 0.1 + shares * 1) ' . $sortOrder);
                    break;
                case 'ending-soon':
                    $query->orderBy('end_date', 'asc');
                    break;
                case 'created_at':
                default:
                    $query->orderBy('created_at', $sortOrder);
                    break;
            }

            $campaigns = $query->paginate($perPage, ['*'], 'page', $page);

            $campaigns->getCollection()->transform(function ($campaign) {
                // Properly handle product_images - decode if it's JSON or serialized
                $productImages = $campaign->product_images ?? [];
                if (is_string($productImages)) {
                    $decoded = json_decode($productImages, true);
                    $productImages = $decoded ?? [];
                }
                
                return [
                    'id' => $campaign->id,
                    'title' => $campaign->title,
                    'description' => $campaign->description,
                    'funding_goal' => (float) $campaign->funding_goal,
                    'current_funding' => (float) $campaign->current_funding,
                    'backer_count' => $campaign->backer_count,
                    'product_name' => $campaign->product_name,
                    'product_images' => $productImages,
                    'creator' => [
                        'id' => $campaign->creator->id ?? null,
                        'name' => $campaign->creator->brand_name ?? 'Unknown Creator',
                        'image' => $campaign->creator->profile_image ?? null,
                    ],
                    'launch_date' => $campaign->launch_date,
                    'end_date' => $campaign->end_date,
                    'days_remaining' => $campaign->getDaysRemaining(),
                    'funding_percentage' => $campaign->getFundingPercentage(),
                    'is_funded' => $campaign->isFunded(),
                    'views' => $campaign->views ?? 0,
                    'shares' => $campaign->shares ?? 0,
                ];
            });

            return response()->json([
                'status' => true,
                'data' => $campaigns->items(),
                'pagination' => [
                    'page' => $campaigns->currentPage(),
                    'per_page' => $campaigns->perPage(),
                    'total' => $campaigns->total(),
                    'total_pages' => $campaigns->lastPage(),
                    'has_more' => $campaigns->hasMorePages(),
                ],
                'debug' => [
                    'endpoint' => 'getActiveCampaigns',
                    'backend_running' => true,
                    'database_connected' => true,
                ]
            ])->header('Cache-Control', 'public, max-age=3600, s-maxage=3600')
              ->header('ETag', md5(json_encode($campaigns->items())));

        } catch (\Exception $e) {
            Log::error('Error fetching active campaigns', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => false,
                'message' => 'Error fetching campaigns',
                'error' => config('app.debug') ? $e->getMessage() : 'An error occurred',
                'debug' => [
                    'endpoint' => 'getActiveCampaigns',
                    'backend_running' => true,
                    'database_connected' => false,
                ]
            ], 500);
        }
    }
}
