<?php

use App\Http\Controllers\CommentsController;
use App\Http\Controllers\InviteController;
use App\Http\Controllers\MyAccountController;
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

Route::get('/nexus', function () {
    $categories = Category::all();
    $posts = Post::with(['user', 'category', 'comments', 'comments.sub_comments', 'comments.sub_comments.user', 'comments.sub_comments.sub_comment_likes', 'comments.comment_likes', 'post_likes'])
            ->offset(0)
            ->limit(20)
            ->orderBy('id', 'desc')
            ->get();

    return Inertia::render('Dashboard', ['categories' => $categories, 'posts' => $posts]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('invite', function () {
    return Inertia::render('Invite');
})->middleware(['auth'])->name('invite');

//Need to add auth middleware once front end complete
//Also need to reinstate CSRF
Route::prefix('posts')->middleware(['auth', 'verified'])->group(function() {
    Route::get('/more-dashboard-posts', [PostsController::class, 'getMoreDashboardPosts'])->name('more-dashboard-posts');
    Route::get('categories', [PostsController::class, 'getCategories'])->name('get-categories');
    Route::post('create', [PostsController::class, 'createPost'])->name('create-post');
    Route::delete('delete/{id}', [PostsController::class, 'deletePost'])->name('delete-post');
    Route::post('update', [PostsController::class, 'updatePost'])->name('post-update-post');
    Route::get('my-posts', [PostsController::class, 'getMyPostsPage'])->name('my-posts');
    Route::get('fetch-more-posts', [PostsController::class, 'retrieveMorePosts']);
    Route::post('/toggle-like', [PostsController::class, 'toggleLike']);
    Route::get('my-likes', [PostsController::class, 'getMyLikesPage'])->name('my-likes');
    Route::get('/fetch-more-liked-posts', [PostsController::class, 'fetchMoreLikedPosts']);
});

//Need to add auth middleware once front end complete
//Also need to reinstate CSRF
Route::prefix('comments')->middleware(['auth', 'verified'])->group(function() {
    Route::post('create', [CommentsController::class, 'createComment'])->name('post-comment');
    Route::delete('delete/{id}', [CommentsController::class, 'deleteComment'])->name('delete-comment');
    Route::post('update', [CommentsController::class, 'updateComment'])->name('post-update-comment');
    Route::get('user/{id}', [CommentsController::class, 'getUserFromComment']);
    Route::post('/toggle-like', [CommentsController::class, 'toggleLike']);
    Route::post('create/sub-comment', [CommentsController::class, 'createSubComment'])->name('post-sub-comment');
    Route::post('/toggle-sub-comment-like', [CommentsController::class, 'toggleSubCommentLike']);
    Route::delete('delete/sub-comment/{id}', [CommentsController::class, 'deleteSubComment']);
    Route::post('update/sub-comment', [CommentsController::class, 'updateSubComment'])->name('post-update-sub-comment');
});

Route::prefix('account')->middleware(['auth', 'verified'])->group(function() {
    Route::get('my-account', [MyAccountController::class, 'getMyAccountPage'])->name('my-account');
    Route::post('change-password', [MyAccountController::class, 'changePassword'])->name('change-password');
    Route::post('delete', [MyAccountController::class, 'deleteAccount'])->name('delete');
});

Route::post('/invite', [InviteController::class, 'sendInvite'])->name('send-invite');

Route::get('/invites', function () {
    return view('invite', ['name' => 'Kevin Whelan', 'token' => 'lkjasdlknioijee']);
});

require __DIR__.'/auth.php';
