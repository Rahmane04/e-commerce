<?php

use App\Providers\AppServiceProvider;
use App\Infrastructure\Catalog\Providers\CatalogServiceProvider;

return [
    AppServiceProvider::class,
    App\Infrastructure\Catalog\Providers\CatalogServiceProvider::class,
    App\Infrastructure\Order\Providers\OrderServiceProvider::class,
    App\Infrastructure\Customer\Providers\CustomerServiceProvider::class,
];
