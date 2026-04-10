<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Configure allowed origins, methods, headers, and credentials.
    | Supports both development and production setups.
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    // Allowed origins
'allowed_origins' => [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://192.168.0.102:3000', // <-- Add this
    'https://www.yourdomain.com',
],


    // Patterns (optional, can leave empty)
    'allowed_origins_patterns' => [],

    // Allow all HTTP methods
    'allowed_methods' => ['*'],

    // Allow all headers
    'allowed_headers' => ['*'],

    // Expose any headers to the frontend
    'exposed_headers' => [],

    // Cache preflight response (seconds)
    'max_age' => 3600,

    // Allow credentials (cookies, authorization headers)
    'supports_credentials' => true,

];
