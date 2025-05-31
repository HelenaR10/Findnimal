# Usa una imagen base de PHP con Apache
FROM php:8.3-apache

# Instala algunas utilidades necesarias
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    libpng-dev \
    libjpeg-dev \
    libwebp-dev \
    wget \
    gnupg \
    && rm -rf /var/lib/apt/lists/*

# Instala extensiones de PHP comunes
RUN docker-php-ext-install pdo_mysql gd zip exif opcache

# Configura PHP para subida de archivos
RUN echo "file_uploads = On" >> /usr/local/etc/php/conf.d/uploads.ini \
    && echo "memory_limit = 256M" >> /usr/local/etc/php/conf.d/uploads.ini \
    && echo "upload_max_filesize = 64M" >> /usr/local/etc/php/conf.d/uploads.ini \
    && echo "post_max_size = 64M" >> /usr/local/etc/php/conf.d/uploads.ini \
    && echo "max_execution_time = 600" >> /usr/local/etc/php/conf.d/uploads.ini

# Instala Composer
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

# Habilita los módulos necesarios de Apache
RUN a2enmod rewrite
RUN a2enmod alias
RUN a2enmod headers
RUN a2enmod env

# Configura el DocumentRoot de Apache para el frontend
ENV APACHE_DOCUMENT_ROOT /var/www/html
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Configura Apache para escuchar en el puerto 8080
RUN sed -i 's/Listen 80/Listen 8080/g' /etc/apache2/ports.conf
RUN sed -i 's/:80/:8080/g' /etc/apache2/sites-available/*.conf

# Configuración de Apache para el backend
RUN echo '<VirtualHost *:8080>\n\
    ServerAdmin webmaster@localhost\n\
    DocumentRoot /var/www/html/frontend\n\
\n\
    # Configuración para el frontend (raíz)\n\
    <Directory /var/www/html/frontend>\n\
        Options -Indexes +FollowSymLinks\n\
        AllowOverride All\n\
        Require all granted\n\
    </Directory>\n\
\n\
    # Configuración para el backend\n\
    Alias /backend /var/www/html/backend\n\
    <Directory /var/www/html/backend>\n\
        Options -Indexes +FollowSymLinks\n\
        AllowOverride All\n\
        Require all granted\n\
        \n\
        # Asegura que los headers de autorización se pasen correctamente\n\
        SetEnvIf Authorization "(.*)" HTTP_AUTHORIZATION=$1\n\
        RequestHeader set Authorization %{HTTP_AUTHORIZATION}e env=HTTP_AUTHORIZATION\n\
    </Directory>\n\
\n\
    # Configuración para storage\n\
    <Directory /var/www/html/storage>\n\
        Options -Indexes\n\
        AllowOverride None\n\
        Require all denied\n\
    </Directory>\n\
\n\
    ErrorLog ${APACHE_LOG_DIR}/error.log\n\
    CustomLog ${APACHE_LOG_DIR}/access.log combined\n\
</VirtualHost>' > /etc/apache2/sites-available/000-default.conf

# Copia los archivos de tu aplicación al contenedor
# El frontend se servirá desde /var/www/html/frontend
COPY frontend/ /var/www/html/frontend/

# El backend PHP estará en /var/www/html/backend
COPY backend/ /var/www/html/backend/

# El storage estará en /var/www/html/storage
COPY storage/ /var/www/html/storage/

# Instala las dependencias
WORKDIR /var/www/html/backend
RUN if [ -f composer.json ]; then composer install --no-dev --optimize-autoloader --no-scripts; fi

# permisos
RUN chown -R www-data:www-data /var/www/html \
    && find /var/www/html -type d -exec chmod 755 {} \; \
    && find /var/www/html -type f -exec chmod 644 {} \; \
    && chmod -R 777 /var/www/html/storage

# Expone el puerto 8080 que es el puerto que requiere Cloud Run
EXPOSE 8080

# Inicia Apache en primer plano
CMD ["apache2-foreground"]