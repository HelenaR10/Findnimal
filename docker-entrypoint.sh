#!/bin/bash

# Configurar el puerto de Apache basado en la variable de entorno PORT
sed -i "s/\${PORT:-8080}/$PORT/g" /etc/apache2/ports.conf
sed -i "s/\${PORT:-8080}/$PORT/g" /etc/apache2/sites-available/000-default.conf

# Ejecutar el comando proporcionado
exec "$@" 