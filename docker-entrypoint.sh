#!/bin/bash
# Inicia PHP-FPM en segundo plano
php-fpm -D

# Inicia Nginx en primer plano (esto mantendrá el contenedor ejecutándose)
nginx -g "daemon off;"