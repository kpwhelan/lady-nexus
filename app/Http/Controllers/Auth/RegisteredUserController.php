<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\InviteToken;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Carbon\Carbon;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        return Inertia::render('Auth/Register');
    }

    public function store(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'username' => 'required|string',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'invite_token' => 'required|string',
        ]);

        //Logic for checking invite token
        $token = InviteToken::where('token', $request->invite_token)->first();

        if ($token) {
            $token_creation_time = Carbon::parse($token->created_at)->format('Y-m-d H:i:s');

            $current_time = Carbon::now();

            $hours_elapsed = $current_time->diffInHours($token_creation_time);

            if ($hours_elapsed >= 24) {
                return back()->withErrors('Token is expired.');
            }
        } else {
            return back()->withErrors('Not a valid token');
        }


        $user = User::create([
            'first_name' => ucfirst($request->first_name),
            'last_name' => ucfirst($request->last_name),
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'follows' => null,
            'followed_by' => null
        ]);

        event(new Registered($user));

        Auth::login($user);

        InviteToken::where('token', $token->token)->update([
            'active' => false
        ]);

        return redirect(RouteServiceProvider::HOME);
    }
}
