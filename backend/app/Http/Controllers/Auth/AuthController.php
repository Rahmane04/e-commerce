<?php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {
        $user = User::where('email', $request->string('email')->toString())->first();

        if (!$user || !Hash::check($request->string('password')->toString(), $user->password)) {
            return response()->json(['message' => 'Identifiants invalides.'], 401);
        }

        $token = $user->createToken('admin-session')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => ['id' => $user->id, 'name' => $user->name, 'email' => $user->email],
        ]);
    }

    public function logout()
    {
        request()->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnecté.']);
    }
}