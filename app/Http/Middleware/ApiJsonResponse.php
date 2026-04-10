<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class ApiJsonResponse
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
        // Force JSON response for API routes
        $request->headers->set('Accept', 'application/json');
        
        $response = $next($request);
        
        // Ensure all API responses have JSON content type
        if (!$response->headers->has('Content-Type') || !str_contains($response->headers->get('Content-Type'), 'json')) {
            $response->header('Content-Type', 'application/json');
        }
        
        return $response;
    }
}
