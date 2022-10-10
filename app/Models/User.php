<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable {
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
        'username',
        'active',
        'profile_picture_url'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    protected $attributes = [
        'active' => true
    ];

    public function posts(): HasMany {
        return $this->hasMany(Post::class);
    }

    public function comments(): HasMany {
        return $this->hasMany(Comment::class);
    }

    public function sub_comments(): HasMany {
        return $this->hasMany(SubComment::class);
    }

    public function post_likes(): HasMany {
        return $this->hasMany(PostLike::class);
    }

    public function comment_likes(): HasMany {
        return $this->hasMany(CommentLike::class);
    }

    public function sub_comment_likes(): HasMany {
        return $this->hasMany(SubCommentLike::class);
    }
}
