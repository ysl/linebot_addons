<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Log;
use App\Models\Client;
use App\Common\AppError;

class AdminIpRestrict
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        // Check ip.
        $clientIP = '';
        if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            // To check ip is pass from proxy
            $clientIP = $_SERVER['HTTP_X_FORWARDED_FOR'];
        } else {
            $clientIP = $_SERVER['REMOTE_ADDR'];
        }

        $ips = Client::select(['ip'])->get()->pluck('ip')->toArray();
        if (!in_array($clientIP, $ips)) {
            Log::debug("Invalid IP: {$clientIP}");
            return response()->json(['code' => AppError::INVALID_SOURCE_ID], 403);
        }

        return $next($request);
    }
}
