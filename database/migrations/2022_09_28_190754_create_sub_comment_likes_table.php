<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('sub_comment_likes', function (Blueprint $table) {
            $table->id();
            $table->integer('sub_comment_id');
            $table->integer('user_id');
            $table->boolean('active');
            $table->timestamps();
        });
    }

    public function down() {
        Schema::dropIfExists('sub_comment_likes');
    }
};
