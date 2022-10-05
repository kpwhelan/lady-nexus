<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::table('posts', function (Blueprint $table) {
            $table->boolean('active');
        });

        Schema::table('comments', function (Blueprint $table) {
            $table->boolean('active');
        });

        Schema::table('sub_comments', function (Blueprint $table) {
            $table->boolean('active');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->boolean('active');
        });
    }

    public function down() {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropColumn('active');
        });

        Schema::table('comments', function (Blueprint $table) {
            $table->dropColumn('active');
        });

        Schema::table('sub_comments', function (Blueprint $table) {
            $table->dropColumn('active');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('active');
        });
    }
};
