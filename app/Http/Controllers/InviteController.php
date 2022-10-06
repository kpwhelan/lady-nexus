<?php

namespace App\Http\Controllers;

use App\Models\InviteToken;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class InviteController extends Controller {
    public function sendInvite(Request $request) {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users'
        ]);

        $name = ucwords($request->name);
        $email = $request->email;

        $invite_token = new InviteToken([
            'token' => Hash::make(Str::random(32)),
            'email' => $email
        ]);

        $invite_token->save();

        dd($name);

    }
}
