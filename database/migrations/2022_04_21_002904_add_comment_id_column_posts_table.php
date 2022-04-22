<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::table('posts', function($table) {
            $table->integer('comment_id')->nullable();
        });
    }

    public function down() {
        Schema::table('posts', function($table) {
            $table->dropColumn('comment_id');
        });
    }
};
