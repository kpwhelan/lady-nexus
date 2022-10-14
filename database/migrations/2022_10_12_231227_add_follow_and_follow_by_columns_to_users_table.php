<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up() {
        Schema::table('users', function (Blueprint $table) {
            $table->json('follows')->nullable();
            $table->json('followed_by')->nullable();
        });
    }

    public function down() {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('follows');
            $table->dropColumn('followed_by');
        });
    }
};
