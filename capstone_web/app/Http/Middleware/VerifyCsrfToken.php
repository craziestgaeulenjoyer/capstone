<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;
use Illuminate\Support\Facades\Log;

class VerifyCsrfToken extends Middleware
{
    /**
     * URIs that should be excluded from CSRF verification.
     */
    protected $except = [
        'superadmin/login',
        'superadmin/logout',
        'admin/login',
        'admin/logout',  
    ];

    /**
     * Handle an incoming request.
     */
    public function handle($request, \Closure $next)
    {
        // Log CSRF token from header and cookie
        Log::info('CSRF Token Received:', [
            'header' => $request->header('X-XSRF-TOKEN'),
            'cookie' => $request->cookie('XSRF-TOKEN'),
        ]);

        return parent::handle($request, $next);
    }
}
