# Usa una imagen base de PHP-FPM para procesar PHP
FROM php:8.3-fpm

# Instala Nginx y algunas utilidades necesarias.
# Asegúrate de incluir las extensiones PHP que tu proyecto necesite.
RUN apt-get update && apt-get install -y \
    nginx \
    git \
    unzip \
    libzip-dev \
    libpng-dev \
    libjpeg-dev \
    libwebp-dev \
    # Incluye otras librerías que necesites, por ejemplo, si usas bzip, etc.
    && rm -rf /var/lib/apt/lists/*

# Instala extensiones de PHP comunes (ajusta según tus necesidades)
# Si necesitas PostgreSQL, usa 'pdo_pgsql', etc.
RUN docker-php-ext-install pdo_mysql gd zip exif opcache

# Instala Composer (el binario 'composer' está en /usr/bin/composer en la imagen de Composer)
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

# Configura PHP-FPM para que escuche en el puerto 9000 y no se ejecute como demonio
RUN echo "listen = 9000" >> /usr/local/etc/php-fpm.d/www.conf
RUN sed -i -e 's/;daemonize = yes/daemonize = no/g' /usr/local/etc/php-fpm.conf

# Elimina la configuración predeterminada de Nginx
RUN rm -f /etc/nginx/sites-enabled/default

# Copia la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copia los archivos de tu aplicación al contenedor
# El frontend se servirá desde /var/www/html (DocumentRoot de Nginx)
COPY frontend/ /var/www/html/

# El backend PHP estará en /var/www/backend
COPY backend/ /var/www/backend/

# Si usas Composer en el backend, instala las dependencias
# Asegúrate de que tu `composer.json` esté en la carpeta `backend`
WORKDIR /var/www/backend
RUN if [ -f composer.json ]; then composer install --no-dev --optimize-autoloader; fi

# Asegúrate de que los permisos sean correctos para que el servidor web pueda leer/escribir
RUN chown -R www-data:www-data /var/www/html /var/www/backend \
    && chmod -R 755 /var/www/html /var/www/backend

# Expone el puerto 8080, que es donde Nginx escuchará y Cloud Run redirigirá el tráfico
EXPOSE 8080

# Copia el script de entrada que iniciará ambos servicios (Nginx y PHP-FPM)
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
ENTRYPOINT ["docker-entrypoint.sh"]