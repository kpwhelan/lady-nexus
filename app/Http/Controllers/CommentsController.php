<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\CommentLike;
use App\Models\SubComment;
use App\Models\SubCommentLike;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;

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

        $comment->comment_likes = $comment->comment_likes;
        $comment->sub_comments = $comment->sub_comments;
        $comment->user = $comment->user;
        if ($comment->user->profile_picture_url) {
            $comment->user->temp_profile_picture_url = Storage::temporaryUrl($comment->user->profile_picture_url, now()->addHours(24));
        }

        return response()->json([
            'comment' => $comment
        ]);
    }

    public function deleteComment($id): JsonResponse {
        $comment_id = $id;
        $comment = Comment::find($comment_id);
        $post_id = $comment->post->id;

        if (!$comment) {
            return response()->json([
                'status'  => 'Not Found',
                'code'    => 404,
                'message' => 'Hmmm we can\'t seem to find that comment...',
            ]);
        }

        $comment->sub_comments()->delete();

        $comment->delete();

        return response()->json([
            'comment_id' => $comment_id,
            'post_id' => $post_id,
            'message' => 'Comment deleted',
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

        $comment->user = $comment->user;
        if ($comment->user->profile_picture_url) {
            $comment->user->temp_profile_picture_url = Storage::temporaryUrl($comment->user->profile_picture_url, now()->addHours(24));
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

    public function toggleSubCommentLike(Request $request) {
        $user_id = Auth::user()->id;
        $sub_comment_id = $request->sub_comment_id;
        $is_sub_comment_liked_by_user = $request->is_sub_comment_liked_by_user;

        $sub_comment_like = SubCommentLike::where([
            ['user_id', $user_id],
            ['sub_comment_id', $sub_comment_id]
        ])
        ->first();

        if ($sub_comment_like) {
            $sub_comment_like->update([
                'active' => $is_sub_comment_liked_by_user ? false : true
            ]);
        } elseif (!$sub_comment_like) {
            $sub_comment_like = new SubCommentLike();

            $sub_comment_like->user_id = $user_id;
            $sub_comment_like->sub_comment_id = $sub_comment_id;
            $sub_comment_like->active  = true;

            $sub_comment_like->save();
        }

        return response()->json();
    }

    public function createSubComment(Request $request) {
        $request->validate([
            'sub_comment_body' => 'required|string',
        ]);

        $sub_comment          = new SubComment();
        $sub_comment->sub_comment = $request->sub_comment_body;
        $sub_comment->comment_id = $request->comment_id;
        $sub_comment->user_id = Auth::user()->id;

        if (!$sub_comment->save()) {
            return response()->json(['message' => 'Something went wrong, please try again.'], 500);
        }

        $sub_comment->sub_comment_likes = $sub_comment->sub_comment_likes;
        $sub_comment->user = $sub_comment->user;
        $sub_comment->user = $sub_comment->user;

        if ($sub_comment->user->profile_picture_url) {
            $sub_comment->user->temp_profile_picture_url = Storage::temporaryUrl($sub_comment->user->profile_picture_url, now()->addHours(24));
        }

        return response()->json([
            'sub_comment' => $sub_comment
        ]);
    }

    public function deleteSubComment($id) {
        $sub_comment_id = $id;
        $sub_comment = SubComment::find($sub_comment_id);
        $comment_id = $sub_comment->comment->id;
        $post_id = $sub_comment->comment->post->id;

        if (!$sub_comment) {
            return response()->json([
                'status'  => 'Not Found',
                'code'    => 404,
                'message' => 'Hmmm we can\'t seem to find that comment...',
            ]);
        }

        $sub_comment->delete();

        return response()->json([
            'sub_comment_id' => $sub_comment_id,
            'comment_id' => $comment_id,
            'post_id' => $post_id,
            'message' => 'Deleted',
        ]);
    }

    public function updateSubComment(Request $request) {
        $sub_comment = SubComment::find($request->sub_comment_id);
        $comment_id = $sub_comment->comment->id;
        $post_id = $sub_comment->comment->post->id;

        if (!$sub_comment) {
            return back()->withErrors(['message' => 'Hmmm we can\'t seem to find that one...']);
        }

        $sub_comment->sub_comment = $request->sub_comment_body;

        if ($sub_comment->user->profile_picture_url) {
            $sub_comment->user->temp_profile_picture_url = Storage::temporaryUrl($sub_comment->user->profile_picture_url, now()->addHours(24));
        }

        if (!$sub_comment->save()) {
            return response()->json(['message' => 'Something went wrong, please try again.'], 500);
        }

        return response()->json([
            'sub_comment' => $sub_comment,
            'comment_id' => $comment_id,
            'post_id' => $post_id
        ]);
    }
}
