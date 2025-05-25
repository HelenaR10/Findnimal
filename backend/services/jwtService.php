<?php

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

function generateTokenJWT($data) {

    $jwtData = [
        'iat' => time(),
        'exp' => time() + 3600,
        'data' => $data
    ];

    return JWT::encode($jwtData, base64_decode(JWT_SECRET_KEY), 'HS256');
}

function getHeaderToken() {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? '';

    if (preg_match('/^Bearer\s+([A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+)$/', $authHeader, $matches)) {
        return $matches[1];

    } else {
        return null;
    }
}

function decodeTokenJWT() {
    
    try {
        $token = getHeaderToken();
        
        if (!$token) {
            return null;
        }

        return JWT::decode($token, new Key(base64_decode(JWT_SECRET_KEY), 'HS256'));
    
    } catch (\Exception $e) {
        sendHttpError(401);
    }
}