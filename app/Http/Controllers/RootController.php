<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cookie;
use App\Http\Controllers\Controller;

class RootController extends Controller
{
    public function show(Request $request)
    {
        // Debug
        $debugUrl = $_SERVER['REQUEST_URI'];
        Log::debug($debugUrl);

        // Set referrer cookie.
        if ($request->has('r')) {
            $ref = $request->input('r');
            Cookie::queue('r', $ref);
        }

        // Get the status from query string. // Not necessary.
        // if ($request->has('friendship_status_changed')) {
        //     if ($request->input('friendship_status_changed') == 'true') {
        //         Cookie::queue('friendship_status_changed', 1);
        //     }
        // }

        return view('react', [
            'appUrl' => config('app.url'),
            'assetUrl' => rtrim(secure_asset('/'), '/'),
            'appVer' => config('app.version'),
            'useMockUser' => config('services.line.useMockUser'),
            'oaUrl' => config('services.line.oaUrl'),
            'liffId' => config('services.line.liffId'),
            'liffUrl' => config('services.line.liffUrl'),
        ]);
    }
}
