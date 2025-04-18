<?php

use Firebase\JWT\JWT;

function generateTokenJWT($data) {

    $jwtData = [
        'iat' => time(),
        'exp' => time() + 3600,
        'data' => $data
    ];

    return JWT::encode($jwtData, base64_decode(JWT_SECRET_KEY), 'HS256');
}