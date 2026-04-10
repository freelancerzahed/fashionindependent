<?php

namespace App\Http\Controllers\Api\V2;

use Illuminate\Http\Request;

class DebugAuthController extends \App\Http\Controllers\Controller
{
    /**
     * Test endpoint to verify authentication
     * GET /api/v2/auth/test
     */
    public function test(Request $request)
    {
        $user = $request->user();
        $authHeader = $request->header('Authorization');

        return response()->json([
            'authenticated' => $user !== null,
            'user' => $user ? [
                'id' => $user->id,
                'email' => $user->email,
                'name' => $user->name,
            ] : null,
            'debug' => [
                'auth_header_present' => !empty($authHeader),
                'auth_header_preview' => $authHeader ? substr($authHeader, 0, 30) . '...' : null,
                'auth_guard' => auth()->getDefaultDriver(),
                'has_access_token' => $user && $user->currentAccessToken() !== null,
            ],
        ]);
    }
}
