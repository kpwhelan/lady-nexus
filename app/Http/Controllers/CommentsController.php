<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\CommentLike;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;

class CommentsController extends Controller {
    public function createComment(Request $request) {
        $request->validate([
            'comment_body' => 'required|string',
        ]);

        $comment          = new Comment();
        $comment->comment = $request->comment_body;
        $comment->post_id = $request->post_id;
        $comment->user_id = Auth::user()->id;

        if (!$comment->save()) {
            return response()->json(['message' => 'Something went wrong, please try again.'], 500);
        }

        return response()->json([
            'comment' => $comment
        ]);
    }

    public function deleteComment(int $id): JsonResponse {
        $comment = Comment::find($id);

        if (!$comment) {
            return response()->json([
                'status'  => 'Not Found',
                'code'    => 404,
                'message' => 'Hmmm we can\'t seem to find that comment...',
            ]);
        }

        $comment->delete();

        return response()->json([
            'status'  => 'Success',
            'code'    => 200,
            'message' => 'Comment deleted'
        ]);
    }

    public function updateComment(Request $request) {
        $comment = Comment::find($request->comment_id);

        if (!$comment) {
            return back()->withErrors(['message' => 'Hmmm we can\'t seem to find that comment...']);
        }

        $comment->comment = $request->comment_body;

        if (!$comment->save()) {
            return response()->json(['message' => 'Something went wrong, please try again.'], 500);
        }

        return response()->json([
            'comment' => $comment
        ]);
    }

    public function getUserFromComment($id): JsonResponse {
        $user = User::find($id)->toArray();

        return response()->json([
            'status' => 'Success',
            'code'   => 200,
            'user'   => $user
        ]);
    }

    public function toggleLike(Request $request) {
        $user_id = Auth::user()->id;
        $comment_id = $request->comment_id;
        $is_comment_liked_by_user = $request->is_comment_liked_by_user;

        $comment_like = CommentLike::where([
            ['user_id', $user_id],
            ['comment_id', $comment_id]
        ])
        ->first();

        if ($comment_like) {
            $comment_like->update([
                'active' => $is_comment_liked_by_user ? false : true
            ]);
        } elseif (!$comment_like) {
            $comment_like = new CommentLike();

            $comment_like->user_id = $user_id;
            $comment_like->comment_id = $comment_id;
            $comment_like->active  = true;

            $comment_like->save();
        }

        return response()->json();
    }
}
