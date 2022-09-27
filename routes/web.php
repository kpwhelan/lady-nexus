<?php

use App\Http\Controllers\CommentsController;
use App\Http\Controllers\PostsController;
use App\Models\Category;
use App\Models\Post;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    $categories = Category::all();
    $posts = Post::with(['user', 'category', 'comments', 'comments.comment_likes', 'post_likes'])
            ->offset(0)
            ->limit(20)
            ->orderBy('id', 'desc')
            ->get();

    return Inertia::render('Dashboard', ['categories' => $categories, 'posts' => $posts]);
})->middleware(['auth', 'verified'])->name('dashboard');

//Need to add auth middleware once front end complete
//Also need to reinstate CSRF
Route::prefix('posts')->middleware(['auth', 'verified'])->group(function() {
    Route::get('/', [PostsController::class, 'getPosts'])->middleware(['auth']);
    Route::post('create', [PostsController::class, 'createPost'])->name('create-post');
    Route::delete('delete/{id}', [PostsController::class, 'deletePost'])->name('delete-post');
    Route::post('update', [PostsController::class, 'updatePost'])->name('post-update-post');
    Route::get('my-posts', [PostsController::class, 'getMyPostsPage'])->name('my-posts');
    Route::get('fetch-more-posts', [PostsController::class, 'retrieveMorePosts']);
    Route::post('/toggle-like', [PostsController::class, 'toggleLike']);
});

//Need to add auth middleware once front end complete
//Also need to reinstate CSRF
Route::prefix('comments')->middleware(['auth', 'verified'])->group(function() {
    Route::post('create', [CommentsController::class, 'createComment'])->name('post-comment');
    Route::delete('delete/{id}', [CommentsController::class, 'deleteComment'])->name('delete-comment');
    Route::post('update', [CommentsController::class, 'updateComment'])->name('post-update-comment');
    Route::get('user/{id}', [CommentsController::class, 'getUserFromComment']);
    Route::post('/toggle-like', [CommentsController::class, 'toggleLike']);
});

require __DIR__.'/auth.php';
