 FROM php:8.2-apache

# # Instalar extensiones PHP necesarias y Composer
# RUN apt-get update && apt-get install -y \
#     libzip-dev \
#     zip \
#     unzip \
#     && docker-php-ext-install pdo pdo_mysql zip \
#     && curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# # Habilitar mod_rewrite para Apache
# RUN a2enmod rewrite

# # Copiar el backend y el frontend
# COPY backend /var/www/html/backend
# COPY frontend /var/www/html/frontend

# # Configurar el DocumentRoot de Apache para el backend
# RUN sed -i 's|/var/www/html|/var/www/html/backend|g' /etc/apache2/sites-available/000-default.conf

# # Instalar dependencias del backend
# WORKDIR /var/www/html/backend
# RUN composer install --no-dev

# # Exponer el puerto 80
# EXPOSE 80

# CMD ["apache2-foreground"] 