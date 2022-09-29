<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubCommentLike extends Model {
    use HasFactory;

    protected $fillable = [
        'user_id',
        'sub_comment_id',
        'active'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function sub_comment() {
        return $this->belongsTo(SubComment::class);
    }
}
