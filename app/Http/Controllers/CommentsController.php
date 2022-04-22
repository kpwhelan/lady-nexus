<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentsController extends Controller {
    public function createComment(Request $request) {
        $request->validate([
            'comment' => 'required|string',
        ]);

        $comment          = new Comment();
        $comment->comment = $request->comment;
        $comment->post_id = $request->post_id;
        $comment->user_id = Auth::user()->id;

        if (!$comment->save()) {
            return response()->json([
                'status' => 'Failed',
                'code'   => 500,
                'message' => 'Something went wrong, please try again',
            ]);
        }

        return response()->json([
            'status'  => 'Success',
            'code'    => 201,
            'message' => 'Comment added successfully!'
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

    public function updateComment(Request $request): JsonResponse {
        $comment = Comment::find($request->id);

        if (!$comment) {
            return response()->json([
                'status'  => 'Not Found',
                'code'    => 404,
                'message' => 'Hmmm we can\'t seem to find that comment...',
            ]);
        }

        $comment->comment = $request->comment;

        if (!$comment->save()) {
            return response()->json([
                'status'  => 'Failed',
                'code'    => 500,
                'message' => 'Something went wrong, please try again',
            ]);
        }

        return response()->json([
            'status'  => 'Success',
            'code'    => 200,
            'message' => 'Comment updated!'
        ]);
    }
}
