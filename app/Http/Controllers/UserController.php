<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use App\Http\Controllers\LineController;
use App\User;

class UserController extends Controller
{
    public function login(Request $request)
    {
        $lineId = $request->post('line_id');
        $name = $request->post('name');
        $avatarUrl = $request->post('avatar_url', '');
        $accessToken = $request->post('access_token');
        if (empty($lineId) || empty($name) || empty($accessToken)) {
            return response()->json(['error' => [
                'message' => 'missing parameter'
            ]], 400);
        }

        if (config('services.line.useMockUser') == false) {
            // Check the token is valid, and match to the line_id. (This can prevent forge $line_id)
            $lineController = new LineController();
            $profile = $lineController->getProfile($accessToken);
            if (!$profile) {
                return response()->json(['error' => [
                    'code' => 'Invalid token',
                ]], 400);
            } else if ($profile['userId'] != $lineId) {
                return response()->json(['error' => [
                    'code' => 'Invalid token pair',
                ]], 400);
            }
        }

        $user = User::where('line_id', $lineId)->first();
        if (!$user) {
            $user = new User();
            $user->line_id = $lineId;
        }

        // Update basic data.
        $user->name = $name;
        $user->avatar_url = $avatarUrl;
        $user->save();

        // Set current user.
        Auth::login($user);

        return response()->json(['data' => 'success']);
    }

    public function show(Request $request)
    {
        $authUser = Auth::user();
        $fields = ['id', 'name'];
        $user = array_intersect_key($authUser->toArray(), array_flip($fields));
        return response()->json(['data' => $user]);
    }
}
