<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Laravel\Sanctum\PersonalAccessToken;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class ParseBearerToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        try {
            // Try multiple methods to get the Authorization header
            $authHeader = $request->header('Authorization');
            
            // If header not found in request, try to get it from $_SERVER
            if (empty($authHeader) && isset($_SERVER['HTTP_AUTHORIZATION'])) {
                $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
                $request->headers->set('Authorization', $authHeader);
            }
            
            // Also try apache_request_headers if available
            if (empty($authHeader) && function_exists('apache_request_headers')) {
                $allHeaders = apache_request_headers();
                if (isset($allHeaders['Authorization'])) {
                    $authHeader = $allHeaders['Authorization'];
                    $request->headers->set('Authorization', $authHeader);
                }
            }
            
            // Fallback: Check for X-Auth-Token header (for testing purposes)
            if (empty($authHeader)) {
                $xAuthToken = $request->header('X-Auth-Token');
                if (!empty($xAuthToken)) {
                    $authHeader = 'Bearer ' . $xAuthToken;
                    $request->headers->set('Authorization', $authHeader);
                }
            }
            
            $path = $request->getPathInfo();
            $method = $request->getMethod();
            
            Log::info('ParseBearerToken middleware invoked', [
                'path' => $path,
                'method' => $method,
                'has_auth_header' => !empty($authHeader),
                'auth_header_preview' => $authHeader ? substr($authHeader, 0, 30) . '...' : null,
                'is_bearer' => $authHeader && strpos($authHeader, 'Bearer ') === 0
            ]);
            
            if ($authHeader && strpos($authHeader, 'Bearer ') === 0) {
                $token = substr($authHeader, 7);
                
                Log::info('Extracted bearer token', [
                    'token_preview' => substr($token, 0, 10) . '...',
                    'token_length' => strlen($token)
                ]);
                
                // Find the personal access token
                $personalAccessToken = PersonalAccessToken::findToken($token);
                
                if ($personalAccessToken) {
                    Log::info('Found personal access token', [
                        'token_id' => $personalAccessToken->id,
                        'user_id' => $personalAccessToken->tokenable_id,
                        'revoked' => $personalAccessToken->revoked
                    ]);
                    
                    if (!$personalAccessToken->revoked) {
                        // Set the user on the request for Sanctum to use
                        $user = $personalAccessToken->tokenable;
                        $request->setUserResolver(fn() => $user);
                        auth()->setUser($user);
                        Log::info('User authenticated via bearer token', [
                            'user_id' => $user->id,
                            'user_email' => $user->email
                        ]);
                    } else {
                        Log::warning('Token is revoked');
                    }
                } else {
                    Log::warning('Personal access token not found', [
                        'token_preview' => substr($token, 0, 10) . '...'
                    ]);
                }
            }
            
            return $next($request);
        } catch (\Exception $e) {
            Log::error('ParseBearerToken middleware error', [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }
}

