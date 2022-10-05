<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Post extends Model {
    use HasFactory;

    protected $fillable = [
        'post',
        'user_id',
        'category_id',
        'active'
    ];

    protected $attributes = [
        'active' => true
    ];

    public function user(): BelongsTo {
        return $this->belongsTo(User::class);
    }

    public function comments(): HasMany {
        return $this->hasMany(Comment::class);
    }

    public function category(): BelongsTo {
        return $this->belongsTo(Category::class);
    }

    public function post_likes(): HasMany {
        return $this->hasMany(PostLike::class)->where('active', true);
    }

    public function comment_likes(): HasManyThrough {
        return $this->hasManyThrough(CommentLike::class, Comment::class);
    }
}
