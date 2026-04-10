<?php

namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\Controller;
use App\Models\Creator;
use App\Models\CreatorDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class DocumentController extends Controller
{
    /**
     * Get all documents for the authenticated creator
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized'
            ], 401);
        }

        $creator = Creator::where('user_id', $user->id)->first();

        if (!$creator) {
            return response()->json([
                'status' => false,
                'message' => 'Creator profile not found'
            ], 404);
        }

        try {
            $documents = $creator->documents()
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($doc) {
                    return [
                        'id' => $doc->id,
                        'type' => $doc->document_type,
                        'fileName' => $doc->file_name,
                        'fileSize' => $doc->file_size,
                        'mimeType' => $doc->mime_type,
                        'status' => $doc->status,
                        'uploadedAt' => $doc->uploaded_at,
                        'verifiedAt' => $doc->verified_at,
                        'notes' => $doc->notes,
                        'filePath' => $doc->file_path,
                    ];
                });

            return response()->json([
                'status' => true,
                'documents' => $documents
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch creator documents', [
                'creator_id' => $creator->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch documents: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get documents by type
     */
    public function getByType(Request $request, $type)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized'
            ], 401);
        }

        $creator = Creator::where('user_id', $user->id)->first();

        if (!$creator) {
            return response()->json([
                'status' => false,
                'message' => 'Creator profile not found'
            ], 404);
        }

        try {
            $document = $creator->documents()
                ->byType($type)
                ->first();

            if (!$document) {
                return response()->json([
                    'status' => true,
                    'document' => null
                ]);
            }

            return response()->json([
                'status' => true,
                'document' => [
                    'id' => $document->id,
                    'type' => $document->document_type,
                    'fileName' => $document->file_name,
                    'fileSize' => $document->file_size,
                    'mimeType' => $document->mime_type,
                    'status' => $document->status,
                    'uploadedAt' => $document->uploaded_at,
                    'verifiedAt' => $document->verified_at,
                    'notes' => $document->notes,
                    'filePath' => $document->file_path,
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch document by type', [
                'creator_id' => $creator->id,
                'type' => $type,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch document: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Upload a document
     */
    public function upload(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized'
            ], 401);
        }

        $creator = Creator::where('user_id', $user->id)->first();

        if (!$creator) {
            return response()->json([
                'status' => false,
                'message' => 'Creator profile not found'
            ], 404);
        }

        // Validate request
        $validator = Validator::make($request->all(), [
            'document_type' => 'required|in:tech_pack,id_front,id_back',
            'file' => 'required|file|mimes:pdf,jpeg,jpg,png,gif|max:10240', // 10MB
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Extract and validate file
            $file = $request->file('file');
            
            Log::info('Upload attempt received', [
                'creator_id' => $creator->id,
                'has_file' => $file ? 'yes' : 'no',
                'file_class' => $file ? get_class($file) : 'null',
                'request_files' => array_keys($request->files->all())
            ]);
            
            if (!$file) {
                throw new \Exception('File upload failed: No file data received');
            }
            
            if (!($file instanceof \Illuminate\Http\UploadedFile)) {
                throw new \Exception('Invalid file object received');
            }
            
            $documentType = $request->input('document_type');
            
            Log::info('File received for upload', [
                'creator_id' => $creator->id,
                'document_type' => $documentType,
                'file_name' => $file->getClientOriginalName(),
                'file_size' => $file->getSize(),
                'file_mime' => $file->getMimeType(),
                'temp_path' => $file->getRealPath()
            ]);

            // Delete existing document of the same type
            $existingDoc = $creator->documents()
                ->where('document_type', $documentType)
                ->first();

            if ($existingDoc) {
                // Delete the old file if a valid path exists
                try {
                    if (!empty($existingDoc->file_path)) {
                        if (Storage::disk('public')->exists($existingDoc->file_path)) {
                            Storage::disk('public')->delete($existingDoc->file_path);
                        }
                    }
                } catch (\Exception $e) {
                    Log::warning('Failed to delete old file', [
                        'file_path' => $existingDoc->file_path,
                        'error' => $e->getMessage()
                    ]);
                    // Don't throw - continue with deletion
                }
                $existingDoc->delete();
            }

            // Store new file
            $fileName = $documentType . '_' . $creator->id . '_' . time() . '.' . $file->getClientOriginalExtension();
            
            Log::info('Attempting to store file', [
                'creator_id' => $creator->id,
                'fileName' => $fileName,
                'directory' => 'creator-documents'
            ]);
            
            try {
                // Use the same proven file storage pattern from CampaignController
                $directory = 'creator-documents';
                $fullDirectory = storage_path('app' . DIRECTORY_SEPARATOR . 'public' . DIRECTORY_SEPARATOR . $directory);
                
                // Ensure directory exists
                if (!is_dir($fullDirectory)) {
                    mkdir($fullDirectory, 0755, true);
                    Log::info('Created creator-documents directory', ['path' => $fullDirectory]);
                }
                
                // Create full path
                $fullPath = $fullDirectory . DIRECTORY_SEPARATOR . $fileName;
                
                Log::info('About to store document file', [
                    'creator_id' => $creator->id,
                    'destination' => $fullPath,
                    'file_size' => $file->getSize(),
                    'temp_path' => $file->getPathname()
                ]);
                
                // Get temp file path
                $tempPath = $file->getPathname();
                
                Log::info('Temp file info', [
                    'temp_path' => $tempPath,
                    'exists' => file_exists($tempPath),
                    'readable' => is_readable($tempPath),
                    'size' => file_exists($tempPath) ? filesize($tempPath) : 'N/A'
                ]);
                
                // Verify temp file is accessible
                if (!file_exists($tempPath) || !is_readable($tempPath)) {
                    throw new \Exception('Uploaded file temp path not accessible: ' . $tempPath);
                }
                
                // Copy file directly (same method used in CampaignController)
                if (!copy($tempPath, $fullPath)) {
                    throw new \Exception('Failed to copy uploaded file from: ' . $tempPath . ' to: ' . $fullPath);
                }
                
                // Set file permissions
                chmod($fullPath, 0644);
                
                // Verify file was created
                if (!file_exists($fullPath)) {
                    throw new \Exception('File does not exist after upload: ' . $fullPath);
                }
                
                // Store relative path for database
                $filePath = $directory . '/' . $fileName;
                
                Log::info('File stored successfully', [
                    'creator_id' => $creator->id,
                    'storage_path' => $filePath,
                    'full_path' => $fullPath,
                    'file_exists' => file_exists($fullPath),
                    'file_size' => filesize($fullPath),
                ]);
                
            } catch (\Exception $e) {
                Log::error('Failed to store document file', [
                    'creator_id' => $creator->id,
                    'document_type' => $documentType,
                    'fileName' => $fileName,
                    'file_name' => $file->getClientOriginalName(),
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
                throw $e;
            }
            
            $document = CreatorDocument::create([
                'creator_id' => $creator->id,
                'document_type' => $documentType,
                'file_path' => $filePath,
                'file_name' => $file->getClientOriginalName(),
                'file_size' => $file->getSize(),
                'mime_type' => $file->getMimeType(),
                'status' => 'pending',
                'uploaded_at' => now(),
            ]);

            Log::info('Creator document uploaded', [
                'creator_id' => $creator->id,
                'document_type' => $documentType,
                'file_name' => $fileName
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Document uploaded successfully',
                'document' => [
                    'id' => $document->id,
                    'type' => $document->document_type,
                    'fileName' => $document->file_name,
                    'fileSize' => $document->file_size,
                    'mimeType' => $document->mime_type,
                    'status' => $document->status,
                    'uploadedAt' => $document->uploaded_at,
                    'filePath' => $document->file_path,
                ]
            ], 201);
        } catch (\Exception $e) {
            Log::error('Failed to upload creator document', [
                'creator_id' => $creator->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => false,
                'message' => 'Failed to upload document: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a document
     */
    public function delete(Request $request, $id)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized'
            ], 401);
        }

        $creator = Creator::where('user_id', $user->id)->first();

        if (!$creator) {
            return response()->json([
                'status' => false,
                'message' => 'Creator profile not found'
            ], 404);
        }

        try {
            $document = CreatorDocument::where('id', $id)
                ->where('creator_id', $creator->id)
                ->first();

            if (!$document) {
                return response()->json([
                    'status' => false,
                    'message' => 'Document not found'
                ], 404);
            }

            // Delete the file from storage (only if path is provided)
            try {
                if (!empty($document->file_path)) {
                    if (Storage::disk('public')->exists($document->file_path)) {
                        Storage::disk('public')->delete($document->file_path);
                    }
                }
            } catch (\Exception $e) {
                Log::warning('Failed to delete file during document deletion', [
                    'document_id' => $id,
                    'file_path' => $document->file_path,
                    'error' => $e->getMessage()
                ]);
                // Don't throw - continue with database deletion
            }

            // Delete the document record
            $document->delete();

            Log::info('Creator document deleted', [
                'creator_id' => $creator->id,
                'document_id' => $id
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Document deleted successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to delete creator document', [
                'creator_id' => $creator->id,
                'document_id' => $id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'status' => false,
                'message' => 'Failed to delete document: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete document by type
     */
    public function deleteByType(Request $request, $type)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized'
            ], 401);
        }

        $creator = Creator::where('user_id', $user->id)->first();

        if (!$creator) {
            return response()->json([
                'status' => false,
                'message' => 'Creator profile not found'
            ], 404);
        }

        try {
            $document = $creator->documents()
                ->where('document_type', $type)
                ->first();

            if (!$document) {
                return response()->json([
                    'status' => false,
                    'message' => 'Document not found'
                ], 404);
            }

            // Delete the file from storage (only if path is provided)
            try {
                if (!empty($document->file_path)) {
                    if (Storage::disk('public')->exists($document->file_path)) {
                        Storage::disk('public')->delete($document->file_path);
                    }
                }
            } catch (\Exception $e) {
                Log::warning('Failed to delete file during document deletion by type', [
                    'document_type' => $type,
                    'file_path' => $document->file_path,
                    'error' => $e->getMessage()
                ]);
                // Don't throw - continue with database deletion
            }

            // Delete the document record
            $document->delete();

            Log::info('Creator document deleted by type', [
                'creator_id' => $creator->id,
                'type' => $type
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Document deleted successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to delete creator document by type', [
                'creator_id' => $creator->id,
                'type' => $type,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'status' => false,
                'message' => 'Failed to delete document: ' . $e->getMessage()
            ], 500);
        }
    }
}
