#!/bin/sh
set -e

# Render fournit le port à écouter dans $PORT.
PORT="${PORT:-10000}"
sed -i "s/Listen 80/Listen ${PORT}/" /etc/apache2/ports.conf
sed -i "s/<VirtualHost \*:80>/<VirtualHost *:${PORT}>/" /etc/apache2/sites-available/000-default.conf

php artisan config:cache
php artisan route:cache
php artisan migrate --force

# Données minimales (idempotent). Un échec ne doit pas empêcher le site de démarrer.
php artisan db:seed --class=ProductionSeeder --force || echo "ProductionSeeder: échec, démarrage poursuivi"

exec apache2-foreground