<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubComment extends Model {
    use HasFactory;

    protected $fillable = [
        'sub_comment',
        'comment_id',
        'user_id',
        'active'
    ];

    protected $attributes = [
        'active' => true
    ];

    public function comment() {
        return $this->belongsTo(Comment::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function sub_comment_likes() {
        return $this->hasMany(SubCommentLike::class)->where('active', true);
    }
}
