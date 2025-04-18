<?php

function generateSecretKey($bytesL = 32) {
    return base64_encode(random_bytes($bytesL));
}