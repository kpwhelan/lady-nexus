<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // User::factory(100)->has(
        //     Post::factory(10)->hasComments(5)
        // )
        // ->create();

        {
            $users = User::factory()->count(500)->create();
            // dd($users->count()); <-- This stops the seed execution
            $posts = Post::factory()->count(10000)->make()->each(function($post) use ($users) {
                $post->user()->associate($users->random())->save();
            });
            $comments = Comment::factory()->count(50000)->make()->each(function ($comment) use ($posts, $users){
                $comment->user()->associate($users->random())->save();
                $comment->post()->associate($posts->random())->save();
            });
        }
    }
}
