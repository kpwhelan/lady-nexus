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

    public function follow(Request $request) {
        $user_id_to_follow = $request->user_id_to_follow;

        $user = User::find(Auth::user()->id);
        $user_to_follow = User::find($user_id_to_follow);

        $current_follows = $user->follows;
        // $current_follows[] = $user_id_to_follow;
        array_push($current_follows, $user_id_to_follow);

        $user->update([
            'follows' => $current_follows
        ]);

        $user_to_follow_current_followers = $user_to_follow->followed_by;
        $user_to_follow_current_followers[] = $user->id;

        $user_to_follow->update([
            'followed_by' => $user_to_follow_current_followers
        ]);
    }

    public function unfollow(Request $request) {
        $user_id_to_unfollow = $request->user_id_to_unfollow;

        $user = User::find(Auth::user()->id);
        $user_to_unfollow = User::find($user_id_to_unfollow);

        $current_follows = $user->follows;
        unset($current_follows[array_search($user_id_to_unfollow, $current_follows)]);

        $user->update([
            'follows' => $current_follows
        ]);

        $user_to_unfollow_current_followers = $user_to_unfollow->followed_by;
        unset($user_to_unfollow_current_followers[array_search($user->id, $user_to_unfollow_current_followers)]);

        $user_to_unfollow->update([
            'followed_by' => $user_to_unfollow_current_followers
        ]);
    }
}
