
FROM php:8.4-apache

# Instalar dependencias y extensiones PHP
RUN apt-get update && apt-get install -y \
    git unzip \
    libzip-dev libicu-dev libonig-dev \
    libpq-dev libsqlite3-dev \
    libpng-dev libjpeg62-turbo-dev libfreetype6-dev \
    libcurl4-openssl-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install \
    bcmath exif gd intl mbstring opcache \
    pdo_mysql pdo_pgsql pdo_sqlite zip curl \
    && rm -rf /var/lib/apt/lists/*

# Activar módulos de Apache
RUN a2enmod rewrite headers

# Configurar Apache para Laravel
RUN sed -ri 's!/var/www/html!/var/www/html/public!g' \
    /etc/apache2/sites-available/000-default.conf \
    && printf 'Listen 10000\n' > /etc/apache2/ports.conf \
    && sed -ri 's/<VirtualHost \*:80>/<VirtualHost *:10000>/' \
    /etc/apache2/sites-available/000-default.conf \
    && printf '<Directory /var/www/html/public>\nAllowOverride All\nRequire all granted\n</Directory>\n' >> /etc/apache2/apache2.conf

# Instalar Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copiar proyecto
COPY . .

# Instalar dependencias Laravel
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader

# Preparar permisos
RUN touch database/database.sqlite \
    && chown -R www-data:www-data storage bootstrap/cache database

EXPOSE 10000

CMD ["apache2-foreground"]
