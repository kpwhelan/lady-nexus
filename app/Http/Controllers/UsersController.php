<?php

namespace App\Http\Controllers;

use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class UsersController extends Controller {
    public function uploadProfilePicture(Request $request) {
        $request->validate([
            'profile_picture' => 'required|image|mimes:jpeg,png,jpg,gif,svg',
        ],
        [
            'profile_picture.mimes' => 'Unsupported file type, please use jpeg,png,jpg,gif, or svg formats'
        ]);

        $user = User::find(Auth::user()->id);
        $existing_s3_url = $user->profile_picture_url;

        try {
            $file = $request->file('profile_picture');
            $name = time().$file->getClientOriginalName();
            $path = Storage::disk('s3')->put($name, $file);

            $user->update([
                'profile_picture_url' => $path
            ]);

            if ($existing_s3_url) {
                Storage::disk('s3')->delete($existing_s3_url);
            }
        } catch (Exception $e) {
            return back()->withErrors(['message' => 'Somethihng went wrong...try again']);
        }

        return redirect(route('my-account'));
    }
}
