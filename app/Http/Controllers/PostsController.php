<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;

class PostsController extends Controller {
    public function getPosts(): JsonResponse {
        // $posts = DB::table('posts')
        // ->select('*', 'posts.id as post_id', 'categories.name as category_name', 'users.id as user_table_id', 'categories.id as category_table_id')
        // ->leftJoin('users', 'user_id', '=', 'users.id')
        // ->leftJoin('categories', 'category_id', '=', 'categories.id')
        // ->take(100)
        // ->orderBy('posts.created_at', 'desc')
        // ->get();

        $posts = Post::with(['user', 'category', 'comments'])->take(100)->orderBy('created_at', 'desc')->get();

        // foreach ($posts as $post) {
        //     $post->comment_count = Post::find($post->post_id)->comments()->count();
        // }


        return response()->json([
            'status' => 'Success',
            'code'   => 200,
            'posts'  => $posts,
        ]);
    }

    public function createPost(Request $request) {
        $validated = $request->validate([
            'post_body' => 'required',
            'category_id' => 'required'
        ]);

        $post             = new Post();
        $post->post       = $request->post_body;
        $post->category_id = $request->category_id;
        $post->user_id    = Auth::user()->id;

        if (!$post->save()) {
            return back()->withErrors(['message' => 'Something went wrong, please try again.']);
        }

        return Redirect::route('dashboard');
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
