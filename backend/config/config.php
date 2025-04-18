<?php

require __DIR__.'/../services/httpResponseService.php';
require __DIR__.'/../vendor/autoload.php';
require __DIR__.'/../utils/security.php';
require __DIR__.'/../services/jwtService.php';


const VALIDATION_PASSWORD_REGEX = '/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/';
const VALIDATION_PHONE_REGEX = '/^\d{9}$/';
const USER_ROLE = 1;
const USER_ORGANIZATION_ROLE = 2;

define('JWT_SECRET_KEY', getenv('JWT_SECRET_KEY'));
define('DB_HOST', getenv('DB_HOST'));
define('DB_USER', getenv('DB_USER'));
define('DB_PASSWORD', getenv('DB_PASSWORD'));
define('DB_NAME', getenv('DB_NAME'));
define('DB_PORT', getenv('DB_PORT'));

require __DIR__.'/../services/DB.php';