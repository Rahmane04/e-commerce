<?php

use App\Providers\AppServiceProvider;
use App\Infrastructure\Catalog\Providers\CatalogServiceProvider;

return [
    AppServiceProvider::class,
    App\Infrastructure\Catalog\Providers\CatalogServiceProvider::class,
];
