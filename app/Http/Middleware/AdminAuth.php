<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\Admin;
use App\Common\AppError;

class AdminAuth
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
        // $adminId = $request->cookie('admin_id');
        $adminId = $request->session()->get('admin_id');
        if (!$adminId) {
            return response()->json(['code' => AppError::PERMISSION_DENIED], 403);
        }

        $admin = Admin::find($adminId);
        if ($admin === null) {
            return response()->json(['code' => AppError::PERMISSION_DENIED], 403);
        }

        // Set to request.
        $request->attributes->add(['admin' => $admin]);

        return $next($request);
    }
}
