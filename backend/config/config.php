<?php

require __DIR__.'/../services/httpResponseService.php';
require __DIR__.'/../vendor/autoload.php';
require __DIR__.'/../utils/security.php';
require __DIR__.'/../utils/animalMatch.php';
require __DIR__.'/../services/jwtService.php';

const VALIDATION_PASSWORD_REGEX = '/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/';
const VALIDATION_PHONE_REGEX = '/^\d{9}$/';
const USER_ROLE = 1;
const USER_ORGANIZATION_ROLE = 2;

const SEX_MAP = [
    1 => 'hembra',
    2 => 'macho'
];

const AGE_MAP = [
    1 => 'cria',
    2 => 'junior',
    3 => 'adulto',
    4 => 'senior'
];

const SIZE_MAP = [
    1 => 'Enano',
    2 => 'Pequeño',
    3 => 'Mediano',
    4 => 'Grande',
    5 => 'Gigante'
];

const IDENTIFICATION_MAP = [
    1 => 'Con collar',
    2 => 'Sin collar'
];

define('GOOGLE_CLOUD_STORAGE_BUCKET', getenv('GOOGLE_CLOUD_STORAGE_BUCKET'));
define('GOOGLE_CLOUD_PROJECT', getenv('GOOGLE_CLOUD_PROJECT'));
define('GOOGLE_CLOUD_CREDENTIALS', getenv('GOOGLE_APPLICATION_CREDENTIALS'));

define('JWT_SECRET_KEY', getenv('JWT_SECRET_KEY'));
define('DB_HOST', getenv('DB_HOST'));
define('DB_USER', getenv('DB_USER'));
define('DB_PASSWORD', getenv('DB_PASSWORD'));
define('DB_NAME', getenv('DB_NAME'));
define('DB_PORT', getenv('DB_PORT'));

require __DIR__.'/../services/DB.php';