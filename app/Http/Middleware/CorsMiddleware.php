<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CorsMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $allowedOrigins = [
            'http://localhost:3000',
            'http://192.168.0.107:3000',
            'http://192.168.0.102:3000'
        ];

        $origin = $request->headers->get('Origin');

        $headers = [
            'Access-Control-Allow-Origin' => in_array($origin, $allowedOrigins) ? $origin : '',
            'Access-Control-Allow-Methods' => 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
            'Access-Control-Allow-Headers' => 'Content-Type, Authorization, system-key',
            'Access-Control-Allow-Credentials' => 'true',
        ];

        // Handle OPTIONS preflight request
        if ($request->getMethod() === 'OPTIONS') {
            return response()->json('OK', 200, $headers);
        }

        $response = $next($request);

        foreach ($headers as $key => $value) {
            $response->header($key, $value);
        }

        return $response;
    }
}
