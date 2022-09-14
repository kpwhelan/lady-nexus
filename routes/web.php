<?php

use App\Http\Controllers\CommentsController;
use App\Http\Controllers\PostsController;
use App\Models\Category;
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

    return Inertia::render('Dashboard', ['categories' => $categories]);
})->middleware(['auth', 'verified'])->name('dashboard');

//Need to add auth middleware once front end complete
//Also need to reinstate CSRF
Route::prefix('posts')->group(function() {
    Route::get('/', [PostsController::class, 'getPosts'])->middleware(['auth']);
    Route::post('create', [PostsController::class, 'createPost'])->name('create-post');
    Route::delete('delete/{id}', [PostsController::class, 'deletePost']);
    Route::post('update', [PostsController::class, 'updatePost']);
});

//Need to add auth middleware once front end complete
//Also need to reinstate CSRF
Route::prefix('comments')->group(function() {
    Route::post('create', [CommentsController::class, 'createComment'])->name('post-comment');
    Route::delete('delete/{id}', [CommentsController::class, 'deleteComment'])->name('delete-comment');
    Route::post('update', [CommentsController::class, 'updateComment'])->name('post-update-comment');
    Route::get('user/{id}', [CommentsController::class, 'getUserFromComment']);
});

require __DIR__.'/auth.php';
