<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\CommentLike;
use App\Models\Post;
use App\Models\PostLike;
use App\Models\SubComment;
use App\Models\SubCommentLike;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class MyAccountController extends Controller {
    public function getMyAccountPage() {
        $user_id = Auth::user()->id;

        $post_count = Post::where('user_id', $user_id)->count();
        $comment_count = Comment::where('user_id', $user_id)->count();
        $sub_comment_count = SubComment::where('user_id', $user_id)->count();
        $post_like_count = PostLike::where('user_id', $user_id)->count();
        $comment_like_count = CommentLike::where('user_id', $user_id)->count();
        $sub_comment_like_count = SubCommentLike::where('user_id', $user_id)->count();

        return Inertia::render('MyAccount', [
            'post_count' => $post_count,
            'comment_count' => $comment_count,
            'sub_comment_count' => $sub_comment_count,
            'post_like_count' => $post_like_count,
            'comment_like_count' => $comment_like_count,
            'sub_comment_like_count' => $sub_comment_like_count
        ]);
    }

    public function changePassword(Request $request) {
        $request->validate([
            'email' => 'required|email',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::find($request->user_id);

        try {
            $user->update([
                'password' => Hash::make($request->password),
                'remember_token' => Str ::random(60),
            ]);
        } catch (Exception $e) {
            return response()->json(['message' => 'Something went wrong...'], 500);
        }

        return response()->json([
            'message' => 'Password updated'
        ]);
    }
}
