<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class PostsController extends Controller {
    public function getPosts(): JsonResponse {
        $posts = Post::with(['user', 'category', 'comments'])->take(100)->orderBy('created_at', 'desc')->get();

        return response()->json([
            'status' => 'Success',
            'code'   => 200,
            'posts'  => $posts,
        ]);
    }

    public function createPost(Request $request) {
        $request->validate([
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

        return Redirect::route('my-posts');
    }

    public function deletePost(int $id) {
        $post = Post::find($id);

        if (!$post) {
            return response()->json([
                'status'  => 'Not Found',
                'code'    => 404,
                'message' => 'Hmmm we\'re having trouble deleting that post...',
                'post_id' => $id
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

    public function updatePost(Request $request) {
        $request->validate([
            'post_body' => 'required',
            'category_id' => 'required'
        ]);

        $post = Post::find($request->post_id);

        if (!$post) {
            if (!$post->save()) {
                return back()->withErrors(['message' => 'Something went wrong, please try again.']);
            }
        }

        $post->post = $request->post_body;
        $post->category_id = $request->category_id;

        if (!$post->save()) {
            return back()->withErrors(['message' => 'Something went wrong, please try again.']);
        }

        return back()->with([
            'status'  => 'Success',
            'code'    => 200,
            'message' => 'Post updated!'
        ]);
    }

    public function retrieveMyPosts() {
        $my_posts = Post::where('user_id', Auth::user()->id)->with(['user', 'category', 'comments'])->orderBy('created_at', 'desc')->get();

        return response()->json([
            'status' => 'Success',
            'code'   => 200,
            'posts'  => $my_posts,
        ]);
    }

    public function getMyPosts() {
        $categories = Category::all();
        $my_comment_count = Comment::where('user_id', Auth::user()->id)->count();

        return Inertia::render('MyPosts', [
            'categories' => $categories,
            'comment_count' => $my_comment_count,
        ]);
    }
}
