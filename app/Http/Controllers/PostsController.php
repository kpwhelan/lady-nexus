<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PostsController extends Controller {
    public function createPost(Request $request): JsonResponse {
        $request->validate([
            'post' => 'required|string',
        ]);

        $post          = new Post();
        $post->post    = $request->post;
        $post->user_id = Auth::user()->id;

        if (!$post->save()) {
            return response()->json([
                'status'  => 'Failed',
                'code'    => 500,
                'message' => 'Something went wrong, please try again',
            ]);
        }

        return response()->json([
            'status'  => 'Success',
            'code'    => 201,
            'message' => 'Post created',
        ]);
    }

    public function deletePost(int $id): JsonResponse {
        $post = Post::find($id);

        if (!$post) {
            return response()->json([
                'status'  => 'Not Found',
                'code'    => 404,
                'message' => 'Hmmm we can\'t seem to find that post...',
            ]);
        }

        $post->comments()->delete();

        $post->delete();

        return response()->json([
            'status'  => 'Success',
            'code'    => 200,
            'message' => 'Post deleted',
        ]);
    }

    public function updatePost(Request $request): JsonResponse {
        $post = Post::find($request->id);

        if (!$post) {
            return response()->json([
                'status' => 'Not Found',
                'code'   => 404,
                'message' => 'Hmmm we can\'t seem to find that post...',
            ]);
        }

        $post->post = $request->post;

        if (!$post->save()) {
            return response()->json([
                'status'  => 'Failed',
                'code'    => 500,
                'message' => 'Something went wrong, please try again'
            ]);
        }

        return response()->json([
            'status'  => 'Success',
            'code'    => 200,
            'message' => 'Post updated!'
        ]);
    }
}
