<?php

function sendHttpSuccess($data = []) {
    http_response_code(200);
    header('Content-Type: application/json');

    die(json_encode([
        'success' => true,
        'data' => $data
    ]));
}

function sendHttpError($statusCode = 500, $message = 'internal server error') {
    http_response_code($statusCode);
    header('Content-Type: application/json');

    die(json_encode([
        'success' => false,
        'error' => $message
    ]));
}