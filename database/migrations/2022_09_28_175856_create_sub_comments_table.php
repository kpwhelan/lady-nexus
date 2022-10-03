<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('sub_comments', function (Blueprint $table) {
            $table->id();
            $table->text('sub_comment');
            $table->integer('comment_id');
            $table->integer('user_id');
            $table->timestamps();
        });
    }

    public function down() {
        Schema::dropIfExists('sub_comments');
    }
};
