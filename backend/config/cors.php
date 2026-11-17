<?php

return [
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    // Domaines autorisés, séparés par des virgules (variable CORS_ALLOWED_ORIGINS).
    'allowed_origins' => array_values(array_filter(array_map(
        'trim',
        explode(',', env('CORS_ALLOWED_ORIGINS', 'http://localhost:3000'))
    ))),
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];