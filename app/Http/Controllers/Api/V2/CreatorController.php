<?php

namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\Controller;
use App\Models\Creator;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class CreatorController extends Controller
{
    /**
     * Register a new creator
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'has_inventory' => 'required|boolean',
            'has_tech_pack' => 'required|boolean',
            'accepted_terms' => 'required|boolean',
            'accepted_collaboration_agreement' => 'required|boolean',
            'accepted_delivery_obligation' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            Log::warning('Creator registration validation failed', [
                'errors' => $validator->errors()
            ]);
            return response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Create user
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'user_type' => 'creator',
                'user_name' => Str::random(12),
                'email_verified_at' => now(),
            ]);

            Log::info('User created for creator registration', ['user_id' => $user->id, 'email' => $user->email]);

            // Create creator profile
            $creator = Creator::create([
                'user_id' => $user->id,
                'status' => 'pending',
                'brand_name' => $request->name,
                'has_inventory' => $request->has_inventory,
                'has_tech_pack' => $request->has_tech_pack,
                'accepted_terms' => $request->accepted_terms,
                'accepted_collaboration_agreement' => $request->accepted_collaboration_agreement,
                'accepted_delivery_obligation' => $request->accepted_delivery_obligation,
                'terms_accepted_at' => now(),
            ]);

            Log::info('Creator profile created', ['user_id' => $user->id, 'creator_id' => $creator->id]);

            // Create auth token
            $token = $user->createToken('auth_token')->plainTextToken;

            Log::info('Creator registered successfully', [
                'user_id' => $user->id,
                'creator_id' => $creator->id,
                'email' => $user->email
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Creator registered successfully',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'user_type' => $user->user_type,
                    'role' => 'creator',
                    'roles' => ['creator', 'backer'], // New creators also have backer role
                ],
                'creator' => [
                    'id' => $creator->id,
                    'status' => $creator->status,
                    'brand_name' => $creator->brand_name,
                ],
                'roles' => ['creator', 'backer'], // Include roles in response
                'token' => $token
            ], 201);
        } catch (\Exception $e) {
            Log::error('Creator registration failed', [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            return response()->json([
                'status' => false,
                'message' => 'Registration failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get creator profile
     */
    public function getProfile(Request $request)
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

        return response()->json([
            'status' => true,
            'creator' => $creator,
            'user' => $user
        ]);
    }

    /**
     * Update creator profile
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();
        
        Log::info('updateProfile called', [
            'user' => $user ? $user->id : 'null',
            'request_data' => $request->all()
        ]);

        if (!$user) {
            Log::error('No user in updateProfile request', [
                'auth_header' => $request->header('Authorization')
            ]);
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized'
            ], 401);
        }

        $creator = Creator::where('user_id', $user->id)->first();

        if (!$creator) {
            Log::error('Creator not found for user', ['user_id' => $user->id]);
            return response()->json([
                'status' => false,
                'message' => 'Creator profile not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'brand_name' => 'nullable|string|max:255',
            'bio' => 'nullable|string|max:1000',
            'bank_account' => 'nullable|string',
            'bank_name' => 'nullable|string',
            'account_holder' => 'nullable|string',
            'routing_number' => 'nullable|string',
            'swiftcode' => 'nullable|string',
            // User profile fields
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            Log::warning('Validation failed in updateProfile', [
                'errors' => $validator->errors()
            ]);
            return response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Update user profile fields if provided
            if ($request->has('name')) {
                $user->name = $request->name;
            }
            if ($request->has('email')) {
                $user->email = $request->email;
            }
            if ($request->has('phone')) {
                $user->phone = $request->phone;
            }
            if ($request->has('address')) {
                $user->address = $request->address;
            }
            $user->save();

            // Update creator fields
            $creator->update($request->only([
                'brand_name',
                'bio',
                'bank_account',
                'bank_name',
                'account_holder',
                'routing_number',
                'swiftcode',
            ]));

            Log::info('Creator profile updated successfully', [
                'user_id' => $user->id,
                'creator_id' => $creator->id
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Creator profile updated successfully',
                'creator' => $creator,
                'user' => $user
            ]);
        } catch (\Exception $e) {
            Log::error('Creator profile update failed', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json([
                'status' => false,
                'message' => 'Update failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get creator dashboard stats
     */
    public function getStats(Request $request)
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

        return response()->json([
            'status' => true,
            'stats' => [
                'total_campaigns' => $creator->total_campaigns,
                'successful_campaigns' => $creator->successful_campaigns,
                'total_funded' => $creator->total_funded,
                'rating' => $creator->rating,
                'status' => $creator->status,
            ]
        ]);
    }
}
